#!/usr/bin/env node
'use strict';
// Static diagnostics for trusted local samples, NOT a hostile-code browser sandbox.
// Exit: 0 no reliable failure (inspect warnings); 1 measured defects; 2 runtime failure.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { pathToFileURL, fileURLToPath } = require('node:url');
const { assertSafeOutputs, writeNewFile } = require('./safe_output.cjs');
const ORIGIN = 'http://html-review.invalid'; // fulfilled from disk; never contacted
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const inside = (root, p) => { const r = path.relative(root, p); return r === '' || (!r.startsWith('..' + path.sep) && r !== '..' && !path.isAbsolute(r)); };
const real = p => fs.realpathSync.native(p);
function canonical(p) {
  const tail = [];
  p = path.resolve(p);
  while (!fs.existsSync(p)) { tail.unshift(path.basename(p)); p = path.dirname(p); }
  return path.join(real(p), ...tail);
}
function preflight(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    if (!['--manifest', '--out', '--playwright', '--chrome'].includes(key) || !argv[i + 1] || args[key]) throw Error('Expected --manifest JSON --out NEW_DIRECTORY --playwright EXISTING_PATH --chrome EXE');
    args[key] = argv[i + 1];
  }
  for (const key of ['--manifest', '--out', '--playwright', '--chrome']) if (!args[key]) throw Error('Missing ' + key);
  const manifest = real(path.resolve(args['--manifest']));
  const root = path.dirname(manifest);
  const out = path.resolve(args['--out']);
  assertSafeOutputs(manifest, [out]);
  const target = canonical(out), skill = real(path.resolve(__dirname, '..'));
  if (inside(target, root) || inside(target, skill) || inside(skill, target)) throw Error('Output must not contain the input root or overlap the Skill');
  const bytes = fs.readFileSync(manifest);
  const data = JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, ''));
  if (!Array.isArray(data.pages) || !data.pages.length) throw Error('pages must be a nonempty array');
  const width = data.width ?? 1600, height = data.height ?? 900;
  if (![width, height].every(v => Number.isInteger(v) && v > 0 && v <= 16384)) throw Error('Invalid viewport dimensions (1..16384)');
  const seen = new Set();
  const pages = data.pages.map(p => {
    if (!p || typeof p.id !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(p.id) || /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i.test(p.id) || seen.has(p.id.toLowerCase())) throw Error('Unsafe or duplicate page id: ' + p?.id);
    seen.add(p.id.toLowerCase());
    if (typeof p.file !== 'string' || !p.file || /^[a-z][a-z0-9+.-]*:/i.test(p.file) && !/^[a-z]:[\\/]/i.test(p.file) || /^[\\/]{2}/.test(p.file)) throw Error('file must be a local HTML path: ' + p.id);
    const resolved = path.resolve(root, p.file);
    if (!inside(root, resolved)) throw Error('HTML path escapes input root: ' + p.id);
    const file = real(resolved);
    if (!inside(root, file) || !/\.html?$/i.test(file) || !fs.statSync(file).isFile()) throw Error('Expected existing HTML inside input root: ' + p.id);
    for (const key of ['selector', 'slide_id']) if (p[key] !== undefined && (typeof p[key] !== 'string' || !p[key].trim())) throw Error('Invalid ' + key + ': ' + p.id);
    if (p.required_text !== undefined && (!Array.isArray(p.required_text) || !p.required_text.every(t => typeof t === 'string' && t.trim()))) throw Error('Invalid required_text: ' + p.id);
    return { id: p.id, file, selector: p.selector, slide_id: p.slide_id, required_text: p.required_text || [], sha256: sha(fs.readFileSync(file)) };
  });
  const playwright = real(path.resolve(args['--playwright'])), chrome = real(path.resolve(args['--chrome']));
  if (!fs.statSync(chrome).isFile()) throw Error('Chrome must be an executable file');
  const api = require(playwright);
  if (!api.chromium) throw Error('Explicit dependency is not playwright-core');
  return { manifest, manifest_sha256: sha(bytes), root, out, output_root: target, width, height, pages, playwright, chrome, api };
}
const mime = p => ({ '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.gif': 'image/gif', '.ico': 'image/x-icon' }[path.extname(p).toLowerCase()] || 'application/octet-stream');
const localURL = (root, file) => ORIGIN + '/' + path.relative(root, file).split(path.sep).map(encodeURIComponent).join('/');
const json = (file, value) => writeNewFile(file, JSON.stringify(value, null, 2) + '\n');
const html = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function settle(page, selector) {
  return page.evaluate(async selector => {
    const delay = ms => new Promise(r => setTimeout(r, ms));
    if (document.fonts) await Promise.race([document.fonts.ready, delay(5000).then(() => { throw Error('Font loading timeout'); })]);
    const el = document.querySelector(selector);
    if (!el) throw Error('Slide container disappeared');
    let last = '', same = 0;
    for (let i = 0; i < 40; i++) {
      const fingerprint = JSON.stringify([el.textContent, ...[el, ...el.querySelectorAll('*')].map(n => {
        const r = n.getBoundingClientRect(); return [r.x, r.y, r.width, r.height, n.scrollWidth, n.scrollHeight];
      })]);
      same = fingerprint === last ? same + 1 : 0; last = fingerprint;
      if (same >= 4) return { stable: true, samples: i + 1, fonts: document.fonts?.status || 'unavailable' };
      await delay(150);
    }
    throw Error('Layout did not stabilize within 6 seconds');
  }, selector);
}

async function measure(page, selector, required) {
  return page.evaluate(({ selector, required }) => {
    const el = document.querySelector(selector);
    const rect = n => { const r = n.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }; };
    const visible = n => { const s = getComputedStyle(n), r = n.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) !== 0 && r.width > 0 && r.height > 0; };
    const outside = (a, b) => a.x < b.x - 1 || a.y < b.y - 1 || a.right > b.right + 1 || a.bottom > b.bottom + 1;
    const name = n => n.id || n.getAttribute('data-object-id') || n.tagName.toLowerCase();
    // SVG graphics are not CSS scroll boxes: Chrome exposes non-comparable
    // scroll/client values for text/tspan, especially under viewBox scaling.
    const scrollOverflow = n => ({
      x: n instanceof HTMLElement && n.clientWidth > 0 && n.scrollWidth > n.clientWidth + 1,
      y: n instanceof HTMLElement && n.clientHeight > 0 && n.scrollHeight > n.clientHeight + 1
    });
    const bounds = rect(el), text = (el instanceof HTMLElement ? el.innerText : el.textContent || '').trim();
    const normalize = s => s.replace(/\s+/g, ' ').trim();
    const elements = [el, ...el.querySelectorAll('*')].filter(visible).map(n => {
      const r = rect(n), s = getComputedStyle(n), scroll = scrollOverflow(n);
      return { node: name(n), namespace: n instanceof SVGElement ? 'svg' : 'html', bounds: r, outside_slide: outside(r, bounds), overflow_x: scroll.x, overflow_y: scroll.y, scroll_metrics_applicable: n instanceof HTMLElement, scroll_size: [n.scrollWidth, n.scrollHeight], client_size: [n.clientWidth, n.clientHeight], overflow_mode: [s.overflowX, s.overflowY] };
    });
    const text_runs = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.textContent.trim() || !visible(node.parentElement) || ['SCRIPT', 'STYLE'].includes(node.parentElement.tagName)) continue;
      const range = document.createRange(); range.selectNodeContents(node);
      for (const r of range.getClientRects()) {
        const b = { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
        let clipped = false, ambiguous_clip = false;
        const clip_checks = [];
        for (let p = node.parentElement; p && el.contains(p); p = p.parentElement) {
          const s = getComputedStyle(p), pr = rect(p);
          const x = /hidden|clip|scroll|auto/.test(s.overflowX) && (b.x < pr.x - 1 || b.right > pr.right + 1);
          const y = /hidden|clip|scroll|auto/.test(s.overflowY) && (b.y < pr.y - 1 || b.bottom > pr.bottom + 1);
          if (!x && !y) continue;
          const scroll = scrollOverflow(p);
          const scaleY = p instanceof HTMLElement && p.offsetHeight > 0 ? pr.height / p.offsetHeight : 1;
          const lineHeight = parseFloat(s.lineHeight) * scaleY;
          // A Range is a font/line rectangle, not a painted-glyph mask. Only the
          // immediate HTML text box gets this narrow ambiguity classification:
          // vertical excursion within half its Range/line-height difference + 1px,
          // no horizontal excursion, and no scroll-box evidence of actual overset.
          // Ancestor clipping, SVG viewports and materially larger excursions fail.
          const allowance = Number.isFinite(lineHeight) ? Math.max(0, (b.height - lineHeight) / 2) + 1 : 0;
          const excursion = Math.max(pr.y - b.y, b.bottom - pr.bottom, 0);
          const ambiguous = p === node.parentElement && p instanceof HTMLElement && !x && y && !scroll.x && !scroll.y && s.writingMode === 'horizontal-tb' && Number.isFinite(lineHeight) && lineHeight > 0 && p.clientHeight * scaleY >= lineHeight - 1 && excursion <= allowance;
          if (ambiguous) ambiguous_clip = true; else clipped = true;
          clip_checks.push({ ancestor: name(p), ancestor_bounds: pr, x, y, scroll_overflow: scroll, vertical_excursion_px: excursion, line_height_px: Number.isFinite(lineHeight) ? lineHeight : null, font_metric_allowance_px: allowance, classification: ambiguous ? 'ambiguous-font-line-metrics' : 'reliable-clipping' });
        }
        text_runs.push({ text: node.textContent.trim(), bounds: b, outside_slide: outside(b, bounds), clipped, ambiguous_clip, clip_checks });
      }
    }
    // Keep genuine zero-length data marks, but never mix hidden stale nodes into
    // a rendered-data readback. Visibility is inherited/overridable; opacity and
    // display on any ancestor suppress the whole subtree.
    const chartVisible = n => {
      if (['hidden','collapse'].includes(getComputedStyle(n).visibility)) return false;
      for(let p=n;p;p=p.parentElement){const s=getComputedStyle(p);if(s.display==='none'||Number(s.opacity)===0)return false;}
      return true;
    };
    const chartNodes = (n, selector) => [...n.querySelectorAll(selector)].filter(chartVisible);
    const charts = [...(el.matches('[data-chart-status],[data-chart-issues]') ? [el] : []), ...el.querySelectorAll('[data-chart-status],[data-chart-issues]')].filter(chartVisible).map(n => ({ node: name(n), status: n.getAttribute('data-chart-status'), issues: n.getAttribute('data-chart-issues') || '',
      rendered_data: {
        categories: chartNodes(n,'.chart-category-label').map(t => ({ index: t.getAttribute('data-category-index'), text: t.textContent })),
        legend: chartNodes(n,'.chart-legend-label').map(t => ({ index: t.getAttribute('data-series-index'), text: t.textContent })),
        axis_titles: chartNodes(n,'.chart-value-title,.chart-category-title').map(t => t.textContent),
        labels: chartNodes(n,'.chart-data-label').map(t => ({ series: t.getAttribute('data-series-index'), category: t.getAttribute('data-category-index'), value: t.getAttribute('data-value'), text: t.textContent })),
        marks: chartNodes(n,'.chart-bar,.chart-point').map(t => ({ series: t.getAttribute('data-series-index'), category: t.getAttribute('data-category-index'), value: t.getAttribute('data-value'), bounds: rect(t) }))
      }
    }));
    const broken_images = [...el.querySelectorAll('img')].filter(n => visible(n) && (!n.complete || n.naturalWidth === 0)).map(n => n.getAttribute('src'));
    return { selector, bounds, text, elements, text_runs, charts, broken_images, required_text: required.map(t => ({ text: t, present: normalize(text).includes(normalize(t)) })), empty: !visible(el) || (!text && !el.querySelector('img,svg,canvas,video')), viewport_overflow: outside(bounds, { x: 0, y: 0, right: innerWidth, bottom: innerHeight }) };
  }, { selector, required });
}

async function review(c, context, spec, result) {
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.on('pageerror', e => result.js_errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') result.console_errors.push(m.text()); });
  page.on('crash', () => result.js_errors.push('Page crashed'));
  page.on('requestfailed', r => result.failed_requests.push({ url: r.url(), error: r.failure()?.errorText }));
  try {
    await page.goto(localURL(c.root, spec.file), { waitUntil: 'load', timeout: 15000 });
    if (spec.slide_id !== undefined) {
      result.selection = await page.evaluate(slideId => {
        const api = window.PatrickPptDirectorEditor;
        const originalMode = api?.getMode?.() || null;
        const before = api?.getIR ? JSON.stringify(api.getIR()) : null;
        let method;
        if (typeof api?.selectSlide === 'function') {
          // The public API deliberately requires presentation mode; never mutate IR.
          if (api.getMode?.() !== 'presentation' && api.setMode) api.setMode('presentation');
          const selected = api.selectSlide(slideId);
          if (selected !== undefined && selected !== slideId) throw Error('selectSlide returned a different slide');
          method = 'public-selectSlide';
        } else {
          // Legacy presentation sidebars are hidden AND their click handlers inert.
          // Temporarily restore editor mode, use the existing DOM handler, then return.
          if (originalMode === 'presentation') {
            if (!api?.setMode) throw Error('Legacy presentation needs setMode for slide selection');
            api.setMode('editor');
          }
          try {
            const buttons = [...document.querySelectorAll('button')].filter(b => b.getAttribute('data-slide-id') === slideId || b.matches('.slide-button') && b.querySelector('.slide-id')?.textContent.trim() === slideId);
            if (buttons.length !== 1) throw Error('Expected exactly one slide button for ' + slideId);
            buttons[0].click(); method = 'legacy-button-dom-click';
          } finally { if (originalMode === 'presentation') api.setMode('presentation'); }
        }
        const unchanged = before === null ? null : before === JSON.stringify(api.getIR());
        if (unchanged === false) throw Error('Slide selection unexpectedly changed IR');
        return { requested_slide_id: slideId, method, original_mode: originalMode, final_mode: api?.getMode?.() || null, ir_unchanged: unchanged };
      }, spec.slide_id);
    }
    let selector = spec.selector;
    if (!selector) {
      for (const candidate of ['#slide-surface', '.stage', '.slide']) {
        if (await page.locator(candidate).count()) { selector = candidate; break; }
      }
    }
    if (!selector || await page.locator(selector).count() !== 1 || !await page.locator(selector).isVisible()) throw Error('Missing, ambiguous or invisible slide container; specify selector');
    result.stability = await settle(page, selector);
    result.measurements = await measure(page, selector, spec.required_text);
    result.measured = 'completed';
    await page.screenshot({ path: path.join(c.out, spec.id + '.png'), fullPage: false, timeout: 10000 });
    result.screenshot = spec.id + '.png'; result.rendered = 'completed';
    if (sha(fs.readFileSync(spec.file)) !== spec.sha256) throw Error('Input changed during review');
    const m = result.measurements;
    if (m.empty) result.issues.push('empty-slide');
    if (m.viewport_overflow) result.issues.push('slide-outside-viewport');
    if (m.elements.some(e => e.outside_slide || e.overflow_x || e.overflow_y) || m.text_runs.some(t => t.outside_slide || t.clipped)) result.issues.push('geometry-overflow');
    if (m.text_runs.some(t => t.ambiguous_clip)) result.warnings.push('ambiguous-text-metrics');
    if (m.required_text.some(t => !t.present)) result.issues.push('required-text-missing');
    if (m.charts.some(t => t.status !== 'rendered' || t.issues && !['[]', '{}', 'null'].includes(t.issues.trim()))) result.issues.push('chart-diagnostic');
    if (m.broken_images.length) result.issues.push('broken-images');
  } catch (e) { result.error = e.message; result.issues.push('render-or-measure-error'); }
  finally { await page.close().catch(e => { result.error ||= e.message; }); }
  if (result.js_errors.length || result.console_errors.length) result.issues.push('browser-error');
  if (result.denied_requests.length) result.issues.push('resource-denied');
  if (result.failed_requests.length) result.issues.push('request-failed');
  result.verdict = result.error ? 'error' : result.issues.length ? 'fail' : result.warnings.length ? 'warning' : 'pass';
  json(path.join(c.out, spec.id + '.measurements.json'), result.measurements || { status: 'not-run', error: result.error });
  json(path.join(c.out, spec.id + '.QA.json'), result);
}

function comparison(report) {
  return '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>HTML QA comparison</title><style>body{font-family:system-ui;margin:24px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:24px}img{width:100%;border:1px solid #bbb}pre{white-space:pre-wrap}</style><h1>HTML 样张对照</h1><p>PNG 已生成不等于已查看；viewed / accepted 均为 not-run。点击图片打开大图。</p><main>' + report.pages.map(p => '<section><h2>' + html(p.id) + ' — ' + html(p.verdict) + '</h2><a href="' + html(pathToFileURL(p.file).href) + '">原 HTML</a><p>' + html(p.issues.join(', ') || 'No reliable static failure detected') + '</p><p>' + html(p.warnings.length ? '待看图警告：' + p.warnings.join(', ') : '') + '</p>' + (p.screenshot ? '<a href="' + html(p.screenshot) + '" target="_blank" rel="noopener"><img alt="' + html(p.id) + '" src="' + html(p.screenshot) + '"></a>' : '<p>截图未生成</p>') + '</section>').join('') + '</main><h2>诊断限制</h2><pre>' + html(report.limitations.join('\n')) + '</pre></html>';
}

function handoff(report, requestedPages) {
  const cell = value => String(value).replace(/\r?\n/g, ' ').replaceAll('|', '\\|');
  const lines = ['# 样张交付记录', '',
    '- 状态：Provisional；用户选择 pending。',
    '- 实际看图：not-run（看过最终图片后，仅据实际检查补写）。',
    '- 来源与数值核对：not-run（对照本轮资料后补写范围）。',
    '- 方向差异与推荐：pending。',
    '- 剩余问题与下一步：pending。', '',
    '[样张比较](comparison.html) · [机器检查摘要](QA.summary.json) · [完整检查](QA.json)', '',
    '以下为自动记录，不是视觉通过或用户认可。只需补写上面四项，不必另建交付报告或改写机器检查结果。', '',
    '| 样张 | HTML | 图片 | 渲染 | 测量 | 机器诊断 |',
    '|---|---|---|---|---|---|' ];
  for (const spec of requestedPages) {
    const p = report.pages.find(p => p.id === spec.id);
    lines.push('| ' + spec.id + ' | [打开](<' + pathToFileURL(spec.file).href + '>) | ' +
      (p?.screenshot ? '[查看](' + p.screenshot + ')' : '未生成') + ' | ' +
      cell(p?.rendered || 'not-run') + ' | ' + cell(p?.measured || 'not-run') + ' | ' +
      cell([p?.verdict || 'not-run', ...(p?.issues || []), ...(p?.warnings || [])].join('; ')) + ' |');
  }
  lines.push('', '原始诊断的 viewed / accepted 固定保留 not-run。修正后使用最终一组图片；本记录的人工补写是复核者陈述，须有真实看图/核对证据，不是工具认证。', '静态 HTML 检查不证明 PowerPoint 编辑性、业务真实性或长期风格认可。', '');
  return lines.join('\n');
}

// Summaries are derived only from recorded results; never run/relax a check here.
// Bounds are per page so every requested page still has an entry, even on launch failure.
function summarize(report, requestedPages = report.pages) {
  const limits = { problem_locators_per_page: 6, missing_strings_per_page: 8, codes_per_page: 12, text_characters: 160, chart_readbacks_per_page: 4, chart_items_per_list: 48 };
  let topTruncated = false;
  const shortenTop = value => { const s = String(value); if (s.length > limits.text_characters) topTruncated = true; return s.length > limits.text_characters ? s.slice(0, limits.text_characters - 1) + '…' : s; };
  const pages = requestedPages.map(spec => {
    const index = report.pages.findIndex(p => p.id === spec.id);
    const p = index < 0 ? { ...spec, verdict: 'not-run' } : report.pages[index];
    const m = p.measurements, prefix = '/pages/' + index;
    let truncated = false, problemCount = 0;
    const problems = [];
    const short = value => { const s = String(value); if (s.length > limits.text_characters) truncated = true; return s.length > limits.text_characters ? s.slice(0, limits.text_characters - 1) + '…' : s; };
    const list = (values, max) => { if (values.length > max) truncated = true; return values.slice(0, max).map(short); };
    const add = (kind, pointer, detail) => {
      problemCount++;
      if (problems.length < limits.problem_locators_per_page) problems.push({ kind, pointer: prefix + pointer, detail: short(detail) });
      else truncated = true;
    };
    const errors = { runtime: p.error ? 1 : 0 };
    if (p.error) add('runtime-error', '/error', p.error);
    for (const key of ['js_errors', 'console_errors', 'failed_requests', 'denied_requests']) {
      errors[key] = (p[key] || []).length;
      (p[key] || []).forEach((v, i) => add(key, '/' + key + '/' + i, typeof v === 'string' ? v : [v.url, v.error || v.reason].filter(Boolean).join(' — ')));
    }
    let required, overflow = null, charts = null;
    if (m) {
      const missing = m.required_text.filter(t => !t.present);
      required = { total: m.required_text.length, checked: m.required_text.length, present: m.required_text.length - missing.length, missing_count: missing.length, missing: list(missing.map(t => t.text), limits.missing_strings_per_page) };
      m.required_text.forEach((t, i) => { if (!t.present) add('required-text-missing', '/measurements/required_text/' + i, t.text); });
      overflow = { elements: 0, text_runs: 0, ambiguous_text_runs: 0, viewport: Number(m.viewport_overflow) };
      m.elements.forEach((e, i) => { if (e.outside_slide || e.overflow_x || e.overflow_y) { overflow.elements++; add('element-overflow', '/measurements/elements/' + i, e.node); } });
      m.text_runs.forEach((t, i) => {
        if (t.outside_slide || t.clipped) { overflow.text_runs++; add('text-clipping', '/measurements/text_runs/' + i, t.text); }
        if (t.ambiguous_clip) { overflow.ambiguous_text_runs++; add('ambiguous-text-metrics', '/measurements/text_runs/' + i, t.text); }
      });
      charts = { total: m.charts.length, diagnostic_count: 0 };
      if (m.charts.length > limits.chart_readbacks_per_page) truncated = true;
      charts.readback = m.charts.slice(0, limits.chart_readbacks_per_page).map((c, i) => {
        const data = c.rendered_data;
        if (!data) return { node: short(c.node), status: c.status == null ? c.status : short(c.status), available: false, pointer: prefix + '/measurements/charts/' + i };
        const select = key => { const a = data[key]; if (a.length > limits.chart_items_per_list) truncated = true; return a.slice(0, limits.chart_items_per_list).map(v => typeof v === 'string' ? short(v) : Object.fromEntries(Object.entries(v).map(([k, val]) => [k, typeof val === 'string' ? short(val) : val]))); };
        return { node: short(c.node), status: c.status == null ? c.status : short(c.status), available: true, pointer: prefix + '/measurements/charts/' + i, totals: Object.fromEntries(Object.entries(data).map(([k,v])=>[k,v.length])), categories: select('categories'), legend: select('legend'), axis_titles: select('axis_titles'), labels: select('labels'), marks: select('marks') };
      });
      m.charts.forEach((t, i) => { if (t.status !== 'rendered' || t.issues && !['[]', '{}', 'null'].includes(t.issues.trim())) { charts.diagnostic_count++; add('chart-diagnostic', '/measurements/charts/' + i, [t.node, t.status, t.issues].join(' — ')); } });
      if (m.empty) add('empty-slide', '/measurements/empty', m.selector);
      if (m.viewport_overflow) add('slide-outside-viewport', '/measurements/bounds', m.selector);
      m.broken_images.forEach((v, i) => add('broken-image', '/measurements/broken_images/' + i, v));
    } else required = { total: (spec.required_text || []).length, checked: 0, present: null, missing_count: null, missing: [] };
    const result = {
      id: p.id, screenshot: p.screenshot || null, verdict: p.verdict,
      rendered: p.rendered || 'not-run', measured: p.measured || 'not-run', viewed: 'not-run', accepted: 'not-run',
      issue_count: (p.issues || []).length, issues: list(p.issues || [], limits.codes_per_page), warning_count: (p.warnings || []).length, warnings: list(p.warnings || [], limits.codes_per_page),
      required_text: required, overflow, charts, broken_image_count: m ? m.broken_images.length : null, error_counts: errors,
      problem_count: problemCount, problems, details_truncated: truncated, full_report_pointer: index < 0 ? null : prefix
    };
    return result;
  });
  const summary = { schema_version: 1, status: report.status, rendered: report.rendered, measured: report.measured, viewed: 'not-run', accepted: 'not-run',
    full_report: 'QA.json', summary_report: 'QA.summary.json', handoff_record: 'HANDOFF.md', page_count: pages.length, reported_page_count: report.pages.length,
    error_counts: { runtime: report.error ? 1 : 0, browser_close: report.close_error ? 1 : 0 },
    errors: [report.error, report.close_error].filter(Boolean).map(shortenTop), limits, pages };
  summary.details_truncated = topTruncated || pages.some(p => p.details_truncated);
  return summary;
}

async function main() {
  if (process.argv.length === 3 && ['--help', '-h'].includes(process.argv[2])) {
    console.log([
      'Usage: node scripts/review_html.cjs --manifest <JSON> --out <NEW_DIRECTORY> --playwright <EXISTING_PLAYWRIGHT_CORE_PATH> --chrome <EXE>',
      '       node scripts/review_html.cjs --help | -h',
      '',
      'Manifest: {pages:[{id,file,selector?,slide_id?,required_text?:string[]}],width?:1600,height?:900}',
      'IDs: unique (case-insensitive), 1..80 ASCII letters/digits/_/-, first character alphanumeric, no reserved device names.',
      'Each file must be an existing .html/.htm inside the manifest directory (including subdirectories); URLs and escaping paths are rejected.',
      'Every page is preflighted before output creation. Output must be NEW; a child of the input directory is allowed, but output cannot contain input root or overlap this Skill.',
      'selector defaults to one unambiguous #slide-surface, .stage or .slide. Missing/invisible/empty containers cannot pass.',
      'slide_id uses PatrickPptDirectorEditor.selectSlide in presentation mode. Legacy fallback matches button[data-slide-id] or button.slide-button .slide-id using DOM click and mode switching.',
      'required_text checks normalized DOM text within the selected slide, not source HTML or sidebar text.',
      'Dependencies are explicit; no installation or business-path discovery. Headless Chrome uses a unique profile inside out, never a user profile.',
      'Resources are locally fulfilled from input root; output/profile reads, external HTTP(S)/WebSockets and service workers are blocked. Relative local assets/data/blob supported.',
      'Outputs: manifest.json, QA.summary.json, full QA.json, comparison.html, HANDOFF.md, per-page PNG, *.measurements.json and *.QA.json. Partial runtime failures retain reports/profile.',
      'HANDOFF.md is a pending delivery record with actual artifact links and machine states, never auto-approval. After actual image/source review, fill its four pending items and deliver existing links; leave machine viewed/accepted unchanged.',
      'Read QA.summary.json first (also emitted as concise JSON on stdout): counts and at most 6 problem locators/8 missing strings per page, strings capped at 160 characters. details_truncated and full_report pointers disclose omissions; healthy DOM rectangles remain only in the full reports.',
      'Rendering and measurements are static diagnostics, NOT visual inspection or acceptance. viewed and accepted always remain not-run; PNG generation never marks them passed.',
      'warning / ambiguous-text-metrics means small own-box vertical Range overhang without scroll overset: inspect glyphs visually. SVG scroll/client metrics are not CSS overflow evidence; bounds/viewport clipping still fail.',
      'Not a hostile-code security sandbox; use trusted local HTML. Font/layout sampling, chart annotations and geometry do not establish visual or business correctness.',
      'Exit codes: 0 no reliable failure (pass OR warning)/help; 1 measured findings; 2 preflight/runtime failure. Always inspect status/warnings; exit 0 is not visual approval. Preflight creates no directory and reports to stderr.'
    ].join('\n'));
    return;
  }
  let c;
  try { c = preflight(process.argv.slice(2)); }
  catch (e) { console.error(JSON.stringify({ status: 'preflight-failed', error: e.message, output_created: false })); process.exitCode = 2; return; }
  // No output at all until every page and dependency has passed preflight.
  const report = { schema_version: 1, started_at: new Date().toISOString(), status: 'running', rendered: 'not-run', measured: 'not-run', viewed: 'not-run', accepted: 'not-run', manifest_sha256: c.manifest_sha256, input_root: c.root, viewport: { width: c.width, height: c.height }, browser_closed: false, pages: [], limitations: [
    'Static diagnostics only: geometry can flag intentional overlaps/overflow; no visual aesthetics, content correctness, chart numeric truth, or PowerPoint fidelity acceptance.',
    'SVG scroll/client dimensions are recorded but excluded as overflow evidence; SVG bounds and text clipping against ancestor viewports remain checked. Complex clipPath/masks and rotated glyph outlines are not evaluated.',
    'A small vertical Range excursion at its own HTML text box, within half the Range/line-height difference plus 1px and without scroll overset, is ambiguous-text-metrics (warning), not proven clipping or a visual pass. All raw rectangles and clip decisions remain in measurements. Inspect glyphs; no pixel-level ink test is performed.',
    'Only the selected viewport/container/state is measured. Stable layout is sampled over a finite interval; later timers, canvas painting, animations, occlusion, pseudo-elements and cross-frame text may escape diagnosis.',
    'Local resources are served through an intercepted synthetic origin, not a server. Absolute file URLs can be browser-blocked; use relative asset paths. HTTP semantics may differ from opening file:// directly.',
    'Service workers and workers are blocked; HTTP(S) and WebSocket requests outside the synthetic local origin are rejected. This is not a general hostile-code security sandbox. Use trusted local HTML only.',
    'Screenshots have NOT been visually inspected; viewed and accepted remain not-run. Source HTML links open originals with the viewer browser policy, not this diagnostic request filter.',
    'Preflight errors are reported to stderr without creating output. Runtime failures retain partial artifacts and QA.json. The isolated temporary profile is retained for diagnosis.'
  ] };
  let context, ownsOut = false, active;
  const stop = () => { throw Error('Interrupted'); };
  // Close only our persistent context, never attach to or kill a user browser.
  const interrupt = () => { report.interrupted = true; context?.close().catch(() => {}); };
  process.once('SIGINT', interrupt); process.once('SIGTERM', interrupt);
  try {
    fs.mkdirSync(c.out); ownsOut = true;
    json(path.join(c.out, 'manifest.json'), { source_manifest: c.manifest, sha256: c.manifest_sha256, width: c.width, height: c.height, pages: c.pages, dependencies: { playwright: c.playwright, chrome: c.chrome } });
    const profile = fs.mkdtempSync(path.join(c.out, '.browser-profile-'));
    report.profile = path.basename(profile);
    context = await c.api.chromium.launchPersistentContext(profile, { executablePath: c.chrome, timeout: 15000, headless: true, viewport: report.viewport, deviceScaleFactor: 1, serviceWorkers: 'block', acceptDownloads: false, args: ['--disable-background-networking', '--disable-component-update', '--disable-sync', '--no-first-run'] });
    if (typeof context.routeWebSocket !== 'function') throw Error('Explicit playwright-core must support context.routeWebSocket (>=1.48)');
    const deny = (url, reason) => active?.denied_requests.push({ url, reason });
    await context.routeWebSocket(/.*/, socket => { deny(socket.url(), 'websocket-blocked'); socket.close(); });
    await context.route('**/*', async route => {
      const request = route.request(), url = request.url();
      try {
        const parsed = new URL(url);
        if (['data:', 'blob:'].includes(parsed.protocol)) return await route.continue();
        let filename;
        if (parsed.origin === ORIGIN) filename = path.resolve(c.root, '.' + decodeURIComponent(parsed.pathname));
        else if (parsed.protocol === 'file:') filename = fileURLToPath(parsed);
        else throw Error('external-or-unsupported-scheme');
        if (!inside(c.root, filename)) throw Error('path-outside-input-root');
        filename = real(filename);
        if (inside(c.output_root, filename)) throw Error('output-resource-blocked');
        if (!inside(c.root, filename) || !fs.statSync(filename).isFile()) throw Error('resource-outside-input-root');
        if (!['GET', 'HEAD'].includes(request.method())) throw Error('non-read-request');
        const body = fs.readFileSync(filename);
        if (active && !active.resources.some(r => r.file === filename)) active.resources.push({ file: filename, sha256: sha(body) });
        await route.fulfill({ status: 200, contentType: mime(filename), body: request.method() === 'HEAD' ? '' : body, headers: { 'Content-Security-Policy': "worker-src 'none'; object-src 'none'", 'Cache-Control': 'no-store' } });
      } catch (e) { deny(url, e.message); await route.abort('blockedbyclient').catch(() => {}); }
    });
    for (const spec of c.pages) {
      if (report.interrupted) stop();
      active = { ...spec, rendered: 'not-run', measured: 'not-run', viewed: 'not-run', accepted: 'not-run', verdict: 'not-run', issues: [], warnings: [], js_errors: [], console_errors: [], failed_requests: [], denied_requests: [], resources: [] };
      report.pages.push(active);
      await review(c, context, spec, active);
      active = null;
    }
    report.status = report.pages.some(p => p.verdict === 'error') ? 'error' : report.pages.some(p => p.verdict === 'fail') ? 'fail' : report.pages.some(p => p.verdict === 'warning') ? 'warning' : 'pass';
  } catch (e) { report.status = 'error'; report.error = e.message; }
  finally {
    if (context) { try { await context.close(); report.browser_closed = true; } catch (e) { report.close_error = e.message; report.status = 'error'; } }
    process.removeListener('SIGINT', interrupt); process.removeListener('SIGTERM', interrupt);
    report.finished_at = new Date().toISOString();
    for (const key of ['rendered', 'measured']) report[key] = report.pages.length === c.pages.length && report.pages.every(p => p[key] === 'completed') ? 'completed' : report.pages.some(p => p[key] === 'completed') ? 'partial' : 'not-run';
    if (ownsOut) { json(path.join(c.out, 'QA.json'), report); json(path.join(c.out, 'QA.summary.json'), summarize(report, c.pages)); writeNewFile(path.join(c.out, 'comparison.html'), comparison(report)); writeNewFile(path.join(c.out, 'HANDOFF.md'), handoff(report, c.pages)); }
  }
  console.log(JSON.stringify({ out: c.out, ...summarize(report, c.pages) }));
  process.exitCode = ['pass', 'warning'].includes(report.status) ? 0 : report.status === 'fail' ? 1 : 2;
}
if (require.main === module) main().catch(e => { console.error(e.stack); process.exitCode = 2; });
module.exports = { preflight, inside, summarize };
