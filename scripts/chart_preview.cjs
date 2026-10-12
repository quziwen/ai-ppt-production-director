'use strict';
const { resolveChartLayoutDefaults } = require('./chart_layout_defaults.cjs');

// Embedded verbatim in the standalone editor. No external chart library, network,
// or Patrick style rules. SVG units are points; the object box remains in inches.
function renderChartPreview(element) {
  const wrapper = document.createElement('div');
  wrapper.className = 'chart-content';
  wrapper.dataset.chartStatus = 'rendered';
  const issues = [];
  let o = element.options || {};
  const type = element.chart_type || element.chartType || 'bar';
  const series = Array.isArray(element.series) ? element.series : [];
  try { o = resolveChartLayoutDefaults(o, series.length).options; }
  catch (error) { issues.push(error.message); }
  const W = element.w * 72, H = element.h * 72;
  const supported = new Set(('barDir barGrouping chartColors showLegend legendPos legendFontFace legendFontSize legendColor showTitle title titleAlign titleColor titleFontFace titleFontSize showValue dataLabelColor dataLabelFormatCode dataLabelPosition dataLabelBkgrdColor dataLabelFormatCode fontFace fontSize catAxisLabelFontFace catAxisLabelFontSize catAxisLabelColor catAxisLabelFontBold catAxisLabelRotate catAxisOrientation catAxisHidden catAxisLineShow catAxisLineColor catAxisLineSize catAxisTitle catAxisTitleFontFace catAxisTitleFontSize catAxisTitleColor showCatName showLabel showSerName showPercent showCatAxisTitle valAxisLabelFontFace valAxisLabelFontSize valAxisLabelColor valAxisOrientation valAxisHidden valAxisLineShow valAxisLineColor valAxisLineSize valAxisTitle valAxisTitleFontFace valAxisTitleFontSize valAxisTitleColor showValAxisTitle valAxisMinVal valAxisMaxVal valAxisMajorUnit valAxisLabelFormatCode valGridLine catGridLine showMarker markerSize lineSize x y w h').split(' '));
  const fail = message => { issues.push(message); };
  if (!['bar', 'line'].includes(type)) fail('未支持图表类型：' + String(type));
  if (o.barGrouping && o.barGrouping !== (type === 'line' ? 'standard' : 'clustered')) fail('未支持分组方式：' + o.barGrouping);
  if (o.barDir && !['col', 'bar'].includes(o.barDir)) fail('未支持barDir');
  if (type === 'line' && o.barDir === 'bar') fail('折线不能按横向条形解释');
  Object.keys(o).filter(k => !supported.has(k)).forEach(k => fail('未映射选项：' + k));
  Object.keys(o).filter(k=>k.startsWith('show')||k.endsWith('Hidden')||k.endsWith('LineShow')||k.endsWith('FontBold')).forEach(k=>{if(typeof o[k]!=='boolean')fail('开关必须为boolean：'+k);});
  if(o.chartColors!==undefined&&(!Array.isArray(o.chartColors)||!o.chartColors.length||o.chartColors.some(c=>typeof c!=='string'||!/^#?[0-9a-f]{6}$/i.test(c))))fail('chartColors必须是非空六位颜色数组');
  if(o.dataLabelBkgrdColor!==undefined)fail('未支持数据标签背景色');
  if(o.catGridLine&&o.catGridLine.style!=='none')fail('未支持类目网格线');
  if(o.valGridLine&&Object.keys(o.valGridLine).some(k=>!['color','size','width','style'].includes(k)))fail('未支持网格线选项');
  if(o.valGridLine&&o.valGridLine.style&&!['none','solid'].includes(o.valGridLine.style))fail('未支持网格线线型');
  ['showCatName','showLabel','showSerName','showPercent'].filter(k=>o[k]).forEach(k=>fail('未支持数据标签组合：' + k));
  ['catAxisOrientation','valAxisOrientation'].forEach(k=>{if(o[k] && !['minMax','maxMin'].includes(o[k]))fail('未支持轴方向：'+k);});
  if (o.catAxisLabelRotate) fail('旋转类目标签需另外验证');
  if (o.dataLabelPosition && !['outEnd','ctr','t'].includes(o.dataLabelPosition)) fail('未支持标签位置：'+o.dataLabelPosition);
  const formatOK = code => code === undefined || code === 'General' || /^(?:0|#,##0)(?:\.0{1,6})?%?$/.test(code);
  if (!formatOK(o.dataLabelFormatCode) || !formatOK(o.valAxisLabelFormatCode)) fail('未支持的数值格式；不会猜测或丢弃单位');
  const finite = x => typeof x === 'number' && Number.isFinite(x);
  const labels = series[0] && Array.isArray(series[0].labels) ? series[0].labels : [];
  if (!series.length || !labels.length || labels.some(v=>typeof v!=='string'&&typeof v!=='number')) fail('缺少有效系列或单层类目');
  series.forEach((s,i)=>{
    if(!s||typeof s!=='object'||Array.isArray(s)){fail('非法系列：'+(i+1));return;}
    if(!Array.isArray(s.labels)||JSON.stringify(s.labels)!==JSON.stringify(labels))fail('第'+(i+1)+'系列类目不一致');
    if(!Array.isArray(s.values)||s.values.length!==labels.length||s.values.some(v=>!finite(v)))fail('第'+(i+1)+'系列包含缺失/非法数值；不会补零');
  });
  ['valAxisMinVal','valAxisMaxVal','valAxisMajorUnit','fontSize','titleFontSize','legendFontSize','catAxisLabelFontSize','valAxisLabelFontSize','catAxisTitleFontSize','valAxisTitleFontSize','lineSize','markerSize'].forEach(k=>{
    if(o[k]!==undefined&&(!finite(o[k])||(!['valAxisMinVal','valAxisMaxVal'].includes(k)&&o[k]<=0)))fail('非法数值选项：'+k);
  });
  const rawValues=series.flatMap(s=>s&&Array.isArray(s.values)?s.values:[]).filter(finite);
  if(o.valAxisMinVal!==undefined&&rawValues.some(v=>v<o.valAxisMinVal))fail('数据低于指定坐标轴下限');
  if(o.valAxisMaxVal!==undefined&&rawValues.some(v=>v>o.valAxisMaxVal))fail('数据高于指定坐标轴上限');
  if(o.valAxisMinVal!==undefined&&o.valAxisMaxVal!==undefined&&o.valAxisMinVal>=o.valAxisMaxVal)fail('坐标轴上下限无效');
  function warning(message) {
    const n=document.createElement('div');n.className='chart-preview-warning';n.textContent=message;wrapper.appendChild(n);
  }
  function unavailable() {
    const partial=wrapper.querySelector('svg');if(partial)partial.remove();
    wrapper.dataset.chartStatus='unsupported';wrapper.dataset.chartIssues=JSON.stringify(issues);
    warning('图表预览未完成：'+issues.join('；')+'。请检查IR/原生PPTX，不能据此通过视觉验收。');
    const details=document.createElement('details'),summary=document.createElement('summary'),data=document.createElement('pre');
    summary.textContent='查看原始系列（保留未转换的数据）';data.textContent=JSON.stringify(series,null,2);details.append(summary,data);wrapper.append(details);return wrapper;
  }
  if(issues.length)return unavailable();
  const ns='http://www.w3.org/2000/svg';
  function node(tag,attrs,text,parent){const n=document.createElementNS(ns,tag);Object.entries(attrs||{}).forEach(([k,v])=>n.setAttribute(k,String(v)));if(text!==undefined)n.textContent=String(text);(parent||svg).appendChild(n);return n;}
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('width','100%');svg.setAttribute('height','100%');svg.setAttribute('role','img');svg.setAttribute('aria-label',String(o.title||element.id));svg.classList.add('chart-svg');wrapper.appendChild(svg);
  const hex=(c,fallback)=>typeof c==='string'&&/^#?[0-9a-f]{6}$/i.test(c)?'#'+c.replace(/^#/,''):fallback;
  const ink='#222222',grid='#D9D9D9',face=o.fontFace||'Arial, Microsoft YaHei, sans-serif';
  const colors=series.map((s,i)=>hex((o.chartColors||[])[i],ink));
  const fs=o.fontSize||14,cf=o.catAxisLabelFontSize||18,vf=o.valAxisLabelFontSize||18,lf=o.legendFontSize||10,tf=o.titleFontSize||18;
  const ctx=document.createElement('canvas').getContext('2d');
  const measure=(text,size,font)=>{ctx.font=size+'px '+(font||face);return ctx.measureText(String(text)).width;};
  function wrap(value,width,size,font){let rows=[],row='';for(const c of String(value)){if(c==='\n'){rows.push(row);row='';continue;}if(row&&measure(row+c,size,font)>width){rows.push(row);row=c;}else row+=c;}rows.push(row);return rows;}
  function text(value,x,y,size,attrs={},font=face){return node('text',{'x':x,'y':y,'font-size':size,'font-family':font,fill:ink,'text-anchor':'middle',...attrs},value);}
  function lines(rows,x,y,size,attrs={},font=face){rows.forEach((s,i)=>text(s,x,y+i*size*1.2,size,attrs,font));}
  function formatted(value,code){if(!code||code==='General')return String(Number(value.toPrecision(12)));const pct=code.endsWith('%'),digits=(code.split('.')[1]||'').replace('%','').length;return (value*(pct?100:1)).toLocaleString('en-US',{minimumFractionDigits:digits,maximumFractionDigits:digits,useGrouping:code.includes(',')})+(pct?'%':'');}
  let left=10,right=W-10,top=10,bottom=H-10;
  if(o.showTitle){const rows=wrap(o.title||'',W-24,tf,o.titleFontFace);lines(rows,o.titleAlign==='left'?12:o.titleAlign==='right'?W-12:W/2,top+tf,tf,{class:'chart-title',fill:hex(o.titleColor,ink),'text-anchor':o.titleAlign==='left'?'start':o.titleAlign==='right'?'end':'middle'},o.titleFontFace||face);top+=rows.length*tf*1.2+8;}
  let legend=[];
  if(o.showLegend){
    const pos=o.legendPos||'r';if(!['b','t','l','r','tr'].includes(pos)){fail('未支持图例位置');return unavailable();}
    const names=series.map((s,i)=>s.name===undefined?'系列'+(i+1)+'（未命名）':String(s.name));
    if(['l','r','tr'].includes(pos)){
      const width=Math.min(W*.32,Math.max(...names.map(n=>measure(n,lf,o.legendFontFace)))+27);
      let y=top+lf;names.forEach((n,i)=>{const rows=wrap(n,width-23,lf,o.legendFontFace);legend.push({i,rows,x:pos==='l'?left:right-width,y});y+=rows.length*lf*1.2+8;});
      if(y>bottom)issues.push('图例高度超过图框');if(pos==='l')left+=width+8;else right-=width+8;
    }else{
      let row=0,x=left;names.forEach((n,i)=>{const width=Math.min(right-left,measure(n,lf,o.legendFontFace)+27);if(x+width>right&&x>left){row++;x=left;}const rows=wrap(n,right-left-23,lf,o.legendFontFace);legend.push({i,rows,x,y:row*(lf*1.2+7)});row+=Math.max(0,rows.length-1);x+=width;});
      const height=(row+1)*(lf*1.2+7),start=pos==='t'?top:bottom-height;legend.forEach(l=>l.y+=start+lf);if(pos==='t')top+=height+6;else bottom-=height+6;
    }
    legend.forEach(l=>{node('rect',{x:l.x,y:l.y-lf*.75,width:lf,height:lf*.75,fill:colors[l.i],class:'chart-legend-key','data-series-index':l.i});lines(l.rows,l.x+lf+5,l.y,lf,{class:'chart-legend-label','data-series-index':l.i,'text-anchor':'start',fill:hex(o.legendColor,ink)},o.legendFontFace||face);});
  }
  const frameLeft=left;
  const horizontal=type==='bar'&&o.barDir==='bar';
  let low=Math.min(0,...rawValues),high=Math.max(0,...rawValues);if(low===high)high=low+1;
  function nice(v){const exponent=Math.pow(10,Math.floor(Math.log10(v))),f=v/exponent;return (f<=1?1:f<=2?2:f<=5?5:10)*exponent;}
  const step=o.valAxisMajorUnit||nice((high-low)/5);
  low=o.valAxisMinVal===undefined?Math.floor(low/step)*step:o.valAxisMinVal;
  high=o.valAxisMaxVal===undefined?Math.ceil(high/step)*step:o.valAxisMaxVal;
  if(!Number.isFinite(step)||!Number.isFinite(high-low)||high<=low||(high-low)/step>100){fail('无法安全计算坐标轴');return unavailable();}
  const ticks=[];for(let i=0;i<=100;i++){const v=low+i*step;if(v>high+step*1e-8)break;ticks.push(Number(v.toPrecision(12)));}
  const tickText=ticks.map(v=>formatted(v,o.valAxisLabelFormatCode));
  const vTitle=o.showValAxisTitle?String(o.valAxisTitle||'Axis Title'):'',cTitle=o.showCatAxisTitle?String(o.catAxisTitle||'Axis Title'):'';
  const vtf=o.valAxisTitleFontSize||18,ctf=o.catAxisTitleFontSize||18;
  const catRows=labels.map(v=>wrap(v,horizontal?Math.min(W*.24,110):Math.max(20,(right-left)/labels.length-8),cf,o.catAxisLabelFontFace));
  if(horizontal){
    if(!o.catAxisHidden)left+=Math.min(W*.24,110)+8;
    if(cTitle)left+=ctf*1.5;
    if(!o.valAxisHidden)bottom-=vf*1.6;
    if(vTitle)bottom-=vtf*1.5;
    if(o.showValue){left+=fs*.7;right-=Math.max(...rawValues.map(v=>measure(formatted(v,o.dataLabelFormatCode||'#,##0'),fs)))+5;}
  }else{
    if(!o.valAxisHidden)left+=Math.max(...tickText.map(v=>measure(v,vf,o.valAxisLabelFontFace)))+8;
    if(vTitle)left+=vtf*1.5;
    if(!o.catAxisHidden)bottom-=Math.max(...catRows.map(r=>r.length))*cf*1.2+8;
    if(cTitle)bottom-=ctf*1.5;
    if(o.showValue){top+=fs*1.2;if(low<0)bottom-=fs*1.2;}
  }
  if(right-left<40||bottom-top<35){fail('图框不足以容纳当前标题、图例和标签；请放大对象或简化已确认选项');svg.remove();return unavailable();}
  const plot={left,right,top,bottom};wrapper.dataset.chartPlot=JSON.stringify(plot);
  let vpos=v=>{let f=(v-low)/(high-low);if(o.valAxisOrientation==='maxMin')f=1-f;return horizontal?left+f*(right-left):bottom-f*(bottom-top);};
  const catpos=i=>{let f=(i+.5)/labels.length;if(o.catAxisOrientation==='maxMin')f=1-f;return horizontal?bottom-f*(bottom-top):left+f*(right-left);};
  const baseline=vpos(Math.max(low,Math.min(high,0)));
  ticks.forEach((v,i)=>{
    const p=vpos(v),vg=o.valGridLine||{},showGrid=vg.style!=='none';
    if(showGrid)node('line',{x1:horizontal?p:left,y1:horizontal?top:p,x2:horizontal?p:right,y2:horizontal?bottom:p,stroke:hex(vg.color,grid),'stroke-width':vg.size||vg.width||1,class:'chart-grid'});
    if(!o.valAxisHidden)text(tickText[i],horizontal?p:left-7,horizontal?bottom+vf*1.25:p+vf*.32,vf,{class:'chart-value-axis-label','text-anchor':horizontal?'middle':'end',fill:hex(o.valAxisLabelColor,ink)},o.valAxisLabelFontFace||face);
  });
  if(!o.catAxisHidden&&o.catAxisLineShow!==false)node('line',{x1:horizontal?baseline:left,y1:horizontal?top:baseline,x2:horizontal?baseline:right,y2:horizontal?bottom:baseline,stroke:hex(o.catAxisLineColor,ink),'stroke-width':o.catAxisLineSize||1,class:'chart-zero-axis'});
  if(!o.valAxisHidden&&o.valAxisLineShow!==false)node('line',{x1:left,y1:horizontal?bottom:top,x2:horizontal?right:left,y2:bottom,stroke:hex(o.valAxisLineColor,ink),'stroke-width':o.valAxisLineSize||1,class:'chart-value-axis'});
  labels.forEach((label,i)=>{
    const p=catpos(i);if(!o.catAxisHidden)lines(catRows[i],horizontal?left-8:p,horizontal?p-(catRows[i].length-1)*cf*.6+cf*.32:bottom+cf*1.2,cf,{class:'chart-category-label','data-category-index':i,'text-anchor':horizontal?'end':'middle',fill:hex(o.catAxisLabelColor,ink),'font-weight':o.catAxisLabelFontBold?'700':'400'},o.catAxisLabelFontFace||face);
  });
  if(vTitle){if(horizontal)text(vTitle,(left+right)/2,bottom+(o.valAxisHidden?0:vf*1.6)+vtf*1.1,vtf,{class:'chart-value-title',fill:hex(o.valAxisTitleColor,ink)},o.valAxisTitleFontFace||face);else text(vTitle,frameLeft+vtf*.8,(top+bottom)/2,vtf,{class:'chart-value-title',fill:hex(o.valAxisTitleColor,ink),transform:'rotate(-90 '+(frameLeft+vtf*.8)+' '+((top+bottom)/2)+')'},o.valAxisTitleFontFace||face);}
  if(cTitle){if(horizontal)text(cTitle,frameLeft+ctf*.8,(top+bottom)/2,ctf,{class:'chart-category-title',transform:'rotate(-90 '+(frameLeft+ctf*.8)+' '+((top+bottom)/2)+')',fill:hex(o.catAxisTitleColor,ink)},o.catAxisTitleFontFace||face);else text(cTitle,(left+right)/2,bottom+(o.catAxisHidden?0:Math.max(...catRows.map(r=>r.length))*cf*1.2)+ctf*1.4,ctf,{class:'chart-category-title',fill:hex(o.catAxisTitleColor,ink)},o.catAxisTitleFontFace||face);}
  const band=(horizontal?bottom-top:right-left)/labels.length,barWidth=band*.72/series.length;
  const lineLabels=[];
  series.forEach((s,si)=>{
    const points=[];
    s.values.forEach((v,ci)=>{
      const c=catpos(ci),p=vpos(v),offset=(si-(series.length-1)/2)*barWidth;
      let x=horizontal?p:c,y=horizontal?c:p;
      if(type==='bar'){
        x=horizontal?Math.min(baseline,p):c+offset-barWidth*.45;y=horizontal?c+offset-barWidth*.45:Math.min(baseline,p);
        node('rect',{x,y,width:horizontal?Math.abs(p-baseline):barWidth*.9,height:horizontal?barWidth*.9:Math.abs(p-baseline),fill:colors[si],class:'chart-bar','data-series-index':si,'data-category-index':ci,'data-value':v});
      }else{points.push([x,y]);if(o.showMarker!==false)node('circle',{cx:x,cy:y,r:(o.markerSize||5)/2,fill:colors[si],class:'chart-point','data-series-index':si,'data-category-index':ci,'data-value':v});}
      if(o.showValue){
        let tx=horizontal?p+(p>=baseline?5:-5):c+(type==='bar'?offset:0),ty=horizontal?c+offset+fs*.32:p+(p<=baseline?-5:fs+3),anchor=horizontal?(p>=baseline?'start':'end'):'middle';
        if(type==='bar'&&['ctr','inEnd'].includes(o.dataLabelPosition)){tx=horizontal?(baseline+p)/2:tx;ty=horizontal?ty:(baseline+p)/2+fs*.32;anchor='middle';}
        const label=text(formatted(v,o.dataLabelFormatCode||'#,##0'),tx,ty,fs,{class:'chart-data-label','data-series-index':si,'data-category-index':ci,'data-value':v,'text-anchor':anchor,fill:type==='line'&&o.dataLabelColor===undefined?colors[si]:hex(o.dataLabelColor,ink)});
        if(type==='line')lineLabels.push({n:label,x:tx,y:ty,px:x,py:y,si,ci});
      }
    });
    if(type==='line')node('polyline',{points:points.map(p=>p.join(',')).join(' '),fill:'none',stroke:colors[si],'stroke-width':o.lineSize||2,class:'chart-line','data-series-index':si});
  });
  wrapper.dataset.chartIssues=JSON.stringify(issues);
  if(issues.length){wrapper.dataset.chartStatus='review-required';warning('图表需复核：'+issues.join('；'));}
  // Actual glyph bounds are available only after insertion and font loading.
  wrapper.checkChartLayout=function(){
    const bad=[],texts=Array.from(svg.querySelectorAll('text'));
    const bounds=n=>{const b=n.getBBox(),m=n.getCTM(),root=svg.getCTM().inverse();const t=root.multiply(m);const points=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(t));return {l:Math.min(...points.map(p=>p.x)),r:Math.max(...points.map(p=>p.x)),t:Math.min(...points.map(p=>p.y)),b:Math.max(...points.map(p=>p.y))};};
    if(type==='line'&&lineLabels.length){
      // Rebuild cues after layout; old leaders must not become axis obstacles.
      svg.querySelectorAll('.chart-label-leader').forEach(n=>n.remove());
      const gap=2,pointRadius=o.showMarker===false?0:(o.markerSize||5)/2;
      const overlap=(a,b,pad=0)=>a.l<b.r+pad&&a.r>b.l-pad&&a.t<b.b+pad&&a.b>b.t-pad;
      const expanded=(b,pad)=>({l:b.l-pad,r:b.r+pad,t:b.t-pad,b:b.b+pad});
      const pointHits=(b,p,pad=0)=>{
        const dx=p.x-Math.max(b.l,Math.min(p.x,b.r)),dy=p.y-Math.max(b.t,Math.min(p.y,b.b));
        return dx*dx+dy*dy<=(pointRadius+pad)*(pointRadius+pad);
      };
      // Slab intersection includes segment endpoints, stroke width and clearance.
      const segmentHits=(box,s,pad=0)=>{
        const b=expanded(box,s.width/2+pad);let lo=0,hi=1;
        for(const [a,d,min,max] of [[s.x1,s.x2-s.x1,b.l,b.r],[s.y1,s.y2-s.y1,b.t,b.b]]){
          if(Math.abs(d)<1e-10){if(a<min||a>max)return false;}
          else{const u=(min-a)/d,v=(max-a)/d;lo=Math.max(lo,Math.min(u,v));hi=Math.min(hi,Math.max(u,v));if(lo>hi)return false;}
        }
        return true;
      };
      // Include every series, even when markers are hidden. Never infer obstacles
      // from label order: a later series can cross an earlier series' label.
      const points=[],segments=[];
      series.forEach((s,si)=>s.values.forEach((v,ci)=>{
        const p={x:catpos(ci),y:vpos(v),si,ci};points.push(p);
        if(ci)segments.push({x1:catpos(ci-1),y1:vpos(s.values[ci-1]),x2:p.x,y2:p.y,width:o.lineSize||2,kind:'系列线段',si,ci});
      }));
      svg.querySelectorAll('line').forEach(n=>segments.push({x1:+n.getAttribute('x1'),y1:+n.getAttribute('y1'),x2:+n.getAttribute('x2'),y2:+n.getAttribute('y2'),width:+n.getAttribute('stroke-width')||1,kind:'坐标轴/网格线'}));
      const fixed=Array.from(svg.querySelectorAll('text:not(.chart-data-label), .chart-legend-key')).map(bounds);
      const inFrame=b=>b.l>=2&&b.r<=W-2&&b.t>=2&&b.b<=H-2;
      const blocked=b=>!inFrame(b)||fixed.some(a=>overlap(b,a,gap))||points.some(p=>pointHits(b,p,gap))||segments.some(s=>segmentHits(b,s,gap));
      if(['t','ctr'].includes(o.dataLabelPosition))lineLabels.forEach(l=>{
        // Explicit top/center is a placement contract, not an auto-layout hint.
        l.n.setAttribute('x',l.x);l.n.setAttribute('y',l.y);
        const b=bounds(l.n);
        l.n.setAttribute('x',l.x+l.px-(b.l+b.r)/2);
        l.n.setAttribute('y',l.y+(o.dataLabelPosition==='t'?l.py-pointRadius-gap-b.b:l.py-(b.t+b.b)/2));
      });
      if(o.dataLabelPosition===undefined){
        // Recompute from immutable origins after each font/size check. No drift,
        // no IR writes, and explicit positions never enter automatic placement.
        const entries=lineLabels.map((l,index)=>{
          l.n.setAttribute('x',l.x);l.n.setAttribute('y',l.y);
          const b=bounds(l.n),w=b.r-b.l,h=b.b-b.t,cx=(b.l+b.r)/2,cy=(b.t+b.b)/2;
          const candidates=[{b,x:l.x,y:l.y,d:0,order:0}];
          // Bounded local search keeps labels associated with their data points.
          // Insufficient space is a warning, not permission to drop a value.
          for(let ring=0;ring<5;ring++){
            const clearance=pointRadius+gap+1+ring*Math.max(4,h*.6),dx=w/2+clearance,dy=h/2+clearance;
            for(const [ox,oy] of [[0,-dy],[dx,0],[-dx,0],[0,dy],[dx,-dy],[-dx,-dy],[dx,dy],[-dx,dy]]){
              if(Math.abs(ox)>band*.45)continue;
              const mx=l.px+ox-cx,my=l.py+oy-cy;
              const next={l:b.l+mx,r:b.r+mx,t:b.t+my,b:b.b+my};
              candidates.push({b:next,x:l.x+mx,y:l.y+my,d:ox*ox+oy*oy,order:candidates.length});
            }
          }
          return {l,index,b,candidates:candidates.filter(c=>!blocked(c.b)).sort((a,b)=>a.d-b.d||a.order-b.order)};
        });
        const placed=[];
        // Place the most constrained labels first; input order breaks all ties.
        entries.sort((a,b)=>a.candidates.length-b.candidates.length||a.index-b.index).forEach(e=>{
          const chosen=e.candidates.find(c=>!placed.some(b=>overlap(c.b,b,gap)));
          if(chosen){e.l.n.setAttribute('x',chosen.x);e.l.n.setAttribute('y',chosen.y);placed.push(chosen.b);}
          else{placed.push(e.b);bad.push('折线标签无法在局部空间避让：系列'+(e.l.si+1)+' 类目'+(e.l.ci+1)+'（'+e.l.n.textContent+'）；请放大图框或人工复核');}
        });
      }
      // Recheck actual final glyphs, including explicit layouts and unsolved ones.
      // An explicit position is preserved but is never an exemption from QA.
      const final=lineLabels.map(l=>({...l,b:bounds(l.n)}));
      final.forEach(l=>{
        const id='系列'+(l.si+1)+' 类目'+(l.ci+1)+'（'+l.n.textContent+'）';
        if(!inFrame(l.b))bad.push('折线标签边界空间不足：'+id);
        if(fixed.some(b=>overlap(l.b,b)))bad.push('折线标签碰到轴标签/图例/标题：'+id);
        if(points.some(p=>pointHits(l.b,p)))bad.push('折线标签碰到系列点：'+id);
        if(segments.some(s=>segmentHits(l.b,s)))bad.push('折线标签碰到线段：'+id);
      });
      for(let i=0;i<final.length;i++)for(let j=i+1;j<final.length;j++)if(overlap(final[i].b,final[j].b))bad.push('折线数据标签相交：系列'+(final[i].si+1)+' 类目'+(final[i].ci+1)+' / 系列'+(final[j].si+1)+' 类目'+(final[j].ci+1));
      // A clear box is not necessarily an unambiguous series association. Color
      // is the default cue; preserve explicit colors and use a short safe leader
      // when that cue is unavailable. Never relocate an explicit label here.
      const pointDistance=(x,y,s)=>{
        const dx=s.x2-s.x1,dy=s.y2-s.y1,t=Math.max(0,Math.min(1,((x-s.x1)*dx+(y-s.y1)*dy)/(dx*dx+dy*dy||1)));
        return Math.hypot(x-s.x1-t*dx,y-s.y1-t*dy);
      };
      const segmentDistance=(a,b)=>{
        const cross=(s,x,y)=>(s.x2-s.x1)*(y-s.y1)-(s.y2-s.y1)*(x-s.x1);
        if(Math.max(a.x1,a.x2)>=Math.min(b.x1,b.x2)&&Math.min(a.x1,a.x2)<=Math.max(b.x1,b.x2)&&Math.max(a.y1,a.y2)>=Math.min(b.y1,b.y2)&&Math.min(a.y1,a.y2)<=Math.max(b.y1,b.y2)&&cross(a,b.x1,b.y1)*cross(a,b.x2,b.y2)<=0&&cross(b,a.x1,a.y1)*cross(b,a.x2,a.y2)<=0)return 0;
        return Math.min(pointDistance(a.x1,a.y1,b),pointDistance(a.x2,a.y2,b),pointDistance(b.x1,b.y1,a),pointDistance(b.x2,b.y2,a));
      };
      const leaders=[],palette=colors.map(c=>c.toLowerCase());
      final.forEach(l=>{
        const color=l.n.getAttribute('fill').toLowerCase();
        if(color===palette[l.si]&&palette.filter(c=>c===color).length===1)return;
        const cx=(l.b.l+l.b.r)/2,cy=(l.b.t+l.b.b)/2,dx=cx-l.px,dy=cy-l.py,d=Math.hypot(dx,dy);
        const moved=Math.abs(+l.n.getAttribute('x')-l.x)>.01||Math.abs(+l.n.getAttribute('y')-l.y)>.01;
        const ambiguous=points.some(p=>(p.si!==l.si||p.ci!==l.ci)&&Math.hypot(cx-p.x,cy-p.y)<=d+.01)||segments.some(s=>s.si!==undefined&&s.si!==l.si&&pointDistance(cx,cy,s)<=d+.01);
        if(!moved&&!ambiguous)return;
        const ux=dx/(d||1),uy=dy/(d||1),start=pointRadius+1;
        const edge=Math.min(((l.b.r-l.b.l)/2+1)/Math.abs(ux),((l.b.b-l.b.t)/2+1)/Math.abs(uy));
        const length=d-edge-start;
        const leader={x1:l.px+ux*start,y1:l.py+uy*start,x2:cx-ux*edge,y2:cy-uy*edge,width:1};
        const safe=length>=1&&length<=48&&inFrame({l:Math.min(leader.x1,leader.x2),r:Math.max(leader.x1,leader.x2),t:Math.min(leader.y1,leader.y2),b:Math.max(leader.y1,leader.y2)})
          &&!fixed.concat(final.map(a=>a.b)).some(b=>segmentHits(b,leader,.25))
          &&!points.some(p=>(p.si!==l.si||p.ci!==l.ci)&&pointDistance(p.x,p.y,leader)<=pointRadius+1)
          &&!segments.concat(leaders).some(s=>segmentDistance(leader,s)<=(leader.width+s.width)/2+.5);
        if(safe){
          leaders.push(leader);
          node('line',{x1:leader.x1,y1:leader.y1,x2:leader.x2,y2:leader.y2,stroke:colors[l.si],'stroke-width':leader.width,class:'chart-label-leader','data-series-index':l.si,'data-category-index':l.ci});
        }else bad.push('折线标签归属需复核：系列'+(l.si+1)+' 类目'+(l.ci+1)+'（'+l.n.textContent+'）缺少唯一系列色且无法安全连接；请调整标签色或图框');
      });
    }
    const boxes=texts.map(n=>({n,b:bounds(n)}));
    boxes.forEach(({n,b})=>{if(b.l<-.5||b.t<-.5||b.r>W+.5||b.b>H+.5)bad.push('标签越界：'+n.textContent);});
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];if(Math.min(a.b.r,b.b.r)-Math.max(a.b.l,b.b.l)>1&&Math.min(a.b.b,b.b.b)-Math.max(a.b.t,b.b.t)>1)bad.push('标签相交：'+a.n.textContent+' / '+b.n.textContent);}
    const all=Array.from(new Set(issues.concat(bad)));wrapper.dataset.chartIssues=JSON.stringify(all);
    const notice=wrapper.querySelector('.chart-preview-warning');
    if(all.length){wrapper.dataset.chartStatus='review-required';const message='图表标签需复核：'+all.join('；');if(notice)notice.textContent=message;else warning(message);}
    else{wrapper.dataset.chartStatus='rendered';if(notice)notice.remove();}
    return all;
  };
  return wrapper;
}

module.exports={renderChartPreview};
