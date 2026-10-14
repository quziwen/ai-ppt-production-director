const fs=require('fs'),path=require('path'),PptxGenJS=require('pptxgenjs');
const read=n=>JSON.parse(fs.readFileSync(path.join(__dirname,n),'utf8'));
const d=read('data.json'),themes=read('themes.json'),args=process.argv.slice(2);
const opt=(k,f)=>args.includes(k)?args[args.indexOf(k)+1]:f;
const theme=opt('--theme','shenzhen'),t=themes[theme];if(!t)throw Error('Unknown theme');
const out=path.resolve(__dirname,opt('--out',`output/${theme}`));if(fs.existsSync(out))throw Error('Refuse existing output '+out);
const sum=a=>a.reduce((s,n)=>s+n,0),actual=sum(d.expense.map(r=>r[1])),budget=sum(d.expense.map(r=>r[2])),delta=actual-budget;
const signed=n=>(n>0?'+':'')+Number(n.toFixed(1));const pct=n=>(n*100).toFixed(1)+'%';
const impacts=d.materials.map(([label,sq,sp,aq,ap])=>({label,quantity:(aq-sq)*sp,price:(ap-sp)*aq,total:aq*ap-sq*sp}));
for(const r of impacts)if(Math.abs(r.quantity+r.price-r.total)>1e-8)throw Error('Material reconciliation failed');
if(d.trend.actual.at(-1)!==actual||d.trend.budget.at(-1)!==budget)throw Error('Monthly totals inconsistent');
const p=new PptxGenJS();p.layout='LAYOUT_WIDE';p.author='Patrick';p.title='成本费用管控版式样张';p.subject='仅合成演示数据；版式与配色独立';p.lang='zh-CN';p.theme={headFontFace:t.titleFont,bodyFontFace:t.bodyFont,lang:'zh-CN'};
function tx(s,v,x,y,w,h,size=15,o={}){s.addText(String(v),{x,y,w,h,fontFace:t.bodyFont,fontSize:size,color:t.text,margin:0,breakLine:false,...o});}
function rect(s,x,y,w,h,color){s.addShape(p.ShapeType.rect,{x,y,w,h,line:{color,transparency:100},fill:{color}});}
function line(s,x,y,w){s.addShape(p.ShapeType.line,{x,y,w,h:0,line:{color:t.rule,width:.6}});}
function base(title,id,sub){const s=p.addSlide();s.background={color:t.background};rect(s,0,0,13.333,.39,t.primary);tx(s,'成本费用预算与管控  /  模板样张',.65,.075,8,.23,10,{color:t.white});tx(s,id,11.7,.075,1,.23,10,{color:t.white,align:'right'});tx(s,title,.68,.69,12,.58,26,{fontFace:t.titleFont,bold:true});tx(s,sub,.72,1.41,11.9,.3,11,{color:t.muted});line(s,.7,6.96,11.9);tx(s,`合成演示数据 · 非真实经营结果  |  ${d.period}  |  ${id}`, .72,7.08,10.5,.22,9,{color:t.muted});tx(s,`${id.slice(-2)} / 08`,11.5,7.07,1.1,.22,10,{align:'right',color:t.accent});s.addNotes(`Pattern ${id}. Synthetic demo only. Source layout inspiration: https://mp.weixin.qq.com/s/NHaS4-Wy3B5MNCv2q72wmg . Source figures, ratings, thresholds and brand assets not reproduced. Native objects do not prove data-edit refresh behavior.`);return s;}
function label(s,v,x,y,w=5){tx(s,v,x,y,w,.32,16,{bold:true});}
function note(s,v,y=6.42){rect(s,.72,y,11.86,.34,t.panel);tx(s,v,.88,y+.055,11.48,.22,11,{color:t.muted});}
function metric(s,name,value,detail,x,y,w){rect(s,x,y,w,1.18,t.white);tx(s,name,x+.14,y+.11,w-.28,.25,12,{color:t.muted});tx(s,value,x+.14,y+.46,w-.28,.43,27,{bold:true,fontFace:t.numberFont,color:t.primary});tx(s,detail,x+.14,y+.94,w-.28,.17,9,{color:t.muted});}
function table(s,rows,x,y,widths,{fontSize=13,rowH=.43,total=false,varianceCol=-1}={}){const rr=rows.map((r,i)=>r.map((v,j)=>({text:String(v),options:{bold:i===0||(total&&i===rows.length-1),fill:i===0?t.primary:(total&&i===rows.length-1)?t.panel:i%2?t.white:t.background,color:i===0?t.white:(j===varianceCol&&String(v).startsWith('+'))?t.negative:t.text,align:j===0?'left':'center'}})));s.addTable(rr,{x,y,w:sum(widths),colW:widths,rowH,fontFace:t.bodyFont,fontSize,margin:[.08,.1,.08,.1],border:{type:'solid',color:t.rule,pt:.5},autoPage:false});}
function chart(s,type,series,x,y,w,h,extra={}){s.addChart(type,series,{x,y,w,h,showLegend:series.length>1,legendPos:'b',legendFontSize:11,legendFontFace:t.bodyFont,chartColors:[t.primary,t.compare,t.accent,t.negative,t.positive,'8796A8'],catAxisLabelFontFace:t.bodyFont,catAxisLabelFontSize:11,catAxisLabelColor:t.text,valAxisLabelFontSize:11,valAxisLabelColor:t.muted,catAxisLineColor:t.rule,valAxisLineColor:t.rule,valGridLine:{color:t.rule,width:.5},showBorder:false,showTitle:false,showShadow:false,showValue:true,dataLabelPosition:'outEnd',dataLabelFormatCode:'0.#',dataLabelColor:t.text,dataLabelFontSize:11,showCatName:false,showSerName:false,showPercent:false,...extra});}
{
 const s=base('月度成本费用预算与管控','CC01','封面与范围  ·  使用时替换报告期间、范围和预算版本');rect(s,.72,1.98,5.15,4.57,t.primary);tx(s,'预算执行\n差异分析\n责任跟踪',1.02,2.4,4.4,2.35,31,{bold:true,fontFace:t.titleFont,color:t.white});tx(s,'COST & EXPENSE REVIEW',1.04,5.3,4.1,.3,13,{color:'DCE4EF',fontFace:t.numberFont});tx(s,'样张，不是本期经营结论',1.04,5.88,4.1,.3,14,{color:t.white});
 [['期间与范围',`${d.period}；成本与期间费用\n预算版本：${d.budgetVersion}`],['本次报告回答什么','花了多少？哪里超预算？\n哪些差异需要业务解释？'],['会议需要确认什么','核查责任、动作与完成时点；\n没有证据的原因保留待核查。']].forEach((r,i)=>{let y=2.17+i*1.48;label(s,r[0],6.52,y,5.5);tx(s,r[1],6.52,y+.47,5.45,.68,17);});
}
{
 const s=base(`本月成本费用超预算 ${delta} 万元，先定位主要差异`,'CC02','预算总览  ·  金额：万元；差异 = 实际 − 预算；正数表示超支');
 [['实际发生',actual,'六项互斥明细合计'],['预算合计',budget,'使用同一预算版本'],['超预算',signed(delta),`差异率 ${pct(delta/budget)}`],['制造费用差异',signed(d.expense[2][1]-d.expense[2][2]),'本页只定位，不直接判定原因']].forEach((r,i)=>metric(s,...r,.74+i*3.02,1.94,2.78));
 const composition=[...d.expense.slice(0,3).map(r=>r[1]),sum(d.expense.slice(3).map(r=>r[1]))];
 // Percentages in external legend stay readable on all slice colors; regenerate after data changes.
 label(s,'本期构成',.85,3.52,3.6);chart(s,p.ChartType.doughnut,[{name:'实际',labels:['材料','人工','制造费用','期间费用'].map((n,i)=>`${n} ${pct(composition[i]/actual)}`),values:composition}],.78,3.99,4.7,2.2,{showLegend:true,legendPos:'r',showValue:false,showPercent:false,dataLabelPosition:'bestFit',holeSize:65,chartColors:[t.primary,t.compare,t.accent,'788C86']});
 label(s,'实际与预算对比',5.59,3.52,6.5);chart(s,p.ChartType.bar,[{name:'实际',labels:d.expense.map(r=>r[0]),values:d.expense.map(r=>r[1])},{name:'预算',labels:d.expense.map(r=>r[0]),values:d.expense.map(r=>r[2])}],5.4,3.97,7.17,2.28,{barDir:'col',valAxisMinVal:0,valAxisMaxVal:150,valAxisMajorUnit:50,showValue:false});note(s,'实际与预算按同一分类比较；环图的期间费用仅由销售、管理、研发三项组成。');
}
{
 const s=base('材料与制造费用解释了主要超支，管理费用低于预算','CC03','执行明细  ·  金额：万元；预算为正值时，差异率 = 差异 / 预算');
 const rows=[['成本费用项目','实际','预算','差异','差异率','差异方向'],...d.expense.map(([n,a,b])=>[n,a,b,signed(a-b),b===0?'不适用':pct((a-b)/b),a>b?'超支':a<b?'低于预算':'持平']),['合计',actual,budget,signed(delta),pct(delta/budget),'超支']];table(s,rows,.74,2.08,[3.1,1.6,1.6,1.6,1.8,2.1],{fontSize:15,rowH:.48,total:true,varianceCol:3});note(s,'“低于预算”不自动等于节约：先核查业务量、付款/计提节奏、服务水平和预算编制口径。',6.51);
}
{
 const s=base('实际发生逐月上升，差异集中在材料和制造费用','CC04','趋势与差异  ·  金额：万元；不通过趋势外观推断价格、效率或业务因果');
 label(s,'实际与预算趋势',.79,2.07,5.5);chart(s,p.ChartType.line,[{name:'实际',labels:d.trend.months,values:d.trend.actual},{name:'预算',labels:d.trend.months,values:d.trend.budget}],.68,2.56,6.14,3.18,{lineSize:2,showMarker:true,markerSize:5,showValue:false,valAxisMinVal:0,valAxisMaxVal:300,valAxisMajorUnit:100});
 label(s,'本月差异（实际−预算）',7.13,2.07,5.4);chart(s,p.ChartType.bar,[{name:'差异',labels:d.expense.map(r=>r[0]),values:d.expense.map(r=>r[1]-r[2])}],7.04,2.56,5.56,3.18,{barDir:'bar',showLegend:false,valAxisMinVal:-4,valAxisMaxVal:10,valAxisMajorUnit:2,catAxisLabelPos:'low',catAxisLabelFontSize:12,dataLabelFormatCode:'+0;-0;0'});note(s,'下一步核查：业务量变化、采购价格、产能利用，以及费用计提和活动节奏。',6.21);
}
{
 const total=sum(impacts.map(r=>r.total));const s=base(`材料量价合计影响 ${signed(total)} 元，分解须与总差异勾稽`,'CC05','材料量价  ·  独立示例，不与本包万元汇总表混加；用量同单位，价格为元/单位');
 table(s,[['材料','标准量','标准价','实际量','实际价','总差异（元）'],...d.materials.map((r,i)=>[...r,signed(impacts[i].total)])],.74,2.01,[2.0,1.9,1.9,1.9,1.9,2.2],{rowH:.45,fontSize:14,varianceCol:5});
 label(s,'分解：数量影响与价格影响',.81,4.16,7.2);chart(s,p.ChartType.bar,[{name:'数量影响',labels:impacts.map(r=>r.label),values:impacts.map(r=>r.quantity)},{name:'价格影响',labels:impacts.map(r=>r.label),values:impacts.map(r=>r.price)}],.71,4.56,6.6,1.77,{barDir:'col',valAxisMinVal:-100,valAxisMaxVal:200,valAxisMajorUnit:100,dataLabelPosition:'outEnd',dataLabelFormatCode:'0.0'});
 rect(s,7.7,4.55,4.86,1.73,t.panel);tx(s,'数量影响 = (实际量−标准量) × 标准价\n价格影响 = (实际价−标准价) × 实际量\n两者之和 = 实际金额−标准金额',7.94,4.77,4.36,1.03,13);note(s,'这里的“标准量”须按可比产量确定；换一种分解顺序会改变分项，不改变总差异。',6.51);
}
{
 const s=base('先对齐成本口径，再比较不同产品的单位成本','CC06',`产品单位成本  ·  ${d.productUnit}；下列为独立合成示例`);
 table(s,[['产品','材料','人工','制造费用','合计'],...d.products.map(r=>[...r,sum(r.slice(1))])],.75,2.27,[1.6,1.1,1.1,1.4,1.05],{rowH:.57,fontSize:14});
 // Office rejects stacked bars with outEnd label positions, even when values are hidden.
 label(s,'各产品单位成本构成',7.56,2.11,4.9);chart(s,p.ChartType.bar,['材料','人工','制造费用'].map((name,i)=>({name,labels:d.products.map(r=>r[0]),values:d.products.map(r=>r[i+1])})),7.42,2.7,5.15,3.14,{barDir:'col',barGrouping:'stacked',showValue:false,dataLabelPosition:'ctr',valAxisMinVal:0,valAxisMaxVal:300,valAxisMajorUnit:100,chartColors:[t.primary,t.compare,t.accent]});
 tx(s,'比较前先问',.85,5.12,5.9,.32,17,{bold:true,color:t.accent});tx(s,'规格、产量与分摊方法是否可比？\n产品结构变化，不能直接当作成本效率变化。',.85,5.64,6.0,.65,16);note(s,'单位成本按产量加权汇总；本页不对不同产品单位成本作简单相加。',6.51);
}
{
 const s=base('部门费用有增有减，先确认可控范围和核查责任','CC07','部门费用  ·  金额：万元；可控性需要合同、职责与业务条件证据');label(s,'实际与预算',.8,2.08,5.6);
 chart(s,p.ChartType.bar,[{name:'实际',labels:d.departments.map(r=>r[0]),values:d.departments.map(r=>r[1])},{name:'预算',labels:d.departments.map(r=>r[0]),values:d.departments.map(r=>r[2])}],.7,2.62,5.77,3.25,{barDir:'bar',valAxisMinVal:0,valAxisMaxVal:30,valAxisMajorUnit:10,catAxisLabelFontSize:12,dataLabelFormatCode:'0'});
 label(s,'可控性与责任确认',6.88,2.08,5.65);table(s,[['部门','可控性判断','核查角色'],...d.controls],6.87,2.62,[1.13,2.33,2.12],{rowH:.65,fontSize:12});tx(s,'先核实约束，再讨论动作。\n不要把固定费用等同于不可控费用。',6.92,5.85,5.43,.57,14,{color:t.muted});note(s,'角色仅为示例占位，未向任何人分派工作；正式汇报须确认责任人与截止时点。',6.51);
}
{
 const covered=sum(d.actions.map(r=>{const e=d.expense.find(e=>e[0]===r[0]);return e[1]-e[2]}));const s=base('异常台账要把证据、责任和下一步放在一起','CC08','异常与行动  ·  金额：万元；待核查项目不是已认定损失，也不是整改完成');
 table(s,[['异常项目','差异','需要的证据','核查角色','下一动作','状态'],...d.actions.map(r=>{const e=d.expense.find(e=>e[0]===r[0]);return [r[0],signed(e[1]-e[2]),...r.slice(1)];})],.73,2.16,[1.5,.8,2.45,2.65,2.7,1.7],{rowH:.61,fontSize:12,varianceCol:1});
 metric(s,'本表待核查超支',signed(covered),'前三个项目；并非全表净差异',.78,5.35,3.47);tx(s,'会议确认',4.81,5.48,7.3,.35,18,{bold:true,color:t.accent});tx(s,'补齐证据 → 确认原因 → 确认责任与时点\n完成后回看原指标，不只填写“已处理”。',4.81,5.99,7.3,.65,16);
}
fs.mkdirSync(out,{recursive:true});p.writeFile({fileName:path.join(out,'成本费用管控版式样张.pptx')}).then(()=>{fs.writeFileSync(path.join(out,'build-manifest.json'),JSON.stringify({theme,slides:8,synthetic:true,totals:{actual,budget,delta},materialImpacts:impacts,nativeChartsExpected:7,nativeTablesExpected:5,qa:'pending'},null,2));console.log(out);}).catch(e=>{console.error(e);process.exitCode=1;});
