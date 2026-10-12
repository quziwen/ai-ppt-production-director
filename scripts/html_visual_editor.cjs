#!/usr/bin/env node

/*
 * Patrick PPT Director - minimal HTML Visual Editor Adapter
 *
 * This adapter is deliberately generic. It renders a Deck IR as a self-contained
 * HTML editing surface and keeps accepted edits in Deck IR / JSON patches. It does
 * not contain Patrick visual rules and it does not call an LLM directly. A host
 * application may handle richer natural-language instructions and send validated
 * patches through the postMessage bridge described in the generated page.
 */

const fs = require('fs');
const path = require('path');
const { validateDeckIR, validateGeometry, normalizeAllowedOrigins } = require('./deck_ir_validation.cjs');
const { assertSafeOutputs, writeNewFile } = require('./safe_output.cjs');
const { renderChartPreview } = require('./chart_preview.cjs');
const { resolveChartLayoutDefaults } = require('./chart_layout_defaults.cjs');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith('--mode=')) {
      args.mode = token.slice('--mode='.length);
      continue;
    }
    if (token === '--check') {
      args.check = true;
      continue;
    }
    if (token === '--help' || token === '-h') {
      args.help = true;
      continue;
    }
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      args[key] = value;
    }
  }
  return args;
}

function printUsage() {
  console.log([
    'Usage:',
    '  node html_visual_editor.cjs --input <deck-ir.json> --output <editor.html> [--mode editor|presentation]',
    '  node html_visual_editor.cjs --input <deck-ir.json> --check',
    '',
    'The generated HTML supports object selection, lasso selection, direct text',
    'editing, move/resize, common natural-language commands, undo/redo, and IR save.',
  ].join('\n'));
}

function serializeForScript(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

function buildHtml(ir, mode = 'editor') {
  const embedded = serializeForScript(ir);
  const title = String(ir.metadata && ir.metadata.title ? ir.metadata.title : 'Patrick PPT Director HTML Editor')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  return String.raw`<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} · HTML Visual Editor</title>
  <link rel="icon" href="data:,">
  <style>
    :root {
      color-scheme: light;
      --ink: #1d2939;
      --muted: #667085;
      --line: #d0d5dd;
      --line-soft: #eaecf0;
      --panel: #ffffff;
      --canvas: #eef1f5;
      --accent: #315b84;
      --accent-soft: #e7eff8;
      --warning: #9b6b21;
      --shadow: 0 10px 28px rgba(16, 24, 40, .12);
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; height: 100%; overflow: hidden; }
    body { font-family: Arial, "Microsoft YaHei", sans-serif; color: var(--ink); background: var(--canvas); }
    button, input { font: inherit; }
    button { cursor: pointer; }
    .app { height: 100vh; display: flex; flex-direction: column; }
    .topbar { height: 58px; display: flex; align-items: center; gap: 10px; padding: 0 16px; background: var(--panel); border-bottom: 1px solid var(--line); }
    .brand { min-width: 240px; font-size: 15px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .topbar-spacer { flex: 1; }
    .button { border: 1px solid var(--line); border-radius: 7px; padding: 7px 11px; color: var(--ink); background: #fff; }
    .button:hover { border-color: #98a2b3; background: #f9fafb; }
    .button.primary { border-color: var(--accent); color: #fff; background: var(--accent); }
    .button.primary:hover { background: #274c70; }
    .button:disabled { cursor: not-allowed; opacity: .45; }
    .body { min-height: 0; flex: 1; display: flex; }
    .sidebar, .inspector { width: 220px; min-width: 220px; padding: 16px; background: var(--panel); }
    .sidebar { border-right: 1px solid var(--line); overflow: auto; }
    .inspector { border-left: 1px solid var(--line); overflow: auto; }
    .panel-heading { margin-bottom: 10px; font-size: 11px; font-weight: 700; letter-spacing: .08em; color: var(--muted); text-transform: uppercase; }
    .slide-list { display: flex; flex-direction: column; gap: 7px; }
    .slide-button { width: 100%; padding: 9px 10px; text-align: left; border: 1px solid var(--line-soft); border-radius: 7px; color: var(--ink); background: #fff; }
    .slide-button:hover { border-color: #98a2b3; }
    .slide-button.active { border-color: var(--accent); background: var(--accent-soft); }
    .slide-button .slide-id { display: block; font-size: 11px; font-weight: 700; }
    .slide-button .slide-title { display: block; margin-top: 3px; overflow: hidden; color: var(--muted); font-size: 11px; white-space: nowrap; text-overflow: ellipsis; }
    .main { min-width: 0; flex: 1; display: flex; flex-direction: column; }
    .canvas-toolbar { height: 42px; display: flex; align-items: center; gap: 12px; padding: 0 16px; color: var(--muted); font-size: 12px; background: #fafbfc; border-bottom: 1px solid var(--line-soft); }
    .canvas-toolbar strong { color: var(--ink); }
    .selection-pill { padding: 4px 8px; border-radius: 999px; background: #f2f4f7; }
    .slide-stage { min-height: 0; flex: 1; position: relative; display: flex; align-items: center; justify-content: center; overflow: auto; padding: 22px; background: var(--canvas); }
    .slide-surface { position: relative; flex: 0 0 auto; overflow: hidden; box-shadow: var(--shadow); user-select: none; }
    .slide-surface.lasso-mode { cursor: crosshair; }
    .editor-element { position: absolute; overflow: visible; transform-origin: center center; }
    .editor-element.selectable { cursor: move; }
    .editor-element.selected { outline: 2px solid #3b82f6; outline-offset: 2px; z-index: 1000 !important; }
    .editor-element.selected::after { content: attr(data-object-id); position: absolute; left: 0; top: -18px; z-index: 1001; padding: 2px 5px; border-radius: 3px; color: #fff; background: #3b82f6; font: 10px Arial, sans-serif; white-space: nowrap; pointer-events: none; }
    .element-content { width: 100%; height: 100%; outline: none; }
    .line-content { position: absolute; pointer-events: none; }
    .element-content.direct-edit { cursor: text; outline: 2px solid #f79009; outline-offset: -2px; user-select: text; }
    .text-content, .shape-text { white-space: pre-line; overflow: hidden; }
    .shape-text { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; padding: 4px 8px; text-align: center; }
    .shape-text.align-left { justify-content: flex-start; text-align: left; }
    .shape-text.align-right { justify-content: flex-end; text-align: right; }
    .shape-text.valign-top { align-items: flex-start; }
    .shape-text.valign-bottom { align-items: flex-end; }
    .table-content { width: 100%; height: 100%; overflow: hidden; }
    .table-content table { width: 100%; height: 100%; border-collapse: collapse; table-layout: fixed; }
    .table-content td { overflow: hidden; padding: 4px 6px; border: 1px solid #d0d5dd; white-space: pre-line; }
    .table-content td.direct-edit { outline: 2px solid #f79009; outline-offset: -2px; background: #fffaf0; user-select: text; }
    .chart-content { width: 100%; height: 100%; position: relative; overflow: hidden; background: #fff; }
    .chart-svg { display: block; overflow: hidden; }
    .chart-preview-warning { position: absolute; bottom: 0; left: 0; right: 0; max-height: 45%; overflow: auto; padding: 5px; color: #753b05; background: #fff0d0; font: 11px/1.4 Arial, "Microsoft YaHei", sans-serif; }
    .chart-content[data-chart-status="unsupported"] { border: 1px solid #bf7900; padding: 8px; overflow: auto; }
    .chart-content[data-chart-status="unsupported"] .chart-preview-warning { position: static; max-height: none; }
    .chart-content pre { font-size: 11px; white-space: pre-wrap; }
    .media-placeholder { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; padding: 8px; color: #fff; background: #475467; text-align: center; white-space: pre-line; }
    .resize-handle { position: absolute; right: -6px; bottom: -6px; width: 12px; height: 12px; border: 2px solid #fff; border-radius: 2px; background: #3b82f6; cursor: nwse-resize; z-index: 1002; }
    .lasso { position: absolute; display: none; border: 1px dashed #3b82f6; background: rgba(59,130,246,.12); pointer-events: none; }
    .command-bar { display: flex; align-items: center; gap: 9px; min-height: 66px; padding: 10px 16px; background: var(--panel); border-top: 1px solid var(--line); }
    .command-label { width: 90px; color: var(--muted); font-size: 12px; font-weight: 700; }
    #nl-command { min-width: 0; flex: 1; padding: 9px 10px; border: 1px solid var(--line); border-radius: 7px; color: var(--ink); background: #fff; }
    #nl-command:focus { outline: 2px solid rgba(59,130,246,.22); border-color: #3b82f6; }
    #status { max-width: 330px; color: var(--muted); font-size: 11px; }
    .inspector-section { padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--line-soft); }
    .inspector-title { margin-bottom: 8px; font-size: 12px; font-weight: 700; }
    .hint { color: var(--muted); font-size: 11px; line-height: 1.55; }
    .selected-list { max-height: 190px; overflow: auto; padding: 8px; border: 1px solid var(--line-soft); border-radius: 6px; color: var(--muted); font: 11px Consolas, monospace; white-space: pre-wrap; }
    .warning { color: var(--warning); }
    kbd { padding: 1px 4px; border: 1px solid #d0d5dd; border-bottom-width: 2px; border-radius: 4px; background: #f9fafb; font-size: 10px; }
    .presentation-controls { display: none; }
    body[data-view="presentation"] .topbar,
    body[data-view="presentation"] .sidebar,
    body[data-view="presentation"] .inspector,
    body[data-view="presentation"] .canvas-toolbar,
    body[data-view="presentation"] .command-bar { display: none; }
    body[data-view="presentation"] .slide-stage { padding: 0; overflow: hidden; background: #111; }
    body[data-view="presentation"] .slide-surface { box-shadow: none; }
    body[data-view="presentation"] .editor-element.selectable { cursor: default; }
    body[data-view="presentation"] .presentation-controls { position: fixed; right: 12px; bottom: 10px; z-index: 2000; display: flex; align-items: center; gap: 6px; padding: 5px; border-radius: 8px; color: white; background: #111; opacity: .25; font-size: 12px; }
    body[data-view="presentation"] .presentation-controls:hover,
    body[data-view="presentation"] .presentation-controls:focus-within { opacity: 1; }
    .presentation-controls button:focus-visible { outline: 3px solid #3b82f6; outline-offset: 2px; }
  </style>
</head>
<body data-view="${mode}">
  <div class="app">
    <header class="topbar">
      <div class="brand" id="deck-title">${title}</div>
      <div class="topbar-spacer"></div>
      <button class="button" id="enter-presentation" type="button">演示</button>
      <button class="button" id="undo" type="button" disabled>撤销</button>
      <button class="button" id="redo" type="button" disabled>重做</button>
      <button class="button" id="export-patch" type="button">导出 Patch</button>
      <button class="button primary" id="save-ir" type="button">保存 IR</button>
    </header>
    <div class="body">
      <aside class="sidebar">
        <div class="panel-heading">Slides</div>
        <div class="slide-list" id="slide-list"></div>
      </aside>
      <main class="main">
        <div class="canvas-toolbar">
          <span>当前页面：<strong id="active-slide-label">-</strong></span>
          <span class="selection-pill" id="selection-info">未选择对象</span>
          <span>单击选择 · Shift 多选 · 在空白处拖拽圈选 · 双击文字直接编辑</span>
        </div>
        <div class="slide-stage" id="slide-stage">
          <div class="slide-surface" id="slide-surface"></div>
          <div class="lasso" id="lasso"></div>
        </div>
        <div class="command-bar">
          <div class="command-label">自然语言修改</div>
          <input id="nl-command" type="text" placeholder="例如：把选中的标题改成“共享底座决定扩展质量”">
          <button class="button primary" id="apply-nl" type="button">应用修改</button>
          <div id="status">等待选择对象。</div>
        </div>
      </main>
      <aside class="inspector">
        <div class="inspector-section">
          <div class="panel-heading">Selection</div>
          <div class="inspector-title" id="selection-count">0 个对象</div>
          <div class="selected-list" id="selected-list">尚未选择对象</div>
        </div>
        <div class="inspector-section">
          <div class="panel-heading">Editing contract</div>
          <div class="hint">页面对象映射到稳定 Deck IR ID。自然语言修改先生成受控 patch，再写回 IR。</div>
        </div>
        <div class="inspector-section">
          <div class="panel-heading">Chart preview</div>
          <div class="hint" id="chart-preview-summary">当前页图表尚未检查。</div>
        </div>
        <div class="inspector-section">
          <div class="panel-heading">Host bridge</div>
          <div class="hint">未被内置解析器覆盖的指令会通过 <code>postMessage</code> 发给宿主 AI。宿主返回经过校验的 patch 后，页面可以继续应用。</div>
        </div>
        <div class="hint"><span class="warning">注意：</span>这是编辑器适配器试验版，不代表当前静态 HTML 预览已经具备全部 H2/H3 能力。</div>
      </aside>
    </div>
  </div>
  <nav class="presentation-controls" aria-label="演示翻页">
    <button class="button" id="presentation-prev" type="button" aria-label="上一页">‹</button>
    <span id="presentation-page" aria-live="polite" aria-atomic="true"></span>
    <button class="button" id="presentation-next" type="button" aria-label="下一页">›</button>
    <button class="button" id="exit-presentation" type="button" aria-label="返回编辑（Esc）">编辑</button>
  </nav>
  <script>
    window.__PATRICK_DECK_IR__ = ${embedded};
  </script>
  <script>
  (function () {
    'use strict';

    var ir = window.__PATRICK_DECK_IR__;
    var activeSlideIndex = 0;
    var selectedIds = [];
    var undoStack = [];
    var redoStack = [];
    var patchLog = [];
    var currentScale = 1;
    var pointerState = null;
    var viewMode = 'editor';
    var editorSlideIndex = 0;

    var slideList = document.getElementById('slide-list');
    var slideStage = document.getElementById('slide-stage');
    var slideSurface = document.getElementById('slide-surface');
    var lasso = document.getElementById('lasso');
    var activeSlideLabel = document.getElementById('active-slide-label');
    var selectionInfo = document.getElementById('selection-info');
    var selectionCount = document.getElementById('selection-count');
    var selectedList = document.getElementById('selected-list');
    var status = document.getElementById('status');
    var nlCommand = document.getElementById('nl-command');

    function setMode(mode) {
      if (mode !== 'editor' && mode !== 'presentation') throw new Error('Unknown view mode: ' + mode);
      document.body.dataset.view = mode;
      if (mode === viewMode) return;
      if (mode === 'presentation') {
        editorSlideIndex = activeSlideIndex;
        // Cancel an unfinished gesture, never turn it into an implicit patch.
        if (pointerState && pointerState.before) ir = pointerState.before;
        pointerState = null;
        lasso.style.display = 'none';
        slideSurface.classList.remove('lasso-mode');
      } else {
        activeSlideIndex = editorSlideIndex;
      }
      viewMode = mode;
      renderSlideList();
      renderSlide();
      setStageSize();
      if (mode === 'presentation') {
        slideStage.tabIndex = -1;
        slideStage.focus({ preventScroll: true });
      } else {
        document.getElementById('enter-presentation').focus({ preventScroll: true });
      }
    }

    function presentSlide(index) {
      if (viewMode !== 'presentation') return;
      activeSlideIndex = Math.max(0, Math.min(ir.slides.length - 1, index));
      renderSlide();
    }

    function selectSlide(slideId) {
      var index = ir.slides.findIndex(function (slide) { return slide.id === slideId; });
      if (index < 0) throw new Error('Unknown slide ID: ' + String(slideId));
      if (viewMode !== 'presentation') throw new Error('selectSlide requires presentation mode');
      presentSlide(index);
      return ir.slides[index].id;
    }

    function presentationKeydown(event) {
      if (viewMode !== 'presentation' || event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
      var target = event.target;
      if (target && (target.isContentEditable || (target.closest && target.closest('input, textarea, select, [role="textbox"], [contenteditable]:not([contenteditable="false"])')))) return;
      // Space on an accessible button uses its native click, not two page turns.
      if (event.key === ' ' && target.closest && target.closest('button, a, summary')) return;
      if (event.key === 'Escape') { event.preventDefault(); setMode('editor'); return; }
      var index = activeSlideIndex;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === ' ') index += 1;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') index -= 1;
      else if (event.key === 'Home') index = 0;
      else if (event.key === 'End') index = ir.slides.length - 1;
      else return;
      event.preventDefault();
      presentSlide(index);
    }

    ${normalizeAllowedOrigins.toString()}
    ${validateGeometry.toString()}
    ${resolveChartLayoutDefaults.toString()}
    ${renderChartPreview.toString()}

    function configuredMessageOrigins() {
      return normalizeAllowedOrigins(ir.editor && ir.editor.allowed_origins);
    }

    function postToHost(message) {
      // A standalone file has no external host. Avoid broadcasting the IR to
      // an arbitrary target origin; same-window bridge calls remain available
      // through the public editor API and local postMessage regression tests.
      if (window.parent === window) return;
      var origins = configuredMessageOrigins();
      if (!origins.length) {
        setStatus('未配置受控宿主来源，已阻止向外发送编辑消息。', true);
        return;
      }
      origins.forEach(function (origin) {
        window.parent.postMessage(message, origin);
      });
    }

    function messageFromAllowedHost(event) {
      if (event.source === window) return true;
      if (event.source !== window.parent) return false;
      return configuredMessageOrigins().indexOf(event.origin) >= 0;
    }

    function deepClone(value) {
      return JSON.parse(JSON.stringify(value));
    }

    function setStatus(message, isWarning) {
      status.textContent = message;
      status.className = isWarning ? 'warning' : '';
    }

    function activeSlide() {
      return ir.slides[activeSlideIndex];
    }

    function findElement(id) {
      for (var s = 0; s < ir.slides.length; s += 1) {
        for (var e = 0; e < ir.slides[s].elements.length; e += 1) {
          if (ir.slides[s].elements[e].id === id) return ir.slides[s].elements[e];
        }
      }
      return null;
    }

    function findElementSlideIndex(id) {
      for (var s = 0; s < ir.slides.length; s += 1) {
        if (ir.slides[s].elements.some(function (item) { return item.id === id; })) return s;
      }
      return -1;
    }

    function visibleText(element) {
      if (!element) return '';
      if (element.type === 'table') return '表格';
      if (element.type === 'chart') return '图表';
      return String(element.text || '');
    }

    function firstTitle(slide) {
      var title = slide.elements.find(function (element) {
        return element.type === 'text' && /title|标题/i.test(element.id);
      });
      if (!title) title = slide.elements.find(function (element) { return element.type === 'text'; });
      return title ? visibleText(title) : '';
    }

    function colorValue(value, fallback) {
      if (value === null || value === undefined || value === '' || value === 'none') return fallback || 'transparent';
      if (typeof value !== 'string') return fallback || 'transparent';
      if (/^#?[0-9a-f]{3,8}$/i.test(value)) return value.charAt(0) === '#' ? value : '#' + value;
      return value;
    }

    function cssBorder(line) {
      if (!line || line === 'none') return 'none';
      if (typeof line === 'string') return '1px solid ' + colorValue(line, '#98a2b3');
      return String(line.width || 1) + 'px solid ' + colorValue(line.color, '#98a2b3');
    }

    function fontSizePx(pointSize) {
      var points = Number(pointSize || 12);
      // currentScale is CSS pixels per slide inch. Point sizes are already
      // physical typography units, so map them once to the rendered slide.
      return (points * currentScale / 72) + 'px';
    }

    function setGeometry(node, element) {
      var width = ir.slide_size.width_in;
      var height = ir.slide_size.height_in;
      var elementWidth = Number(element.w);
      var elementHeight = Number(element.h);
      if (element.type === 'line' && elementWidth < 0.025) elementWidth = 0.025;
      if (element.type === 'line' && elementHeight < 0.025) elementHeight = 0.025;
      node.style.left = (Number(element.x) / width * 100) + '%';
      node.style.top = (Number(element.y) / height * 100) + '%';
      node.style.width = (elementWidth / width * 100) + '%';
      node.style.height = (elementHeight / height * 100) + '%';
      node.style.zIndex = String(element.z || 1);
    }

    function setTextStyle(node, style) {
      var safeStyle = style || {};
      node.style.fontFamily = safeStyle.fontFace || safeStyle.fontFamily || 'Arial, "Microsoft YaHei", sans-serif';
      node.style.fontSize = fontSizePx(safeStyle.fontSize || 12);
      node.style.fontWeight = safeStyle.bold ? '700' : String(safeStyle.fontWeight || '400');
      node.style.fontStyle = safeStyle.italic ? 'italic' : 'normal';
      node.style.color = colorValue(safeStyle.color, '#1d2939');
      node.style.textAlign = safeStyle.align || 'left';
      node.style.lineHeight = String(safeStyle.lineSpacing || 1.2);
    }

    function setLineStyle(node, element) {
      var lineNode = node.querySelector('.line-content');
      if (!lineNode) return;
      var line = element.line && element.line !== 'none' ? element.line : {};
      var widthPt = Number(line.width || 1);
      var widthPx = Math.max(1, widthPt * currentScale / 72);
      lineNode.style.background = colorValue(line.color, '#98a2b3');
      lineNode.style.border = '0';
      if (Number(element.w) <= 0.01 && Number(element.h) > 0.01) {
        lineNode.style.left = '50%';
        lineNode.style.top = '0';
        lineNode.style.width = widthPx + 'px';
        lineNode.style.height = '100%';
        lineNode.style.transform = 'translateX(-50%)';
      } else {
        lineNode.style.left = '0';
        lineNode.style.top = '50%';
        lineNode.style.width = '100%';
        lineNode.style.height = widthPx + 'px';
        lineNode.style.transform = 'translateY(-50%)';
      }
    }

    function shapeTextClasses(style) {
      var classes = ['shape-text'];
      if (style && style.align === 'left') classes.push('align-left');
      if (style && style.align === 'right') classes.push('align-right');
      if (style && style.valign === 'top') classes.push('valign-top');
      if (style && style.valign === 'bottom') classes.push('valign-bottom');
      return classes.join(' ');
    }

    function buildTable(element) {
      var wrapper = document.createElement('div');
      wrapper.className = 'table-content';
      var table = document.createElement('table');
      var rows = Array.isArray(element.rows) ? element.rows : [];
      var options = element.options || {};
      rows.forEach(function (row, rowIndex) {
        var tr = document.createElement('tr');
        row.forEach(function (cell, columnIndex) {
          var td = document.createElement('td');
          td.textContent = String(cell === null || cell === undefined ? '' : cell);
          td.dataset.rowIndex = String(rowIndex);
          td.dataset.columnIndex = String(columnIndex);
          td.style.fontFamily = options.fontFace || 'Arial, "Microsoft YaHei", sans-serif';
          td.style.fontSize = fontSizePx(options.fontSize || 11);
          td.style.color = colorValue(options.color, '#43505f');
          td.style.background = colorValue(options.fill, 'rgba(255,255,255,.72)');
          tr.appendChild(td);
        });
        table.appendChild(tr);
      });
      wrapper.appendChild(table);
      return wrapper;
    }

    function buildChart(element) {
      return renderChartPreview(element);
    }

    function buildElement(element) {
      var node = document.createElement('div');
      node.className = 'editor-element selectable';
      node.dataset.objectId = element.id;
      node.dataset.elementType = element.type;
      setGeometry(node, element);

      if (element.type === 'text') {
        var textNode = document.createElement('div');
        textNode.className = 'element-content text-content';
        textNode.textContent = String(element.text || '');
        setTextStyle(textNode, element.style || {});
        node.appendChild(textNode);
      } else if (element.type === 'line') {
        var lineNode = document.createElement('div');
        lineNode.className = 'element-content line-content';
        node.appendChild(lineNode);
        setLineStyle(node, element);
      } else if (element.type === 'shape') {
        node.style.background = colorValue(element.fill, 'transparent');
        node.style.border = cssBorder(element.line);
        node.style.borderRadius = element.geometry === 'roundRect' ? '10px' : '0';
        var shapeText = document.createElement('div');
        shapeText.className = 'element-content ' + shapeTextClasses(element.text_style || {});
        shapeText.textContent = String(element.text || '');
        setTextStyle(shapeText, element.text_style || {});
        node.appendChild(shapeText);
      } else if (element.type === 'table') {
        node.appendChild(buildTable(element));
      } else if (element.type === 'chart') {
        node.appendChild(buildChart(element));
      } else if (element.type === 'image' || element.type === 'video') {
        var media = document.createElement('div');
        media.className = 'media-placeholder';
        media.textContent = (element.type === 'video' ? 'VIDEO\n' : 'IMAGE\n') + String(element.path || 'media object');
        node.appendChild(media);
      }

      node.addEventListener('pointerdown', onElementPointerDown);
      node.addEventListener('dblclick', onElementDoubleClick);
      return node;
    }

    function renderSlide() {
      var slide = activeSlide();
      slideSurface.innerHTML = '';
      slideSurface.style.background = colorValue(slide.background, '#ffffff');
      slideSurface.style.aspectRatio = ir.slide_size.width_in + ' / ' + ir.slide_size.height_in;
      slide.elements.forEach(function (element) {
        slideSurface.appendChild(buildElement(element));
      });
      activeSlideLabel.textContent = slide.id;
      document.getElementById('presentation-page').textContent = (activeSlideIndex + 1) + ' / ' + ir.slides.length;
      document.getElementById('presentation-prev').disabled = activeSlideIndex === 0;
      document.getElementById('presentation-next').disabled = activeSlideIndex === ir.slides.length - 1;
      syncSelection();
      requestAnimationFrame(setStageSize);
    }

    function setStageSize() {
      var widthIn = Number(ir.slide_size.width_in);
      var heightIn = Number(ir.slide_size.height_in);
      var availableWidth = viewMode === 'presentation' ? Math.max(1, slideStage.clientWidth) : Math.max(320, slideStage.clientWidth - 44);
      var availableHeight = viewMode === 'presentation' ? Math.max(1, slideStage.clientHeight) : Math.max(240, slideStage.clientHeight - 44);
      currentScale = Math.min(availableWidth / widthIn, availableHeight / heightIn);
      slideSurface.style.width = (widthIn * currentScale) + 'px';
      slideSurface.style.height = (heightIn * currentScale) + 'px';
      document.querySelectorAll('.editor-element').forEach(function (node) {
        var id = node.dataset.objectId;
        var element = findElement(id);
        if (!element) return;
        setGeometry(node, element);
        var textNode = node.querySelector('.text-content, .shape-text');
        if (textNode) setTextStyle(textNode, element.type === 'shape' ? (element.text_style || {}) : (element.style || {}));
        if (element.type === 'line') setLineStyle(node, element);
        node.querySelectorAll('td').forEach(function (td) {
          var options = element.options || {};
          td.style.fontSize = fontSizePx(options.fontSize || 11);
        });
      });
      document.fonts.ready.then(function () {
        var warnings = [];
        var count = 0;
        document.querySelectorAll('.chart-content').forEach(function (chart) {
          count += 1;
          if (chart.checkChartLayout) chart.checkChartLayout();
          if (chart.dataset.chartStatus !== 'rendered') warnings.push(chart.closest('.editor-element').dataset.objectId + ': ' + chart.dataset.chartStatus);
        });
        var summary = document.getElementById('chart-preview-summary');
        summary.textContent = !count ? '当前页无图表。' : warnings.length ? '当前页图表预览有缺口：' + warnings.join('；') + '。不能据此通过视觉验收。' : '当前页 ' + count + ' 个图表已渲染并测量标签；仍需实际看图，不代表PowerPoint像素一致或已验收。';
        summary.className = warnings.length ? 'hint warning' : 'hint';
      });
    }

    function renderSlideList() {
      slideList.innerHTML = '';
      ir.slides.forEach(function (slide, index) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'slide-button' + (index === activeSlideIndex ? ' active' : '');
        var id = document.createElement('span');
        id.className = 'slide-id';
        id.textContent = slide.id;
        var titleNode = document.createElement('span');
        titleNode.className = 'slide-title';
        titleNode.textContent = firstTitle(slide) || '未命名页面';
        button.appendChild(id);
        button.appendChild(titleNode);
        button.addEventListener('click', function () {
          if (viewMode === 'presentation') return;
          activeSlideIndex = index;
          selectedIds = [];
          renderSlideList();
          renderSlide();
          setStatus('已切换到 ' + slide.id + '。');
        });
        slideList.appendChild(button);
      });
    }

    function syncSelection() {
      document.querySelectorAll('.editor-element').forEach(function (node) {
        var selected = viewMode === 'editor' && selectedIds.indexOf(node.dataset.objectId) >= 0;
        node.classList.toggle('selected', selected);
        var oldHandle = node.querySelector('.resize-handle');
        if (oldHandle) oldHandle.remove();
        if (selected && selectedIds.length === 1) {
          var handle = document.createElement('div');
          handle.className = 'resize-handle';
          handle.addEventListener('pointerdown', onResizePointerDown);
          node.appendChild(handle);
        }
      });
      var count = selectedIds.length;
      selectionCount.textContent = count + ' 个对象';
      selectionInfo.textContent = count ? '已选择 ' + count + ' 个对象' : '未选择对象';
      selectedList.textContent = count ? selectedIds.join('\n') : '尚未选择对象';
    }

    function updateSelection(ids, additive) {
      var clean = ids.filter(function (id, index) { return id && ids.indexOf(id) === index; });
      if (additive) {
        clean.forEach(function (id) {
          var position = selectedIds.indexOf(id);
          if (position >= 0) selectedIds.splice(position, 1);
          else selectedIds.push(id);
        });
      } else {
        selectedIds = clean;
      }
      syncSelection();
    }

    function pointerToInches(event) {
      var rect = slideSurface.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) / rect.width * ir.slide_size.width_in,
        y: (event.clientY - rect.top) / rect.height * ir.slide_size.height_in,
      };
    }

    function clamp(value, min, max) {
      if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) {
        throw new Error('几何数值必须是有限数字');
      }
      if (max < min) throw new Error('几何对象超出画布范围');
      return Math.max(min, Math.min(max, value));
    }

    function objectAtPointer(target) {
      var node = target.closest ? target.closest('.editor-element') : null;
      if (!node || !slideSurface.contains(node)) return null;
      return findElement(node.dataset.objectId);
    }

    function onElementPointerDown(event) {
      if (viewMode === 'presentation') return;
      if (event.button !== 0) return;
      if (event.target.closest && event.target.closest('.resize-handle')) return;
      var element = objectAtPointer(event.target);
      if (!element) return;
      event.stopPropagation();
      var additive = event.shiftKey || event.ctrlKey || event.metaKey;
      // A plain click always focuses the clicked object. Modifier-click keeps
      // the explicit additive/toggle multi-selection behavior.
      updateSelection([element.id], additive);
      var start = pointerToInches(event);
      var before = deepClone(ir);
      var original = selectedIds.map(function (id) {
        var item = findElement(id);
        return { id: id, x: item.x, y: item.y };
      });
      pointerState = { kind: 'move', start: start, before: before, original: original, changed: false };
      try { event.currentTarget.setPointerCapture(event.pointerId); } catch (ignore) {}
    }

    function onResizePointerDown(event) {
      if (viewMode === 'presentation') return;
      if (event.button !== 0 || selectedIds.length !== 1) return;
      event.stopPropagation();
      var id = selectedIds[0];
      var element = findElement(id);
      if (!element) return;
      pointerState = {
        kind: 'resize',
        start: pointerToInches(event),
        before: deepClone(ir),
        id: id,
        x: element.x,
        y: element.y,
        w: element.w,
        h: element.h,
        changed: false,
      };
      try { event.currentTarget.setPointerCapture(event.pointerId); } catch (ignore) {}
    }

    function onElementDoubleClick(event) {
      if (viewMode === 'presentation') return;
      event.stopPropagation();
      var element = objectAtPointer(event.target);
      if (!element) return;
      var cell = event.target.closest ? event.target.closest('td') : null;
      if (cell && element.type === 'table') {
        beginCellEdit(element, cell);
        return;
      }
      if (element.type === 'text' || element.type === 'shape') beginTextEdit(element);
    }

    function beginTextEdit(element) {
      var node = document.querySelector('[data-object-id="' + cssEscape(element.id) + '"] .text-content, [data-object-id="' + cssEscape(element.id) + '"] .shape-text');
      if (!node) return;
      node.contentEditable = 'true';
      node.classList.add('direct-edit');
      node.dataset.originalText = String(element.text || '');
      node.focus();
      var range = document.createRange();
      range.selectNodeContents(node);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      function finish() {
        node.contentEditable = 'false';
        node.classList.remove('direct-edit');
        node.removeEventListener('blur', finish);
        if (viewMode === 'presentation') return;
        var nextText = node.textContent.replace(/\r/g, '');
        var oldText = node.dataset.originalText;
        if (nextText !== oldText) {
          applyPatches([{ operation: 'set_text', target_ids: [element.id], value: nextText, reason: 'Direct browser text edit', source: 'user', status: 'accepted' }], '直接改字');
        } else {
          renderSlide();
        }
      }
      node.addEventListener('blur', finish);
      setStatus('正在编辑 ' + element.id + '；点击其他位置保存。');
    }

    function beginCellEdit(element, cell) {
      var rowIndex = Number(cell.dataset.rowIndex);
      var columnIndex = Number(cell.dataset.columnIndex);
      var oldText = String((element.rows[rowIndex] || [])[columnIndex] || '');
      cell.contentEditable = 'true';
      cell.classList.add('direct-edit');
      cell.dataset.originalText = oldText;
      cell.focus();
      var range = document.createRange();
      range.selectNodeContents(cell);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      function finish() {
        cell.contentEditable = 'false';
        cell.classList.remove('direct-edit');
        cell.removeEventListener('blur', finish);
        if (viewMode === 'presentation') return;
        var nextText = cell.textContent.replace(/\r/g, '');
        if (nextText !== oldText) {
          applyPatches([{ operation: 'set_property', target_ids: [element.id], value: { property: 'table-cell', row: rowIndex, column: columnIndex, text: nextText }, reason: 'Direct browser table edit', source: 'user', status: 'accepted' }], '直接改表格');
        } else {
          renderSlide();
        }
      }
      cell.addEventListener('blur', finish);
      setStatus('正在编辑表格 ' + element.id + '。');
    }

    function cssEscape(value) {
      return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }

    function elementOnSlide(id, slide) {
      return slide.elements.some(function (element) { return element.id === id; });
    }

    function safeColor(value, allowNone) {
      var text = String(value === undefined || value === null ? '' : value).trim();
      if (allowNone && text === 'none') return true;
      return /^(?:#[0-9a-f]{3,8}|[a-z]+|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)|hsla?\(\s*\d+(?:\.\d+)?\s*,\s*\d+%\s*,\s*\d+%(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\))$/i.test(text);
    }

    function finitePatchNumber(value, label) {
      if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(label + '必须是有限数字');
      return value;
    }

    function validateTargetGeometry(element) {
      validateGeometry(element, ir.slide_size);
    }

    function validatePatchValue(patch, element) {
      var operation = patch.operation;
      if (operation === 'set_text') {
        if (element.type !== 'text' && element.type !== 'shape') throw new Error('set_text 只能作用于文本或带文字的形状');
        if (typeof patch.value !== 'string' && typeof patch.value !== 'number') throw new Error('set_text value 必须是字符串或数字');
        return;
      }
      if (operation === 'move') {
        if (!patch.value || typeof patch.value !== 'object' || Array.isArray(patch.value)) throw new Error('move value 必须包含 dx/dy');
        finitePatchNumber(patch.value.dx === undefined ? 0 : patch.value.dx, 'move.dx');
        finitePatchNumber(patch.value.dy === undefined ? 0 : patch.value.dy, 'move.dy');
        return;
      }
      if (operation === 'resize') {
        if (!patch.value || typeof patch.value !== 'object' || Array.isArray(patch.value)) throw new Error('resize value 必须包含 w/h 或 scale');
        var keys = Object.keys(patch.value).filter(function (key) { return ['w', 'h', 'scale'].indexOf(key) >= 0; });
        if (!keys.length || (patch.value.scale !== undefined && (patch.value.w !== undefined || patch.value.h !== undefined))) throw new Error('resize 只能使用 scale，或使用 w/h');
        if (patch.value.scale !== undefined && finitePatchNumber(patch.value.scale, 'resize.scale') <= 0) throw new Error('resize.scale 必须为正数');
        if (patch.value.w !== undefined && finitePatchNumber(patch.value.w, 'resize.w') <= 0) throw new Error('resize.w 必须为正数');
        if (patch.value.h !== undefined && finitePatchNumber(patch.value.h, 'resize.h') <= 0) throw new Error('resize.h 必须为正数');
        return;
      }
      if (operation === 'set_property') {
        var property = patch.value;
        if (!property || typeof property !== 'object' || Array.isArray(property) || typeof property.property !== 'string') throw new Error('set_property value 必须包含 property');
        if (property.property === 'table-cell') {
          if (element.type !== 'table') throw new Error('table-cell property requires a table');
          var row = finitePatchNumber(property.row, 'table-cell.row');
          var column = finitePatchNumber(property.column, 'table-cell.column');
          if (!Number.isInteger(row) || row < 0 || !Number.isInteger(column) || column < 0) throw new Error('table-cell row/column 必须是非负整数');
          if (typeof property.text !== 'string' && typeof property.text !== 'number') throw new Error('table-cell.text 必须是字符串或数字');
        } else if (property.property === 'color') {
          if (['text', 'shape', 'line'].indexOf(element.type) < 0) throw new Error('color 只能作用于文本、带文字的形状或线条');
          if (!safeColor(property.value, false)) throw new Error('color 不是受控颜色值');
        } else if (property.property === 'fill') {
          if (element.type !== 'shape') throw new Error('fill 只能作用于形状');
          if (!safeColor(property.value, true)) throw new Error('fill 不是受控颜色值');
        } else if (property.property === 'fontSize') {
          if (element.type !== 'text' && element.type !== 'shape') throw new Error('fontSize 只能作用于文本或带文字的形状');
          if (finitePatchNumber(property.value, 'fontSize') <= 0) throw new Error('fontSize 必须为正数');
        } else {
          throw new Error('Unsupported property patch: ' + property.property);
        }
        return;
      }
      if (operation === 'replace_media') {
        if (element.type !== 'image' && element.type !== 'video') throw new Error('replace_media requires a media object');
        if (typeof patch.value !== 'string' || !patch.value.trim() || /^(?:javascript|data):/i.test(patch.value.trim()) || /[<>]/.test(patch.value)) throw new Error('媒体路径必须是非空的受控路径');
      }
    }

    function validatePatch(patch) {
      if (!patch || typeof patch !== 'object') throw new Error('Patch must be an object');
      var allowedOperations = ['set_text', 'move', 'resize', 'set_property', 'replace_media'];
      if (allowedOperations.indexOf(patch.operation) < 0) throw new Error('Unsupported patch operation: ' + patch.operation);
      if (!Array.isArray(patch.target_ids) || !patch.target_ids.length) throw new Error('Patch target_ids cannot be empty');
      if (patch.target_ids.some(function (id, index) { return typeof id !== 'string' || !id.trim() || patch.target_ids.indexOf(id) !== index; })) throw new Error('Patch target_ids 必须是非空且不重复的字符串');
      if (patch.status !== 'accepted') throw new Error('只有 status=accepted 的 patch 才能写入当前 IR');
      if (patch.source !== 'user' && patch.source !== 'assistant') throw new Error('Patch source 必须是 user 或 assistant');
      if (typeof patch.reason !== 'string' || !patch.reason.trim()) throw new Error('Patch reason 不能为空');
      patch.target_ids.forEach(function (id) {
        var element = findElement(id);
        if (!element) throw new Error('Patch target does not exist: ' + id);
        validateTargetGeometry(element);
        validatePatchValue(patch, element);
      });
    }

    function markEvidencePendingAfterPatch(element, patch) {
      var hasEvidenceRecord = element && (
        (element.evidence && typeof element.evidence === 'object')
        || element.evidence_status !== undefined
        || element.type === 'table'
        || element.type === 'chart'
      );
      if (!hasEvidenceRecord) return;
      var property = patch && patch.value && typeof patch.value === 'object' ? patch.value.property : '';
      var changesEvidence = (patch.operation === 'set_text' && (element.evidence || element.evidence_status !== undefined))
        || (patch.operation === 'set_property' && property === 'table-cell')
        || (patch.operation === 'replace_media' && (element.evidence || element.evidence_status !== undefined));
      if (!changesEvidence) return;
      if (element.evidence && typeof element.evidence === 'object') element.evidence.status = 'pending';
      if (element.evidence_status !== undefined || element.type === 'table' || element.type === 'chart') element.evidence_status = 'pending';
    }

    function applyPatchToIR(patch) {
      validatePatch(patch);
      patch.target_ids.forEach(function (id) {
        var element = findElement(id);
        if (patch.operation === 'set_text') {
          if (element.type === 'table') throw new Error('Use table-cell property patch for tables');
          element.text = String(patch.value === undefined || patch.value === null ? '' : patch.value);
        } else if (patch.operation === 'move') {
          var move = patch.value || {};
          var dx = Number(move.dx || 0);
          var dy = Number(move.dy || 0);
          if (!Number.isFinite(dx) || !Number.isFinite(dy)) throw new Error('Move patch requires numeric dx/dy');
          element.x += dx;
          element.y += dy;
        } else if (patch.operation === 'resize') {
          var resize = patch.value || {};
          if (resize.scale !== undefined) {
            var scale = Number(resize.scale);
            if (!Number.isFinite(scale) || scale <= 0) throw new Error('Resize scale must be positive');
            element.w *= scale;
            element.h *= scale;
          } else {
            if (resize.w !== undefined) element.w = resize.w;
            if (resize.h !== undefined) element.h = resize.h;
          }
        } else if (patch.operation === 'set_property') {
          var property = patch.value || {};
          if (property.property === 'table-cell') {
            if (element.type !== 'table') throw new Error('table-cell property requires a table');
            var row = Number(property.row);
            var column = Number(property.column);
            if (!element.rows[row] || element.rows[row][column] === undefined) throw new Error('Table cell does not exist');
            element.rows[row][column] = String(property.text === undefined ? '' : property.text);
          } else if (property.property === 'color') {
            if (element.type === 'text') {
              element.style = element.style || {};
              element.style.color = String(property.value);
            } else if (element.type === 'shape') {
              element.text_style = element.text_style || {};
              element.text_style.color = String(property.value);
            } else if (element.type === 'line') {
              element.line = element.line && element.line !== 'none' ? element.line : {};
              element.line.color = String(property.value);
            }
          } else if (property.property === 'fill' && element.type === 'shape') {
            element.fill = String(property.value);
          } else if (property.property === 'fontSize' && (element.type === 'text' || element.type === 'shape')) {
            var style = element.type === 'text' ? (element.style = element.style || {}) : (element.text_style = element.text_style || {});
            style.fontSize = Number(property.value);
            if (!Number.isFinite(style.fontSize) || style.fontSize <= 0) throw new Error('fontSize must be positive');
          } else {
            throw new Error('Unsupported property patch: ' + property.property);
          }
        } else if (patch.operation === 'replace_media') {
          if (element.type !== 'image' && element.type !== 'video') throw new Error('replace_media requires a media object');
          element.path = String(patch.value || '');
        }
        validateTargetGeometry(element);
        markEvidencePendingAfterPatch(element, patch);
      });
    }

    function recordHistory(label, before, after, patches) {
      undoStack.push({ label: label, before: before, after: after, patches: patches || [] });
      redoStack = [];
      (patches || []).forEach(function (patch) { patchLog.push(patch); });
      updateHistoryButtons();
    }

    function applyPatches(patches, label) {
      if (viewMode === 'presentation') throw new Error('Presentation mode is read-only; return to editor before applying patches');
      var list = Array.isArray(patches) ? patches : [patches];
      var before = deepClone(ir);
      var original = ir;
      ir = deepClone(ir);
      try {
        list.forEach(applyPatchToIR);
      } catch (error) {
        ir = original;
        throw error;
      }
      var after = deepClone(ir);
      recordHistory(label, before, after, list);
      renderSlideList();
      renderSlide();
      setStatus(label + '已应用，已写入当前 IR 状态。');
      postToHost({ type: 'patrick-ppt-director-ir-patch-applied', payload: { patches: list, ir: ir } });
    }

    function updateHistoryButtons() {
      document.getElementById('undo').disabled = undoStack.length === 0;
      document.getElementById('redo').disabled = redoStack.length === 0;
    }

    function undo() {
      if (viewMode === 'presentation') return;
      var entry = undoStack.pop();
      if (!entry) return;
      redoStack.push(entry);
      ir = deepClone(entry.before);
      renderSlideList();
      renderSlide();
      updateHistoryButtons();
      setStatus('已撤销：' + entry.label + '。');
    }

    function redo() {
      if (viewMode === 'presentation') return;
      var entry = redoStack.pop();
      if (!entry) return;
      undoStack.push(entry);
      ir = deepClone(entry.after);
      renderSlideList();
      renderSlide();
      updateHistoryButtons();
      setStatus('已重做：' + entry.label + '。');
    }

    function finishPointerMutation() {
      if (!pointerState) return;
      var state = pointerState;
      pointerState = null;
      if (!state.changed) return;
      var after = deepClone(ir);
      var patches = [];
      if (state.kind === 'move') {
        state.original.forEach(function (item) {
          var now = findElement(item.id);
          patches.push({ operation: 'move', target_ids: [item.id], value: { dx: Number(now.x) - Number(item.x), dy: Number(now.y) - Number(item.y) }, reason: 'Browser drag', source: 'user', status: 'accepted' });
        });
        recordHistory('移动对象', state.before, after, patches);
        setStatus('移动已保存。');
      } else if (state.kind === 'resize') {
        var current = findElement(state.id);
        patches.push({ operation: 'resize', target_ids: [state.id], value: { w: current.w, h: current.h }, reason: 'Browser resize', source: 'user', status: 'accepted' });
        recordHistory('调整尺寸', state.before, after, patches);
        setStatus('尺寸调整已保存。');
      }
      renderSlideList();
      renderSlide();
    }

    function onPointerMove(event) {
      if (viewMode === 'presentation') return;
      if (!pointerState) return;
      var point = pointerToInches(event);
      if (pointerState.kind === 'move') {
        var dx = point.x - pointerState.start.x;
        var dy = point.y - pointerState.start.y;
        pointerState.original.forEach(function (item) {
          var element = findElement(item.id);
          element.x = clamp(Number(item.x) + dx, 0, ir.slide_size.width_in - Number(element.w));
          element.y = clamp(Number(item.y) + dy, 0, ir.slide_size.height_in - Number(element.h));
        });
        pointerState.changed = Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001;
        document.querySelectorAll('.editor-element.selected').forEach(function (node) { setGeometry(node, findElement(node.dataset.objectId)); });
      } else if (pointerState.kind === 'resize') {
        var element = findElement(pointerState.id);
        element.w = clamp(pointerState.w + (point.x - pointerState.start.x), 0.05, ir.slide_size.width_in - pointerState.x);
        element.h = clamp(pointerState.h + (point.y - pointerState.start.y), 0.05, ir.slide_size.height_in - pointerState.y);
        pointerState.changed = Math.abs(element.w - pointerState.w) > 0.001 || Math.abs(element.h - pointerState.h) > 0.001;
        var node = document.querySelector('[data-object-id="' + cssEscape(pointerState.id) + '"]');
        if (node) setGeometry(node, element);
      } else if (pointerState.kind === 'lasso') {
        var start = pointerState.start;
        var left = Math.min(start.x, point.x);
        var top = Math.min(start.y, point.y);
        var width = Math.abs(point.x - start.x);
        var height = Math.abs(point.y - start.y);
        lasso.style.display = 'block';
        lasso.style.left = (left / ir.slide_size.width_in * 100) + '%';
        lasso.style.top = (top / ir.slide_size.height_in * 100) + '%';
        lasso.style.width = (width / ir.slide_size.width_in * 100) + '%';
        lasso.style.height = (height / ir.slide_size.height_in * 100) + '%';
        pointerState.point = point;
      }
    }

    function rectanglesIntersect(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    function selectionRect(element) {
      return {
        x: Number(element.x),
        y: Number(element.y),
        w: element.type === 'line' ? Math.max(Number(element.w), 0.025) : Number(element.w),
        h: element.type === 'line' ? Math.max(Number(element.h), 0.025) : Number(element.h),
      };
    }

    function finishLasso() {
      if (!pointerState || pointerState.kind !== 'lasso') return;
      var state = pointerState;
      var end = state.point || state.start;
      var box = {
        x: Math.min(state.start.x, end.x),
        y: Math.min(state.start.y, end.y),
        w: Math.abs(end.x - state.start.x),
        h: Math.abs(end.y - state.start.y),
      };
      var ids = activeSlide().elements.filter(function (element) {
        return rectanglesIntersect(selectionRect(element), box);
      }).map(function (element) { return element.id; });
      updateSelection(ids, state.additive);
      pointerState = null;
      lasso.style.display = 'none';
      setStatus(ids.length ? '已圈选 ' + ids.length + ' 个对象。' : '圈选区域内没有对象。');
    }

    function onStagePointerDown(event) {
      if (viewMode === 'presentation') return;
      if (event.button !== 0 || event.target !== slideSurface) return;
      var point = pointerToInches(event);
      pointerState = { kind: 'lasso', start: point, point: point, additive: event.shiftKey || event.ctrlKey || event.metaKey };
      slideSurface.classList.add('lasso-mode');
    }

    function stripQuotes(value) {
      return String(value || '').trim().replace(/^[“"「『]/, '').replace(/[”"」』]$/, '').trim();
    }

    function namedColor(value) {
      var key = String(value || '').trim();
      var colors = { '红色': '#d92d20', '蓝色': '#315b84', '绿色': '#2d9a80', '金色': '#c9a24b', '黑色': '#1d2939', '白色': '#ffffff', '灰色': '#667085', red: 'red', blue: 'blue', green: 'green', black: 'black', white: 'white', gray: 'gray' };
      if (colors[key]) return colors[key];
      if (/^#?[0-9a-f]{3,8}$/i.test(key)) return key.charAt(0) === '#' ? key : '#' + key;
      return key;
    }

    function parseNaturalLanguage(instruction) {
      var text = String(instruction || '').trim();
      if (!text) throw new Error('请输入自然语言修改指令');
      if (!selectedIds.length) throw new Error('请先圈选或选择要修改的对象');
      var reason = text;
      var patches = [];
      var colorMatch = text.match(/(?:颜色|文字颜色|字体颜色)\s*(?:改成|改为|设置为|变成)\s*([#\w一-龥]+)/i);
      var fillMatch = text.match(/(?:填充|背景色|背景)\s*(?:改成|改为|设置为|变成)\s*([#\w一-龥]+)/i);
      var fontMatch = text.match(/(?:字号|字体大小)\s*(?:改成|改为|设置为|变成)\s*(\d+(?:\.\d+)?)/i);
      var moveMatch = text.match(/向\s*(左|右|上|下)\s*(?:移动|挪动)?\s*(\d+(?:\.\d+)?)?\s*(英寸|in|px|像素)?/i);
      var resizeMatch = text.match(/(?:宽度|宽)\s*(?:增加|加大|调整为|改为)\s*(\d+(?:\.\d+)?)\s*(英寸|in)?/i);
      var heightMatch = text.match(/(?:高度|高)\s*(?:增加|加大|调整为|改为)\s*(\d+(?:\.\d+)?)\s*(英寸|in)?/i);
      var scaleMatch = text.match(/放大\s*(\d+(?:\.\d+)?)\s*%/i);

      if (colorMatch) {
        patches.push({ operation: 'set_property', target_ids: selectedIds.slice(), value: { property: 'color', value: namedColor(colorMatch[1]) }, reason: reason, source: 'user', status: 'accepted' });
      } else if (fillMatch) {
        patches.push({ operation: 'set_property', target_ids: selectedIds.slice(), value: { property: 'fill', value: namedColor(fillMatch[1]) }, reason: reason, source: 'user', status: 'accepted' });
      } else if (fontMatch) {
        patches.push({ operation: 'set_property', target_ids: selectedIds.slice(), value: { property: 'fontSize', value: Number(fontMatch[1]) }, reason: reason, source: 'user', status: 'accepted' });
      } else if (moveMatch) {
        var amount = Number(moveMatch[2] || 0.2);
        if ((moveMatch[3] || '').toLowerCase() === 'px' || moveMatch[3] === '像素') amount = amount / 96;
        var direction = moveMatch[1];
        patches.push({ operation: 'move', target_ids: selectedIds.slice(), value: { dx: direction === '左' ? -amount : direction === '右' ? amount : 0, dy: direction === '上' ? -amount : direction === '下' ? amount : 0 }, reason: reason, source: 'user', status: 'accepted' });
      } else if (resizeMatch || heightMatch || scaleMatch) {
        var resizeValue = {};
        if (resizeMatch) resizeValue.w = Number(resizeMatch[1]);
        if (heightMatch) resizeValue.h = Number(heightMatch[1]);
        if (scaleMatch) resizeValue.scale = 1 + Number(scaleMatch[1]) / 100;
        patches.push({ operation: 'resize', target_ids: selectedIds.slice(), value: resizeValue, reason: reason, source: 'user', status: 'accepted' });
      } else {
        var textMatch = text.match(/(?:改成|改为|替换成|设置为|变成)\s*[“"「『]?([\s\S]+?)[”"」』]?$/);
        if (textMatch) {
          patches.push({ operation: 'set_text', target_ids: selectedIds.slice(), value: stripQuotes(textMatch[1]), reason: reason, source: 'user', status: 'accepted' });
        }
      }

      if (!patches.length) return { hostRequest: { instruction: text, selected_ids: selectedIds.slice(), ir: ir } };
      return { patches: patches };
    }

    function applyNaturalLanguage() {
      if (viewMode === 'presentation') return;
      var instruction = nlCommand.value.trim();
      if (!instruction) return;
      try {
        var result = parseNaturalLanguage(instruction);
        if (result.hostRequest) {
          setStatus('该指令交给宿主 AI 生成受控 patch。', true);
          postToHost({ type: 'patrick-ppt-director-edit-request', payload: result.hostRequest });
        } else {
          applyPatches(result.patches, '自然语言修改');
          nlCommand.value = '';
        }
      } catch (error) {
        setStatus(error.message, true);
      }
    }

    function downloadText(filename, text, mime) {
      var blob = new Blob([text], { type: mime || 'application/json;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }

    function saveIR() {
      var base = String((ir.metadata && ir.metadata.title) || 'deck').replace(/[^a-zA-Z0-9_\-一-龥]+/g, '_');
      downloadText(base + '.edited.ir.json', JSON.stringify(ir, null, 2));
      postToHost({ type: 'patrick-ppt-director-ir-saved', payload: { ir: ir, patches: patchLog } });
      setStatus('IR 已下载保存；可据此重新生成 HTML 或 PPTX。');
    }

    function exportPatch() {
      var base = String((ir.metadata && ir.metadata.title) || 'deck').replace(/[^a-zA-Z0-9_\-一-龥]+/g, '_');
      downloadText(base + '.edit-patches.json', JSON.stringify({ schema_version: '0.2', patches: patchLog }, null, 2));
      setStatus('Patch 日志已下载。');
    }

    function applyHostPatch(data) {
      var patches = data && data.patches ? data.patches : (data && data.patch ? [data.patch] : []);
      if (!patches.length) {
        setStatus('宿主没有返回可应用的 patch。', true);
        return;
      }
      try {
        applyPatches(patches, '宿主 AI 修改');
      } catch (error) {
        setStatus('宿主 patch 未通过校验：' + error.message, true);
      }
    }

    slideSurface.addEventListener('pointerdown', onStagePointerDown);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', function () {
      if (pointerState && pointerState.kind === 'lasso') finishLasso();
      else finishPointerMutation();
      slideSurface.classList.remove('lasso-mode');
    });
    document.getElementById('apply-nl').addEventListener('click', applyNaturalLanguage);
    nlCommand.addEventListener('keydown', function (event) { if (event.key === 'Enter') applyNaturalLanguage(); });
    document.getElementById('undo').addEventListener('click', undo);
    document.getElementById('redo').addEventListener('click', redo);
    document.getElementById('save-ir').addEventListener('click', saveIR);
    document.getElementById('export-patch').addEventListener('click', exportPatch);
    // Prevent a pending contenteditable blur from committing just by presenting.
    document.getElementById('enter-presentation').addEventListener('pointerdown', function (event) { event.preventDefault(); });
    document.getElementById('enter-presentation').addEventListener('click', function () { setMode('presentation'); });
    document.getElementById('exit-presentation').addEventListener('click', function () { setMode('editor'); });
    document.getElementById('presentation-prev').addEventListener('click', function () { presentSlide(activeSlideIndex - 1); });
    document.getElementById('presentation-next').addEventListener('click', function () { presentSlide(activeSlideIndex + 1); });
    document.addEventListener('keydown', presentationKeydown);
    window.addEventListener('resize', setStageSize);
    window.addEventListener('message', function (event) {
      if (!messageFromAllowedHost(event)) {
        setStatus('已拒绝未授权宿主来源的 patch。', true);
        return;
      }
      var data = event.data || {};
      if (data.type === 'patrick-ppt-director-apply-patch') applyHostPatch(data.payload || {});
    });

    renderSlideList();
    renderSlide();
    updateHistoryButtons();
    var requestedView = new URLSearchParams(window.location.search).get('view');
    setMode(requestedView === 'presentation' || requestedView === 'editor' ? requestedView : ${serializeForScript(mode)});
    window.PatrickPptDirectorEditor = {
      getMode: function () { return viewMode; },
      setMode: setMode,
      selectSlide: selectSlide,
      getIR: function () { return ir; },
      getSelectedIds: function () { return selectedIds.slice(); },
      applyPatches: applyPatches,
      saveIR: saveIR,
    };
  }());
  </script>
</body>
</html>
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const mode = args.mode === undefined ? 'editor' : args.mode;
  if (mode !== 'editor' && mode !== 'presentation') throw new Error('Unknown mode: ' + String(mode) + '; expected editor or presentation');
  if (args.help || !args.input) {
    printUsage();
    process.exitCode = args.help ? 0 : 2;
    return;
  }
  const input = path.resolve(String(args.input));
  const ir = JSON.parse(fs.readFileSync(input, 'utf8'));
  validateDeckIR(ir);
  if (args.check) {
    console.log('Deck IR is valid for HTML Visual Editor:', input);
    return;
  }
  if (!args.output) {
    printUsage();
    process.exitCode = 2;
    return;
  }
  const output = path.resolve(String(args.output));
  assertSafeOutputs(input, [output]);
  writeNewFile(output, buildHtml(ir, mode));
  console.log('HTML Visual Editor written:', output);
}

try {
  main();
} catch (error) {
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
}
