// Rebuildable layout samples; never imports PPT Master or Tosea.
const fs=require('fs'),path=require('path'),PptxGenJS=require('pptxgenjs');
const read=n=>JSON.parse(fs.readFileSync(path.join(__dirname,n),'utf8'));
const themes=read('themes.json'),d=read('data.json');
const args=process.argv.slice(2),arg=(k,def)=>args.includes(k)?args[args.indexOf(k)+1]:def;
const theme=arg('--theme','shenzhen'),t=themes[theme];
if(!t)throw Error('Unknown theme');
const out=path.resolve(__dirname,arg('--out',`output/${theme}`));
if(fs.existsSync(out))throw Error('Refuse existing output directory: '+out);
const sum=a=>a.reduce((s,n)=>s+n,0),pct=n=>(100*n).toFixed(1)+'%';
d.revenue.forEach((v,i)=>{if(sum(d.geography.map(r=>r[i+1]))!==v)throw Error('Geography does not reconcile');});
const cash=c=>c.operating.map((v,i)=>v-c.capex[i]);
const fc=cash(d.cashCurrent),fp=cash(d.cashPrior),bytd=sum(d.bookings.slice(-3));
const p=new PptxGenJS();p.layout='LAYOUT_WIDE';p.author='Patrick';p.subject='可换配色的经营财报版式；全部合成演示数据';p.title='经营财报版式样张';p.lang='zh-CN';
p.theme={headFontFace:t.titleFont,bodyFontFace:t.bodyFont,lang:'zh-CN'};
function tx(s,text,x,y,w,h,size=15,opts={}){s.addText(String(text),{x,y,w,h,fontFace:t.bodyFont,fontSize:size,color:t.text,margin:0,breakLine:false,vertAlign:'baseline',...opts});}
function rule(s,x,y,w,color=t.rule){s.addShape(p.ShapeType.line,{x,y,w,h:0,line:{color,width:.8}});}
function panel(s,x,y,w,h){s.addShape(p.ShapeType.rect,{x,y,w,h,line:{color:t.panel,transparency:100},fill:{color:t.panel}});}
function base(title,id,subtitle){let s=p.addSlide();s.background={color:t.background};tx(s,title,.7,.45,11.7,.55,27,{bold:true,fontFace:t.titleFont});tx(s,subtitle,.73,1.12,11.8,.33,11,{color:t.muted});rule(s,.7,6.93,11.9);tx(s,'版式样张｜合成数据，非真实经营结果',.73,7.06,8,.2,9,{color:t.muted});tx(s,id+' / 06',11.5,7.03,1.05,.25,10,{align:'right',color:t.accent});s.addNotes(`Pattern ER${id}; synthetic demo only. Source layout inspiration: https://mp.weixin.qq.com/s/0-iTwczyESrr2J88LyaMxg ; no author logo, original data or brand system reproduced.`);return s;}
function metric(s,label,value,detail,x,y,w=3.4){tx(s,label,x,y,w,.3,14,{color:t.muted});tx(s,value,x,y+.39,w,.68,38,{bold:true,fontFace:t.numberFont,color:t.primary});tx(s,detail,x,y+1.15,w,.45,12,{color:t.muted});}
function table(s,rows,x,y,widths,opts={}){
 const {lastColumn=true,lastRow=false,rowH=.53,fontSize=14}=opts;
 const rr=rows.map((r,i)=>r.map((v,j)=>({text:String(v),options:{bold:i===0||(lastRow&&i===rows.length-1),color:(i===0||(lastRow&&i===rows.length-1))?t.white:t.text,fill:i===0?t.primary:(lastRow&&i===rows.length-1)?t.primary:(lastColumn&&j===r.length-1)?t.panel:t.white,align:j===0?'left':'right'}})));
 s.addTable(rr,{x,y,w:sum(widths),colW:widths,rowH,fontFace:t.bodyFont,fontSize,margin:[.09,.12,.09,.12],border:{type:'solid',color:t.rule,pt:.5},autoPage:false,verbose:false});
}
// ER01: headline metrics; large blank spaces deliberately retained.
{
 const s=base('经营概览：增长、利润与现金放在一起看','01','ER01  大数字概览与评审目标  ·  金额：演示单位；期间：Y2 Q3');
 metric(s,'本期收入',d.revenue[2],`较上季 +${pct(d.revenue[2]/d.revenue[1]-1)}`,.75,1.95);
 metric(s,'经营利润率',d.margin[2]+'%',`较上季 +${d.margin[2]-d.margin[1]} 个百分点`,4.98,1.95);
 metric(s,'每股收益',d.eps[2].toFixed(2),`较上季 +${pct(d.eps[2]/d.eps[1]-1)}`,9.17,1.95,3.25);
 rule(s,.75,4.08,11.75);metric(s,'本期自由现金流',fc[2],`前三季度累计 ${sum(fc)}；经营现金流减资本支出`,.75,4.55,3.7);
 panel(s,4.98,4.48,7.43,1.78);tx(s,'本次评审要回答什么',5.25,4.72,6.85,.32,18,{bold:true,color:t.accent});tx(s,'增长是否带来更好的盈利和现金？\n哪些变化需要管理层作出取舍？',5.25,5.25,6.7,.72,17);
}
// ER02: observations directly above the matrix they explain.
{
 const s=base('结构分析：先说变化，再看本期明细','02','ER02  结构摘要与本期明细  ·  金额：演示单位');
 [['北区贡献一半收入','本期 36，占总收入 50%。'],['三个区域同步增长','各区较上季均增长 9.1%。'],['先核实结构，再解释原因','表中没有价格、销量或客户因素证据。']].forEach((r,i)=>{let x=.75+i*4.12;tx(s,r[0],x,1.8,3.65,.45,17,{bold:true});tx(s,r[1],x,2.45,3.65,.8,14,{color:t.muted});});
 table(s,[['业务区域','Y2 Q1','Y2 Q2','Y2 Q3'],...d.geography,['合计',...d.revenue]],.75,3.56,[3.15,2.85,2.85,2.85],{lastRow:true,rowH:.48,fontSize:15});
 tx(s,'读表提示：突出本期列；没有证据的增长原因，不从图表外观推断。',.8,6.39,11.8,.3,12,{color:t.muted});
}
// ER03: genuinely native chart with embedded workbook, not a bar-shaped image.
{
 const s=base('订单复盘：指标说明含义，趋势提供上下文','03','ER03  四指标与趋势  ·  金额：演示单位；订单不等于当期收入');
 metric(s,'本期新增订单',d.bookings.at(-1),'Y2 Q3',.75,1.82,2.8);metric(s,'前三季度订单',bytd,'Y2 Q1—Q3 合计',3.86,1.82,2.85);
 metric(s,'本期订单 / 收入',(d.bookings.at(-1)/d.revenue.at(-1)).toFixed(2)+'×',`同期间：${d.bookings.at(-1)} / ${d.revenue.at(-1)}`,.75,3.6,2.8);metric(s,'累计订单 / 收入',(bytd/sum(d.revenue)).toFixed(2)+'×',`同期间：${bytd} / ${sum(d.revenue)}`,3.86,3.6,2.85);
 panel(s,.75,5.52,5.82,1.02);tx(s,'管理含义',.95,5.69,5.38,.29,15,{bold:true,color:t.accent});tx(s,'订单增长之后，还需核实交付能力、转化时间与回款条件。',.95,6.05,5.36,.35,12);
 tx(s,'新增订单趋势',7.15,1.83,5.15,.4,17,{bold:true});
 s.addChart(p.ChartType.bar,[{name:'新增订单',labels:d.quarters,values:d.bookings}],{x:7.02,y:2.46,w:5.55,h:3.85,barDir:'col',catAxisLabelFontFace:t.numberFont,catAxisLabelFontSize:12,valAxisLabelFontSize:12,valAxisMinVal:0,valAxisMaxVal:100,valAxisMajorUnit:20,showLegend:false,showTitle:false,showValue:true,dataLabelPosition:'outEnd',dataLabelFormatCode:'0',dataLabelColor:t.text,dataLabelFontSize:12,chartColors:[t.primary],catAxisLineColor:t.rule,valAxisLineColor:t.rule,valGridLine:{color:t.rule,width:.4},showBorder:false,showCatName:false,showSerName:false,showShadow:false,gapSize:70,layout:{x:.08,y:.08,w:.88,h:.79}});
}
// ER04: interpretation and table, not a dashboard card grid.
{
 const s=base('资本回报：把结果与原因放在同一页','04','ER04  经营解读与回报矩阵  ·  比率为合成演示值，不构成投资判断');
 [['先看趋势','三项回报指标在示例中逐期改善。'],['再拆分驱动','正式分析需区分利润、投入资本和资产变化。'],['最后作判断','一次比率提升，不足以证明\n长期资本效率改善。']].forEach((r,i)=>{let y=1.89+i*1.42;tx(s,r[0],.75,y,3.1,.34,18,{bold:true,color:t.accent});tx(s,r[1],.75,y+.5,3.25,.66,15);});
 table(s,[['指标',...d.returnPeriods],...d.returns],4.58,2.11,[1.24,1.31,1.31,1.31,1.31,1.31],{rowH:.62,fontSize:13});
 panel(s,4.58,5.24,7.79,.96);tx(s,'本期列突出，不代表忽略历史口径。\n期间、计算定义和一次性因素应随实际数据一并说明。',4.82,5.44,7.3,.55,14);
}
// ER05: two reconciled native tables.
{
 const s=base('现金复盘：区分本期表现与累计贡献','05','ER05  现金指标与勾稽表  ·  演示口径：自由现金流 = 经营现金流 − 资本支出');
 metric(s,'本期自由现金流',fc[2],'Y2 Q3；演示单位',.75,1.83,2.7);metric(s,'前三季度累计',sum(fc),`对比上年同期 ${sum(fp)}`,3.8,1.83,2.7);
 panel(s,.75,4.04,5.6,1.63);tx(s,'现金改善来自哪里？',.98,4.27,5.1,.35,18,{bold:true,color:t.accent});tx(s,`累计经营现金流由 ${sum(d.cashPrior.operating)} 增至 ${sum(d.cashCurrent.operating)}；\n资本支出由 ${sum(d.cashPrior.capex)} 增至 ${sum(d.cashCurrent.capex)}。`,.98,4.84,5.12,.63,15);
 tx(s,'正式复盘还需解释应收、库存、付款和投资节奏，不能只报告现金余额。',.79,6.06,5.48,.48,12,{color:t.muted});
 [[d.cashPrior,fp,'Y1 前三季度',1.68],[d.cashCurrent,fc,'Y2 前三季度',4.22]].forEach(([c,f,l,y])=>{tx(s,l,6.88,y,5.5,.3,16,{bold:true});table(s,[['项目','Q1','Q2','Q3','累计'],['经营现金流',...c.operating,sum(c.operating)],['资本支出',...c.capex,sum(c.capex)],['自由现金流',...f,sum(f)]],6.85,y+.46,[1.8,.94,.94,.94,.94],{lastRow:true,rowH:.34,fontSize:12});});
}
// ER06: independent discussion issues, no fake arrows suggesting a sequence.
{
 const s=base('资本配置：把财务结果转成六项管理讨论','06','ER06  六项管理议题  ·  示例问题清单，具体决策需使用真实经营证据');
 d.discussion.forEach((r,i)=>{let x=.76+(i%3)*4.15,y=1.79+Math.floor(i/3)*2.5;tx(s,String(i+1).padStart(2,'0'),x,y,1,.52,28,{color:t.accent,bold:true,fontFace:t.numberFont});rule(s,x+1.02,y+.42,2.64);tx(s,r[0],x,y+.77,3.7,.35,18,{bold:true});tx(s,r[1],x,y+1.3,3.66,.57,14);tx(s,r[2],x,y+1.99,3.68,.3,11,{color:t.muted});});
}
fs.mkdirSync(out,{recursive:true});
p.writeFile({fileName:path.join(out,'经营财报版式样张.pptx')}).then(()=>{fs.writeFileSync(path.join(out,'build-manifest.json'),JSON.stringify({theme,slides:6,dataStatus:d.status,nativeChartsExpected:1,nativeTablesExpected:4,dataChecks:'geography totals pass; cash and growth derived from source',verification:'pending PowerPoint and visual QA'},null,2));console.log(out);}).catch(e=>{console.error(e);process.exitCode=1;});
