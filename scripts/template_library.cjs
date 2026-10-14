'use strict';
// Portable local template lookup and materialization. No network or third-party engine.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),http=require('node:http');
const skillRoot=path.resolve(__dirname,'..'),collections=path.join(skillRoot,'assets/templates/user-collections');
const argv=process.argv.slice(2),option=(key,fallback)=>{const i=argv.indexOf(key);if(i<0)return fallback;const v=argv[i+1];if(!v||v.startsWith('--'))throw Error('Missing value for '+key);return v;};
function inside(base,rel){if(path.isAbsolute(rel))throw Error('Expected relative asset path');const p=path.resolve(base,rel);if(p!==base&&!p.startsWith(base+path.sep))throw Error('Asset path leaves collection: '+rel);return p;}
function inventory(){if(!fs.existsSync(collections))return[];return fs.readdirSync(collections,{withFileTypes:true}).filter(x=>x.isDirectory()&&!x.isSymbolicLink()).map(x=>{const root=path.join(collections,x.name),file=path.join(root,'catalog.json');if(!fs.existsSync(file))return null;const catalog=JSON.parse(fs.readFileSync(file,'utf8'));if(catalog.schemaVersion!==1||!Array.isArray(catalog.entries))throw Error('Unsupported collection '+x.name);return{root,catalog};}).filter(Boolean);}
function resolveEntry(id){const found=inventory().flatMap(c=>c.catalog.entries.filter(e=>e.id===id).map(entry=>({...c,entry})));if(found.length!==1)throw Error(found.length?'Ambiguous template ID '+id:'Unknown template ID '+id);return found[0];}
function filesUnder(dir){const out=[];for(const d of fs.readdirSync(dir,{withFileTypes:true})){if(d.isSymbolicLink())throw Error('Symlink not allowed in template resources');const p=path.join(dir,d.name);if(d.isDirectory())out.push(...filesUnder(p));else if(d.isFile())out.push(p);}return out;}
function validateCollection(c){const ids=new Set(),errors=[];for(const e of c.catalog.entries){if(ids.has(e.id))errors.push('Duplicate '+e.id);ids.add(e.id);for(const rel of [...e.resources,...e.previewImages.map(i=>i.path),...(e.nativeDecks||[]).map(i=>i.path),...(e.templateHtml?[e.templateHtml]:[])]){try{const p=inside(c.root,rel);if(!fs.existsSync(p))errors.push('Missing '+rel);}catch(x){errors.push(x.message);}}}const manifestFile=path.join(c.root,'asset-manifest.json');if(fs.existsSync(manifestFile)){const manifest=JSON.parse(fs.readFileSync(manifestFile,'utf8'));for(const f of manifest.files){const p=inside(c.root,f.path);if(!fs.existsSync(p)){errors.push('Missing '+f.path);continue;}const hash=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');if(hash!==f.sha256)errors.push('Changed asset '+f.path);}}return{collection:c.catalog.id,entries:c.catalog.entries.length,status:errors.length?'FAIL':'PASS',errors};}
function materialize(id,out,requestedTheme){
 const c=resolveEntry(id),e=c.entry,dest=path.resolve(out);if(dest===skillRoot||dest.startsWith(skillRoot+path.sep))throw Error('Output must be outside the installed Skill');
 if(fs.existsSync(dest))throw Error('Output already exists; choose a new directory: '+dest);
 const resources=[...new Set(e.resources)],copies=[];
 for(const rel of resources){const src=inside(c.root,rel);if(!fs.existsSync(src))throw Error('Missing resource '+rel);for(const file of filesUnder(src))copies.push({src:file,rel:path.relative(c.root,file)});}
 const theme=requestedTheme||e.defaultTheme||c.catalog.defaultTheme,referenceTheme=e.nativeDecks?.find(x=>x.theme!=='shenzhen')?.theme;
 const mappedTheme=theme==='reference'&&referenceTheme?referenceTheme:theme;
 if(e.nativeDecks&&!e.nativeDecks.some(x=>x.theme===mappedTheme))throw Error('Unsupported native theme: '+theme);
 fs.mkdirSync(dest,{recursive:true});for(const cp of copies){const target=inside(dest,cp.rel);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(cp.src,target);}
 const chosenDeck=e.nativeDecks?.find(x=>x.theme===mappedTheme);
 const contract={templateId:e.id,templateName:e.name,collectionId:c.catalog.id,theme:mappedTheme,selectedDimensions:e.selected,selectionOwner:e.selectionOwner,source:e.source,kind:e.kind,nativeTemplate:chosenDeck||null,htmlTemplate:e.templateHtml||null,referenceOnly:e.kind==='visual-reference-pattern',sampleData:'synthetic-or-source-reference; replace with current verified deck data',requireEditableOutput:'Follow current Deck Brief E/H targets; rebuild visuals as needed',status:'template-materialized; deck-production-not-run'};
 fs.writeFileSync(path.join(dest,'template-selection.json'),JSON.stringify(contract,null,2)+'\n','utf8');
 fs.writeFileSync(path.join(dest,'README.md'),`# ${e.id} · ${e.name}\n\n主题：${mappedTheme}。源文件已复制到本目录，可在其他项目使用。\n\n${chosenDeck?`PPTX：${chosenDeck.path}，本版式在第 ${chosenDeck.slideIndex} 页。按内容制作所需页面，保留原模板。`:e.templateHtml?`HTML 源码：${e.templateHtml}。制作时复制并替换本次文案，按模板选择记录调整配色、字体与尺寸，再执行所需 PPTX 导出与检查。`:`视觉参考：${e.resources[0]}/reference.jpg，结构说明：${e.resources[0]}/layout.json。先查看原图再重建可编辑对象。`}\n\n模板选择已记录于 template-selection.json；正式规则从本次工作区动态读取。所有演示数字、判断和业务归属必须用本次资料替换。\n`,'utf8');
 return{status:'materialized',id:e.id,theme:mappedTheme,out:dest,files:copies.length+2,contract};
}
function serve(port){
 if(!Number.isInteger(port)||port<1024||port>65535)throw Error('Port must be 1024..65535');
 const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.md':'text/plain; charset=utf-8','.cjs':'text/plain; charset=utf-8','.pptx':'application/vnd.openxmlformats-officedocument.presentationml.presentation'};
 const catalogs=inventory();if(!catalogs.length)throw Error('No installed user template collection');
 http.createServer((req,res)=>{try{if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}let name=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);if(name==='/'){res.writeHead(302,{Location:'/'+catalogs[0].catalog.id+'/index.html'}).end();return;}const file=inside(collections,name.slice(1));if(!fs.existsSync(file)||!fs.statSync(file).isFile()||!mime[path.extname(file)]){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':mime[path.extname(file)],'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);}catch{res.writeHead(400).end();}}).listen(port,'127.0.0.1',()=>console.log('Template library: http://127.0.0.1:'+port+'/'));
}
try{
 if(argv.includes('--help')||!argv.length){console.log('node template_library.cjs --list [--query text] [--kind kind]\nnode template_library.cjs --show ID\nnode template_library.cjs --materialize ID --out NEW_DIR [--theme shenzhen|reference]\nnode template_library.cjs --check\nnode template_library.cjs --serve [--port 49115]');}
 else if(argv.includes('--list')){const q=option('--query','').toLowerCase(),kind=option('--kind','');const rows=inventory().flatMap(c=>c.catalog.entries.filter(e=>(!q||[e.id,e.name,e.group,e.use].join(' ').toLowerCase().includes(q))&&(!kind||e.kind===kind)).map(e=>({id:e.id,name:e.name,group:e.group,kind:e.kind,selected:e.selected,themes:e.themes,preview:path.join(c.root,e.previewImages[0].path)})));console.log(JSON.stringify(rows,null,2));}
 else if(argv.includes('--show')){const c=resolveEntry(option('--show'));console.log(JSON.stringify({...c.entry,collectionRoot:c.root},null,2));}
 else if(argv.includes('--materialize')){const out=option('--out');if(!out)throw Error('--out is required');console.log(JSON.stringify(materialize(option('--materialize'),out,option('--theme')),null,2));}
 else if(argv.includes('--check')){const result=inventory().map(validateCollection);console.log(JSON.stringify(result,null,2));if(result.some(x=>x.status==='FAIL'))process.exitCode=1;}
 else if(argv.includes('--serve'))serve(Number(option('--port','49115')));
 else throw Error('Unknown command; use --help');
}catch(e){console.error(e.message);process.exitCode=1;}
