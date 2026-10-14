'use strict';
// Template sample builder; separate from Patrick Director's Deck IR exporters.
const fs=require('node:fs'),path=require('node:path');
const pptxgen=require('pptxgenjs');
const args=process.argv.slice(2), arg=(k,d)=>args.includes(k)?args[args.indexOf(k)+1]:d;
const themeId=arg('--theme','shenzhen'), dest=path.resolve(arg('--out','output/new-samples'));
const themes=JSON.parse(fs.readFileSync(path.join(__dirname,'themes.json'),'utf8'));
const d=JSON.parse(fs.readFileSync(path.join(__dirname,'data.json'),'utf8'));
const patterns=JSON.parse(fs.readFileSync(path.join(__dirname,'patterns.json'),'utf8')).patterns;
const t=themes[themeId]; if(!t)throw Error('Unknown theme');
if(fs.existsSync(dest))throw Error('Refuse existing output directory: '+dest);
if(d.status!=='synthetic-demo-only')throw Error('Sample builder only accepts explicitly synthetic data');
for(const key of ['cashBridge','operatingBridge','financeBridge','productBridge','forecastBridge']){
  const v=d[key].values;if(Math.abs(v.slice(0,-1).reduce((a,b)=>a+b,0)-v.at(-1))>1e-8)throw Error(key+' does not reconcile');
}
if(d.before+d.actions.reduce((s,r)=>s+Number(r[2]),0)!==d.after)throw Error('Action bridge mismatch');
if(d.productStock.reduce((a,b)=>a+b,0)!==d.stockAfter.reduce((a,b)=>a+b,0))throw Error('Inventory totals mismatch');
for(const s of d.scenario)if(Math.max(0,d.safety-s.cash)!==s.gap)throw Error('Scenario mismatch');
fs.mkdirSync(dest,{recursive:true});
const p=new pptxgen();p.layout='LAYOUT_WIDE';p.author='Patrick · template reconstruction';p.subject='Synthetic data; reference-inspired editable samples';p.title='财务分析版式包 v0.1 · '+t.name;p.lang='zh-CN';
p.theme={headFontFace:t.titleFont,bodyFontFace:t.bodyFont,lang:'zh-CN'};
const W=13.333333,H=7.5, manifest=[];
const text=(s,txt,x,y,w,h,size=14,options={})=>s.addText(String(txt),{x,y,w,h,fontFace:t.bodyFont,fontSize:size,color:t.text,margin:0,breakLine:false,valign:'mid',...options});
const rect=(s,x,y,w,h,color,options={})=>s.addShape(p.ShapeType.rect,{x,y,w,h,line:{color,transparency:100},fill:{color},...options});
const line=(s,x,y,w,h=0,color=t.rule,width=.7,dash)=>s.addShape(p.ShapeType.line,{x,y,w,h,line:{color,width,...(dash?{dashType:dash}:{})}});
function icon(s,x,y,i){
 s.addShape(p.ShapeType.ellipse,{x,y,w:.27,h:.27,line:{color:t.secondary,width:.8},fill:{color:t.background,transparency:100}});
 // Neutral metric marker: never imply currency/percent/time from column position.
 for(let n=0;n<3;n++)rect(s,x+.065+n*.045,y+.19-n*.04,.025,.035+n*.04,t.secondary);
}
function base(id,title,kpis){
 const s=p.addSlide();s.background={color:t.background};
 rect(s,.54,.48,.045,.40,t.accent);text(s,title,.72,.43,11.65,.55,t.titleSize,{fontFace:t.titleFont,bold:true});
 text(s,id,.74,1.04,8,.20,10,{color:t.accentText,charSpacing:1.3});
 text(s,String(p._slides.length).padStart(2,'0')+' / 09',11.9,.55,.8,.25,10,{align:'right',color:t.muted});
 if(kpis){kpis.forEach(([label,value,flag],i)=>{
  const x=.73+i*2.0;icon(s,x+.77,1.46,i);text(s,label,x,1.80,1.82,.28,12,{align:'center',color:t.muted});
  text(s,value,x,2.12,1.82,.47,t.metricSize,{align:'center',fontFace:t.numberFont,bold:true,color:flag?t.risk:t.primary});
  if(i<5)line(s,x+1.94,1.50,0,1.08);
 });line(s,.72,2.73,11.88);}
 text(s,'版式样张｜合成演示数据，非真实经营结果',.73,7.10,8,.20,9,{color:t.muted});
 text(s,t.name,9.4,7.10,3.2,.20,9,{color:t.muted,align:'right'});
 s.addNotes('Pattern '+id+'; user screenshots 2026-10-03; source https://mp.weixin.qq.com/s/S6rDe9YA3Ijo5Au45Z5p9g. All data synthetic. Theme '+themeId+'. Waterfalls are native shapes, not Excel-linked charts. Standard charts and tables are native. Layout inference Provisional, user acceptance pending.');
 manifest.push({slide:p._slides.length,pattern:id,title,waterfall:'native-shapes-when-present',data:d.status,theme:themeId});return s;
}
function footer(s,lead,detail){rect(s,.72,6.48,11.88,.44,t.panel);rect(s,.72,6.48,.055,.44,t.accent);text(s,lead,.89,6.52,3.25,.34,13,{bold:true,color:t.accentText});text(s,detail,4.3,6.53,8.05,.32,11.5,{color:t.muted});}
function head(s,label,x=.74,y=2.90,w=5.65){rect(s,x,y+.035,.035,.19,t.accent);text(s,label,x+.14,y,w-.15,.29,14,{bold:true});}
function opt(x,y,w,h,extra={}){return {x,y,w,h,catAxisLabelFontFace:t.bodyFont,valAxisLabelFontFace:t.numberFont,dataLabelBkgrdColor:t.background,
 catAxisLabelFontSize:t.chartSize,catAxisLabelFrequency:1,valAxisLabelFontSize:10,dataLabelFormatCode:'0.0',dataLabelColor:t.text,dataLabelPosition:'outEnd',dataLabelFormatCodeSourceLinked:false,dataLabelFontSize:12,
 showLegend:false,showTitle:false,showValue:true,catAxisLineShow:true,catAxisLineColor:t.rule,valAxisLineShow:false,
 catAxisMajorTickMark:'none',valAxisMajorTickMark:'none',catGridLine:{style:'none'},valGridLine:{style:'none'},valAxisMinVal:0,
 chartArea:{fill:{color:t.background},border:{color:t.background}},plotArea:{fill:{color:t.background},border:{color:t.background}},
 chartColors:[t.primary,t.neutral,t.accent],showBorder:false,showCatName:false,legendFontFace:t.bodyFont,legendFontSize:11,legendPos:'t',...extra};}
function bars(s,labels,series,x,y,w,h,extra={}){if(extra.barDir==='bar'){labels=[...labels].reverse();series=series.map(v=>({...v,values:[...v.values].reverse()}));}s.addChart(p.ChartType.bar,series.map((v,i)=>({name:v.name,labels,values:v.values})),opt(x,y,w,h,{barDir:'col',catAxisLabelPos:'low',gapSizePct:95,chartColors:series.length===1?[t.primary]:[t.primary,t.neutral,t.accent],...extra}));}
function combo(s,labels,values,lineValues,x,y,w,h,leftName,rightName,rightMax){
 s.addChart([{type:p.ChartType.bar,data:[{name:leftName,labels,values}],options:{chartColors:[t.neutral],showValue:true,dataLabelPosition:'outEnd',dataLabelFormatCode:'0.0',barDir:'col',gapSizePct:150}},
 {type:p.ChartType.line,data:[{name:rightName,labels,values:lineValues}],options:{chartColors:[t.primary],secondaryValAxis:true,secondaryCatAxis:true,showValue:true,dataLabelPosition:'b',dataLabelFormatCode:'0',lineSize:1.7,lineDataSymbol:'circle',lineDataSymbolSize:4}}],
 opt(x,y,w,h,{showLegend:true,showValue:true,valAxes:[{valAxisMinVal:0,valAxisMaxVal:Math.ceil(Math.max(...values)*1.3),valGridLine:{style:'none'},valAxisLineShow:false,valAxisLabelFontSize:10},{valAxisMinVal:0,valAxisMaxVal:rightMax,valGridLine:{style:'none'},valAxisLineShow:false,valAxisLabelFontSize:10}],catAxes:[{catAxisLabelPos:'low',catAxisLabelFontFace:t.bodyFont,catAxisLabelFontSize:11},{catAxisHidden:true}],showCatName:false}));
}
function waterfall(s,obj,x,y,w,h){
 const {labels,values}=obj;let cur=0;const seg=values.map((v,i)=>{if(i===0||i===values.length-1){cur=v;return [0,v];}const last=cur;cur+=v;return [last,cur];});
 const max=Math.ceil(Math.max(...seg.flat())*1.19/10)*10,min=Math.min(0,...seg.flat()),rng=max-min;const plotTop=y+.25,plotH=h-.9,plotX=x+.25,plotW=w-.45;
 const yy=v=>plotTop+(max-v)/rng*plotH,step=plotW/values.length,bw=step*.52;
 [0,max/2].forEach(v=>{line(s,plotX,yy(v),plotW,0,t.rule,.5);text(s,v.toFixed(0),x-.05,yy(v)-.1,.28,.2,9,{color:t.muted});});
 seg.forEach(([a,b],i)=>{const xx=plotX+step*i+(step-bw)/2,end=i===0||i===seg.length-1;rect(s,xx,yy(Math.max(a,b)),bw,Math.max(.012,Math.abs(a-b)/rng*plotH),end?t.primary:(values[i]<0?t.neutral:t.accent));
  text(s,(!end&&values[i]>0?'+':'')+values[i].toFixed(1),xx-.12,yy(Math.max(a,b))-.30,bw+.24,.23,12,{align:'center',bold:end,color:end?t.primary:t.muted,fontFace:t.numberFont});
  text(s,labels[i],plotX+step*i-.04,plotTop+plotH+.11,step+.08,.40,11,{align:'center'});
  if(i<seg.length-1)line(s,xx+bw,yy(b),step-bw,0,t.secondary,.6,'dash');
 });
}
const six=(a)=>a.map(([l,v,f])=>[l,String(v),f]);
let s;
// FA02: workflow, no KPI row.
s=base('FA02 · 分析工作流','现金分析要从数字变化走到业务行动');
text(s,'每一步都交付一个可供下一步使用的结果',.75,1.57,11.8,.45,18,{color:t.muted});
const steps=[['判断阶段','识别增长\n与回款节奏','阶段判断'],['看清结构','拆解资产、负债\n与现金','关键结构'],['定位变化','区分经营、投资\n与融资','变化来源'],['解释原因','与业务核对\n事件和条件','业务解释'],['明确行动','确定责任、时点\n和验收','行动清单']];
steps.forEach((a,i)=>{const x=.75+i*2.40;text(s,String(i+1).padStart(2,'0'),x,2.35,1,.55,27,{color:t.accentText,fontFace:t.numberFont,bold:true});text(s,a[0],x,3.03,2.15,.42,20,{bold:true});line(s,x,3.66,1.95,0,t.rule,1);text(s,a[1],x,4.05,1.92,.85,15,{color:t.muted,breakLine:false});text(s,'输出',x,5.16,2,.25,11,{color:t.accentText});text(s,a[2],x,5.52,2.10,.37,16,{bold:true});if(i<4)text(s,'→',x+1.83,2.48,.38,.4,20,{color:t.secondary});});
footer(s,'财务与业务共同解释','先看变化，再确认原因，最后落实责任与动作。');
// FA03
s=base('FA03 · 总览与现金桥','收入增长，仍需检查现金是否同步改善',six([['营业收入','72.0'],['利润','9.0'],['销售收现率','94%'],['经营现金','4.0'],['现金净变化','−2.0',true],['期末现金','22.0']]));
head(s,'收入与经营现金趋势｜M1—M6');head(s,'现金余额变化｜演示单位',6.95);line(s,6.66,2.97,0,3.08);
combo(s,d.months,d.revenue,d.cash,.72,3.31,5.78,2.88,'收入（左轴）','经营现金（右轴）',12);waterfall(s,d.cashBridge,6.92,3.34,5.7,2.92);
footer(s,'增长不等于现金改善','用趋势看背离，用现金桥说明经营、投资和融资的贡献。');
// FA04
s=base('FA04 · 主因拆解','应收与库存增加，需要拆开看资金占用',six([['利润','9.0'],['非现金调整','2.0'],['应收增加','5.0',true],['库存增加','6.0',true],['应付增加','4.0'],['经营现金','4.0']]));
head(s,'利润到经营现金｜演示单位');waterfall(s,d.operatingBridge,.70,3.4,6.0,2.80);line(s,6.79,2.96,0,3.20);
head(s,'库存结构｜前期 / 本期',7.04,2.90,5.5);
['原材料','在产品','产成品'].forEach((label,i)=>{const x=7.18+i*1.40;rect(s,x,3.29,.09,.09,t.stackColors[i]);text(s,label,x+.15,3.25,1.13,.20,10,{color:t.muted});});
bars(s,['前期','本期'],[{name:'原材料',values:[12,16]},{name:'在产品',values:[8,10]},{name:'产成品',values:[6,8]}],7.02,3.53,5.57,.98,{barGrouping:'stacked',showLegend:false,showValue:false,dataLabelPosition:'ctr',chartColors:t.stackColors,valAxisMaxVal:40,valAxisMajorUnit:20,showCatName:false,catAxisLabelFontSize:10});
head(s,'投资支出排名｜演示单位',7.04,4.57,5.5);bars(s,d.rank.labels,[{name:'支出',values:d.rank.values}],7.00,4.93,5.57,1.19,{barDir:'bar',catAxisLabelFontSize:10,valAxisMaxVal:5,dataLabelFontSize:10});
footer(s,'从总额继续追到结构','本页为密集阅读版式；现场投影建议拆成两页。');
// FA05
s=base('FA05 · 投入与产出','投入与产出存在时差，付款需匹配进度',six([['资本支出','9.0'],['主要设备','4.0'],['厂房改造','2.8'],['产能目标','+20%'],['在建投入','12.0'],['回收期','4年']]));
head(s,'支出结构｜演示单位');head(s,'月度投入与累计产能｜演示期',6.95);line(s,6.66,2.97,0,3.1);
bars(s,d.rank.labels,[{name:'支出',values:d.rank.values}],.74,3.35,5.78,2.9,{barDir:'bar',valAxisMaxVal:5});
combo(s,d.months,d.capex,d.capacity,6.9,3.33,5.72,2.92,'投入（左轴）','产能增幅%（右轴）',25);
footer(s,'投入在前，产出在后','双轴分别标注单位；实际应用须核对订单与投产条件。');
// FA06
s=base('FA06 · 渠道与净变化','新增资金与偿债应放在一起判断',six([['期初资金','12.0'],['新增借款','6.0'],['债券融资','3.0'],['偿债支出','8.0',true],['期末资金','13.0'],['净变化','+1.0']]));
head(s,'融资渠道结构｜演示单位');head(s,'资金净变化桥｜演示单位',6.95);line(s,6.66,2.97,0,3.1);
bars(s,d.channels.labels,[{name:'余额',values:d.channels.values}],.74,3.35,5.78,2.9,{barDir:'bar',valAxisMaxVal:40,valAxisMajorUnit:10});waterfall(s,d.financeBridge,6.92,3.36,5.7,2.90);
footer(s,'看新增，也看偿还','渠道金额与净现金分开呈现，避免把融资总额当成现金改善。');
// FA07
s=base('FA07 · 增长与现金压力','收入增长之后，还要解释现金去了哪里',six([['产品A收入','27.0'],['产品B收入','18.0'],['产品C收入','15.0'],['增量毛利','12.0'],['材料支付','5.0'],['增量现金','2.0']]));
head(s,'产品收入对比｜前期 / 本期');head(s,'增量毛利到现金｜演示单位',6.95);line(s,6.66,2.97,0,3.1);
bars(s,d.products,[{name:'前期',values:d.salesBefore},{name:'本期',values:d.salesAfter}],.74,3.34,5.78,2.83,{showLegend:true,chartColors:[t.neutral,t.primary],valAxisMaxVal:35});waterfall(s,d.productBridge,6.92,3.36,5.7,2.87);
footer(s,'收入 → 备货 → 付款 → 回款','增长贡献与现金占用需要同时解释。');
// FA08
s=base('FA08 · 结构与效率','总量增加之外，还需识别低周转部分',six([['期末库存','34.0'],['库存增量','8.0'],['产品A库存','16.0'],['产品B库存','10.0'],['产品C周转','48天',true],['其他周转','55天',true]]));
head(s,'库存结构变化｜演示单位');head(s,'产品库存与周转｜演示单位 / 天',6.95);line(s,6.66,2.97,0,3.1);
bars(s,['前期','本期'],[{name:'原材料',values:[12,16]},{name:'在产品',values:[8,10]},{name:'产成品',values:[6,8]}],.74,3.33,5.78,2.91,{barGrouping:'stacked',showLegend:true,showValue:true,dataLabelPosition:'ctr',dataLabelColor:t.white,chartColors:t.stackColors,valAxisMaxVal:42});
combo(s,d.products,d.productStock,d.days,6.91,3.33,5.7,2.91,'库存（左轴）','周转天数（右轴）',70);
footer(s,'优先处理低周转部分','库存压降应按结构和周转判断，不宜简单一刀切。');
// FA09
s=base('FA09 · 预测与情景','先识别现金缺口，再选择弥补措施');
head(s,'基准情景现金变化｜演示单位',.74,1.58,6.0);waterfall(s,d.forecastBridge,.70,2.08,6.05,3.6);line(s,6.78,1.62,0,4.08);
head(s,'相同期间的三种情景假设',7.05,1.58,5.5);
d.scenario.forEach((a,i)=>{const x=7.04+i*1.87;text(s,a.name,x,2.20,1.67,.37,19,{align:'center',bold:true});text(s,'期末现金',x,2.91,1.67,.25,12,{align:'center',color:t.muted});text(s,a.cash.toFixed(1),x,3.3,1.67,.65,31,{align:'center',fontFace:t.numberFont,bold:true});text(s,'距安全线缺口',x,4.08,1.67,.25,11,{align:'center',color:t.muted});text(s,a.gap.toFixed(1),x,4.43,1.67,.48,25,{align:'center',color:a.gap?t.risk:t.primary,fontFace:t.numberFont});text(s,a.condition,x,5.22,1.67,.6,12,{align:'center',color:t.muted});if(i<2)line(s,x+1.76,2.19,0,3.65);});
text(s,'统一安全线：15.0｜仅用于展示情景版式',.77,5.94,11.5,.28,12,{color:t.muted});footer(s,'回款改善 ＋ 支出安排 ＋ 融资','情景值是条件假设，不应写成已经确定的预测结果。');
// FA10
s=base('FA10 · 措施与改善','措施需要明确责任，并说明预计改善幅度');
head(s,'措施、责任与预计贡献',.74,1.58,6);head(s,'措施前后现金｜演示单位',7.15,1.58,5.3);line(s,6.85,1.63,0,4.63);
s.addTable([[{text:'措施',options:{bold:true}},{text:'责任团队',options:{bold:true}},{text:'预计贡献',options:{bold:true}}],...d.actions],{x:.76,y:2.19,w:5.75,h:3.6,colW:[2.65,1.70,1.40],rowH:.56,fontFace:t.bodyFont,fontSize:15,color:t.text,fill:t.background,border:{type:'solid',pt:.6,color:t.rule},margin:[10,6,10,6],autoPage:false});
bars(s,['措施前','措施后'],[{name:'现金',values:[d.before,d.after]}],7.05,2.19,5.48,3.48,{chartColors:[t.primary],valAxisMaxVal:30,dataLabelFontSize:20,dataLabelFormatCode:'0.0'});
text(s,'预计改善 +12.0',7.39,5.92,4.95,.35,19,{bold:true,color:t.accentText,align:'center'});
footer(s,'责任、时点与验收一起落实','措施贡献需核对重复计算、实施条件与落地时间。');
(async()=>{await p.writeFile({fileName:path.join(dest,'财务分析版式样张_'+themeId+'.pptx')});fs.writeFileSync(path.join(dest,'build-manifest.json'),JSON.stringify({version:'0.1',themeId,theme:t,slideCount:manifest.length,patterns:manifest,sourceData:d,editability:{text:'native',table:'native',standardCharts:'native-with-workbook',waterfall:'native-shapes-no-linked-workbook',html:'render-preview-only'},producer:'PptxGenJS (not PPT Master)',status:'generated-not-yet-visually-accepted'},null,2));console.log(JSON.stringify({dest,slides:manifest.length,theme:themeId}));})();
