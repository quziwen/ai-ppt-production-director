#!/usr/bin/env node

/*
 * Generic semantic HTML -> Deck IR adapter for Patrick PPT Director.
 *
 * This adapter deliberately does not infer Patrick style rules. It opens a
 * supplied HTML file in a real browser, extracts visible text/basic CSS
 * geometry, and records unsupported SVG/pseudo-element/asset details as
 * per-deck conversion warnings. The result is a pilot Deck IR, not a claim
 * that arbitrary HTML has become fully native PowerPoint.
 */

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { pathToFileURL, fileURLToPath } = require('node:url');
const { assertSafeOutputs, writeNewFile } = require('./safe_output.cjs');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--check') {
      args.check = true;
      continue;
    }
    if (token === '--help' || token === '-h') {
      args.help = true;
      continue;
    }
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      args[key] = next;
      i += 1;
    } else {
      args[key] = true;
    }
  }
  return args;
}

function usage() {
  console.error([
    'Usage:',
    '  node html_to_deck_ir.cjs --input <source.html> --output <deck-ir.json>',
    '  node html_to_deck_ir.cjs --input <source.html> --check',
    '',
    'Options:',
    '  --node-modules <path>  directory containing playwright',
    '  --browser-path <path>  Chrome/Chromium executable path',
    '  --title <title>        override the Deck IR title',
    '  --width-in <number>    output slide width in inches (default 13.333)',
    '  --height-in <number>   output slide height in inches (default 7.5)',
  ].join('\n'));
}

function loadPlaywright(nodeModulesArg) {
  const candidates = [];
  if (nodeModulesArg) candidates.push(nodeModulesArg);
  if (process.env.PPT_DIRECTOR_NODE_MODULES) candidates.push(process.env.PPT_DIRECTOR_NODE_MODULES);
  candidates.push(path.resolve(__dirname, '..', '..', '..', 'node_modules'));
  candidates.push(path.resolve(process.cwd(), 'node_modules'));

  for (const root of candidates) {
    if (!root) continue;
    const packageDir = path.join(root, 'playwright');
    if (fs.existsSync(packageDir)) return require(packageDir);
  }

  try {
    return require('playwright');
  } catch (error) {
    throw new Error([
      'playwright was not found.',
      'Pass --node-modules <runtime node_modules> or set PPT_DIRECTOR_NODE_MODULES.',
    ].join(' '));
  }
}

function findBrowserPath(args) {
  const candidates = [
    args['browser-path'],
    process.env.PPT_DIRECTOR_BROWSER_PATH,
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/opt/google/chrome/chrome',
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function finiteNumber(value, fallback) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function round(value, digits = 4) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function normalizeLocalAsset(source, inputFile) {
  if (!source) return null;
  if (source.startsWith('data:')) return { data: source };
  if (source.startsWith('file:')) {
    try {
      return { path: fileURLToPath(source) };
    } catch {
      return null;
    }
  }
  if (/^https?:\/\//i.test(source)) return { link: source };
  return { path: path.resolve(path.dirname(inputFile), source) };
}

function normalizeElement(element, inputFile, warnings) {
  if (!element || !element.source_asset) return element;
  const asset = normalizeLocalAsset(element.source_asset, inputFile);
  const output = { ...element };
  delete output.source_asset;
  if (!asset) {
    warnings.push(`${element.id}: asset could not be resolved and was omitted`);
    return null;
  }
  if (asset.data) output.data = asset.data;
  else if (asset.path) {
    if (!fs.existsSync(asset.path)) {
      warnings.push(`${element.id}: local asset does not exist and was omitted: ${asset.path}`);
      return null;
    }
    output.path = asset.path;
  } else if (asset.link) {
    if (element.type === 'image') {
      warnings.push(`${element.id}: remote image is not silently exported; it was omitted as an unresolved media exception`);
      return null;
    }
    output.link = asset.link;
    output.editability = 'media-object';
    warnings.push(`${element.id}: remote asset retained as a media exception; export requires a reachable URL`);
  }
  return output;
}

function validateBasicIR(ir) {
  if (!ir || typeof ir !== 'object') throw new Error('Deck IR must be an object');
  if (!Array.isArray(ir.slides) || ir.slides.length === 0) throw new Error('Deck IR must contain slides[]');
  const ids = new Set();
  for (const slide of ir.slides) {
    if (!slide || typeof slide.id !== 'string' || !slide.id) throw new Error('Every slide needs an id');
    if (ids.has(slide.id)) throw new Error(`Duplicate id: ${slide.id}`);
    ids.add(slide.id);
    if (!Array.isArray(slide.elements)) throw new Error(`Slide ${slide.id} must contain elements[]`);
    for (const element of slide.elements) {
      if (!element || typeof element.id !== 'string' || !element.id) throw new Error(`Slide ${slide.id} contains an element without an id`);
      if (ids.has(element.id)) throw new Error(`Duplicate id: ${element.id}`);
      ids.add(element.id);
      if (!['text', 'shape', 'line', 'table', 'image', 'video'].includes(element.type)) {
        throw new Error(`Unsupported converted element type: ${element.type}`);
      }
      for (const key of ['x', 'y', 'w', 'h']) {
        if (typeof element[key] !== 'number' || !Number.isFinite(element[key])) {
          throw new Error(`${element.id} is missing numeric ${key}`);
        }
      }
    }
  }
  return true;
}

async function extractFromBrowser({ inputFile, args }) {
  const playwright = loadPlaywright(args['node-modules']);
  const browserOptions = { headless: true };
  const browserPath = findBrowserPath(args);
  if (browserPath) browserOptions.executablePath = browserPath;

  const browser = await playwright.chromium.launch(browserOptions);
  try {
    const page = await browser.newPage({
      viewport: { width: 1600, height: 900 },
      deviceScaleFactor: 1,
    });
    await page.goto(pathToFileURL(inputFile).href, { waitUntil: 'networkidle' });
    return await page.evaluate(({ widthIn, heightIn }) => {
      const warnings = [];
      const complexVisuals = [];
      const sourceAssetWarnings = [];
      const slideElements = Array.from(document.querySelectorAll('main.slide, .slide[data-slide-id]'));
      const counters = new Map();

      // The source preview is a single-slide runtime: inactive pages are
      // hidden by design. For extraction, temporarily expose every page at
      // the native 1600 x 900 canvas so each page gets measured independently.
      const stage = document.getElementById('stage');
      if (stage) {
        stage.style.transform = 'none';
        stage.style.left = '0';
        stage.style.top = '0';
      }
      for (const slide of slideElements) {
        slide.style.visibility = 'visible';
        slide.style.pointerEvents = 'auto';
        slide.style.display = 'block';
        slide.style.transform = 'none';
      }

      function textOf(node) {
        if (!node) return '';
        if (node.nodeType === Node.TEXT_NODE) return node.nodeValue || '';
        if (node.nodeType !== Node.ELEMENT_NODE) return '';
        if (node.tagName.toLowerCase() === 'br') return '\n';
        return Array.from(node.childNodes).map(textOf).join('');
      }

      function cleanText(node) {
        return cleanString(textOf(node));
      }

      function cleanString(value) {
        return String(value || '')
          .replace(/\u00a0/g, ' ')
          .split('\n')
          .map((line) => line.replace(/[ \t]+/g, ' ').trim())
          .join('\n')
          .replace(/^\n+|\n+$/g, '')
          .trim();
      }

      function visible(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return style.display !== 'none'
          && style.visibility !== 'hidden'
          && Number.parseFloat(style.opacity || '1') > 0
          && rect.width > 0
          && rect.height > 0;
      }

      function parseColor(value) {
        if (!value || value === 'transparent') return { hex: null, alpha: 0 };
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.fillStyle = value;
        const normalized = context.fillStyle;
        const hex = normalized.match(/^#([0-9a-f]{6})$/i);
        if (hex) return { hex: hex[1].toUpperCase(), alpha: 1 };
        const rgb = normalized.match(/^rgba?\(\s*([0-9.]+)[, ]+\s*([0-9.]+)[, ]+\s*([0-9.]+)(?:[, /]+\s*([0-9.]+%?))?\s*\)$/i);
        if (!rgb) return { hex: null, alpha: 0 };
        const channels = [rgb[1], rgb[2], rgb[3]].map((channel) => Math.max(0, Math.min(255, Math.round(Number(channel)))));
        const alpha = rgb[4] === undefined ? 1 : (rgb[4].endsWith('%') ? Number(rgb[4].slice(0, -1)) / 100 : Number(rgb[4]));
        return {
          hex: channels.map((channel) => channel.toString(16).padStart(2, '0')).join('').toUpperCase(),
          alpha: Number.isFinite(alpha) ? Math.max(0, Math.min(1, alpha)) : 1,
        };
      }

      function parsePx(value) {
        const number = Number.parseFloat(value);
        return Number.isFinite(number) ? number : 0;
      }

      function safeClassName(node) {
        const className = typeof node.className === 'string' ? node.className : (node.getAttribute('class') || '');
        return String(className).split(/\s+/).filter(Boolean).slice(0, 2).join('-');
      }

      function classTokens(node) {
        const className = typeof node.className === 'string' ? node.className : (node.getAttribute('class') || '');
        return String(className).split(/\s+/).filter(Boolean).slice(0, 4);
      }

      function nextId(slideId, node, kind) {
        const token = safeClassName(node) || node.tagName.toLowerCase() || kind;
        const base = `${slideId}-${token.replace(/[^a-zA-Z0-9_-]+/g, '-')}`;
        const count = (counters.get(base) || 0) + 1;
        counters.set(base, count);
        return count === 1 ? base : `${base}-${count}`;
      }

      function rectToInches(node, slideRect) {
        return rectToInchesFromRect(node.getBoundingClientRect(), slideRect);
      }

      function rectToInchesFromRect(rect, slideRect) {
        const px = {
          x: Math.round((rect.left - slideRect.left) * 100) / 100,
          y: Math.round((rect.top - slideRect.top) * 100) / 100,
          w: Math.round(rect.width * 100) / 100,
          h: Math.round(rect.height * 100) / 100,
        };
        const x = (rect.left - slideRect.left) / slideRect.width * widthIn;
        const y = (rect.top - slideRect.top) / slideRect.height * heightIn;
        const w = rect.width / slideRect.width * widthIn;
        const h = rect.height / slideRect.height * heightIn;
        return {
          x: Math.round(x * 10000) / 10000,
          y: Math.round(y * 10000) / 10000,
          w: Math.round(w * 10000) / 10000,
          h: Math.round(h * 10000) / 10000,
          px,
        };
      }

      function directTextParts(node, slideRect, style) {
        const parts = [];
        const parentRect = node.getBoundingClientRect();
        const placeItems = String(style && style.placeItems || '').toLowerCase();
        const centeredX = style && (
          style.textAlign === 'center'
          || style.justifyContent === 'center'
          || placeItems.split(/\s+/)[0] === 'center'
        );
        for (const child of Array.from(node.childNodes)) {
          if (child.nodeType !== Node.TEXT_NODE) continue;
          const text = cleanString(child.nodeValue || '');
          if (!text) continue;
          const range = document.createRange();
          range.selectNodeContents(child);
          const rangeRect = range.getBoundingClientRect();
          const measuredRect = rangeRect.width > 0 && rangeRect.height > 0 ? rangeRect : parentRect;
          const rect = centeredX
            ? { left: parentRect.left, top: measuredRect.top, width: parentRect.width, height: measuredRect.height }
            : measuredRect;
          parts.push({ text, box: rectToInchesFromRect(rect, slideRect) });
        }
        return parts;
      }

      function textStyle(style, textValue, slideRect) {
        const color = parseColor(style.color);
        const sizePx = parsePx(style.fontSize);
        const pxPerIn = slideRect && slideRect.width > 0 ? slideRect.width / widthIn : 96;
        const weight = Number.parseInt(style.fontWeight, 10);
        const fontStack = String(style.fontFamily || 'Arial');
        const hasCjk = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(String(textValue || ''));
        const cjkFallback = fontStack.match(/(?:SimSun|Songti SC|Noto Serif CJK SC|Noto Serif CJK|Source Han Serif SC)/i);
        let align = style.textAlign;
        if (align === 'start') align = 'left';
        if (align === 'end') align = 'right';
        if (!['left', 'center', 'right', 'justify'].includes(align)) align = 'left';
        const placeItems = String(style.placeItems || '').toLowerCase();
        if (style.justifyContent === 'center' || placeItems.split(/\s+/)[0] === 'center') align = 'center';
        if (style.justifyContent === 'flex-end' || style.justifyContent === 'end' || placeItems.split(/\s+/)[0] === 'end') align = 'right';
        let valign = 'mid';
        if (style.alignItems === 'flex-start' || style.verticalAlign === 'top') valign = 'top';
        if (style.alignItems === 'flex-end' || style.verticalAlign === 'bottom') valign = 'bottom';
        if (style.alignItems === 'center' || placeItems.split(/\s+/)[0] === 'center') valign = 'mid';
        return {
          fontFace: hasCjk && cjkFallback
            ? cjkFallback[0]
            : (fontStack.split(',')[0].replace(/["']/g, '').trim() || 'Arial'),
          fontSize: Math.max(1, Math.round(sizePx * 72 / pxPerIn * 100) / 100),
          bold: style.fontWeight === 'bold' || (Number.isFinite(weight) && weight >= 600),
          italic: style.fontStyle === 'italic',
          color: color.hex || '000000',
          align,
          valign,
          breakLine: false,
        };
      }

      function transformAngle(style) {
        const value = style.transform;
        if (!value || value === 'none') return undefined;
        const matrix = value.match(/^matrix\(([^)]+)\)$/);
        if (!matrix) return undefined;
        const parts = matrix[1].split(',').map(Number);
        if (parts.length < 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) return undefined;
        const angle = Math.atan2(parts[1], parts[0]) * 180 / Math.PI;
        return Math.abs(angle) < 0.5 ? undefined : Math.round(angle * 100) / 100;
      }

      function pseudoHasContent(node, pseudo) {
        const content = getComputedStyle(node, pseudo).content;
        return Boolean(content && content !== 'none' && content !== 'normal' && content !== '""');
      }

      function visualInfo(node, style) {
        const background = parseColor(style.backgroundColor);
        const borders = {
          top: { width: parsePx(style.borderTopWidth), color: parseColor(style.borderTopColor || style.borderColor) },
          right: { width: parsePx(style.borderRightWidth), color: parseColor(style.borderRightColor || style.borderColor) },
          bottom: { width: parsePx(style.borderBottomWidth), color: parseColor(style.borderBottomColor || style.borderColor) },
          left: { width: parsePx(style.borderLeftWidth), color: parseColor(style.borderLeftColor || style.borderColor) },
        };
        const borderWidth = Math.max(...Object.values(borders).map((side) => side.width));
        const activeBorders = Object.values(borders).filter((side) => side.width > 0);
        const firstBorder = activeBorders[0];
        const uniformBorder = activeBorders.length === 4
          && activeBorders.every((side) => side.width === firstBorder.width
            && side.color.hex === firstBorder.color.hex
            && side.color.alpha === firstBorder.color.alpha)
          ? firstBorder
          : null;
        const backgroundImage = style.backgroundImage || 'none';
        const hasBasicVisual = background.alpha > 0 || borderWidth > 0;
        const hasComplexVisual = backgroundImage !== 'none'
          || node.tagName.toLowerCase() === 'svg'
          || node.tagName.toLowerCase() === 'canvas'
          || pseudoHasContent(node, '::before')
          || pseudoHasContent(node, '::after');
        return { background, borders, borderWidth, uniformBorder, backgroundImage, hasBasicVisual, hasComplexVisual };
      }

      function selectorFor(slideId, node) {
        const classes = classTokens(node).map((token) => token.replace(/([\\.:[\],#>+~*'"()])/g, '\\$1')).join('.');
        return `[data-slide-id="${slideId}"] ${node.tagName.toLowerCase()}${classes ? `.${classes}` : ''}`;
      }

      function hasVisibleTextChild(node) {
        return Array.from(node.children).some((child) => visible(child) && cleanText(child).length > 0);
      }

      function shapeFrom(node, slideId, slideRect, style, visual) {
        const box = rectToInches(node, slideRect);
        const radiusText = String(style.borderTopLeftRadius || '');
        const radius = parsePx(radiusText);
        const minSidePx = Math.min(node.getBoundingClientRect().width, node.getBoundingClientRect().height);
        const percentageRadius = radiusText.includes('%') && radius >= 45;
        const squarePixelRadius = !radiusText.includes('%') && box.w > 0 && box.h > 0
          && Math.abs(box.w - box.h) < 0.04
          && radius >= minSidePx * 0.45;
        const isCircle = percentageRadius || squarePixelRadius;
        const geometry = isCircle ? 'ellipse' : (radius > 0 ? 'roundRect' : 'rect');
        const shape = {
          type: 'shape',
          id: nextId(slideId, node, 'shape'),
          geometry,
          x: box.x,
          y: box.y,
          w: box.w,
          h: box.h,
          source_selector: selectorFor(slideId, node),
          source_rect_px: box.px,
          source_refs: [`html:${slideId}:${selectorFor(slideId, node)}`],
          evidence_status: 'provisional',
          public_use_status: 'pending',
        };
        if (visual.background.alpha > 0) shape.fill = visual.background.hex;
        if (visual.uniformBorder) {
          shape.line = {
            color: visual.uniformBorder.color.hex || '000000',
            width: Math.max(0.25, Math.round(visual.uniformBorder.width * 72 / (slideRect.width / widthIn) * 100) / 100),
          };
        } else {
          shape.line = 'none';
        }
        const opacity = parsePx(style.opacity || '1');
        if (opacity < 1) shape.transparency = Math.round((1 - opacity) * 100);
        const rotate = transformAngle(style);
        if (rotate !== undefined) shape.rotate = rotate;
        return shape;
      }

      function nextBorderId(slideId, node, side) {
        const token = safeClassName(node) || node.tagName.toLowerCase() || 'element';
        const base = `${slideId}-${token}-border-${side}`;
        const count = (counters.get(base) || 0) + 1;
        counters.set(base, count);
        return count === 1 ? base : `${base}-${count}`;
      }

      function lineFrom(node, slideId, slideRect, visual, side) {
        const box = rectToInches(node, slideRect);
        const sideStyle = visual.borders[side];
        const line = {
          type: 'line',
          id: nextBorderId(slideId, node, side),
          x: box.x,
          y: box.y,
          w: box.w,
          h: box.h,
          line: {
            color: sideStyle.color.hex || '000000',
            width: Math.max(0.25, Math.round(sideStyle.width * 72 / (slideRect.width / widthIn) * 100) / 100),
          },
          source_selector: selectorFor(slideId, node),
          source_rect_px: box.px,
          source_refs: [`html:${slideId}:${selectorFor(slideId, node)}`],
          evidence_status: 'provisional',
          public_use_status: 'pending',
        };
        if (side === 'top') {
          line.h = 0;
        } else if (side === 'right') {
          line.x = box.x + box.w;
          line.w = 0;
        } else if (side === 'bottom') {
          line.y = box.y + box.h;
          line.h = 0;
        } else if (side === 'left') {
          line.w = 0;
        }
        return line;
      }

      function textFrom(node, slideId, slideRect, style, textOverride, boxOverride) {
        const box = boxOverride || rectToInches(node, slideRect);
        return {
          type: 'text',
          id: nextId(slideId, node, 'text'),
          text: textOverride === undefined ? cleanText(node) : textOverride,
          x: box.x,
          y: box.y,
          w: box.w,
          h: box.h,
          style: textStyle(style, textOverride === undefined ? cleanText(node) : textOverride, slideRect),
          source_selector: selectorFor(slideId, node),
          source_rect_px: box.px,
          source_refs: [`html:${slideId}:${selectorFor(slideId, node)}`],
          evidence_status: 'provisional',
          public_use_status: 'pending',
        };
      }

      function tableFrom(node, slideId, slideRect, style) {
        const box = rectToInches(node, slideRect);
        const rows = Array.from(node.rows || []).map((row) => Array.from(row.cells || []).map((cell) => cleanText(cell)));
        return {
          type: 'table',
          id: nextId(slideId, node, 'table'),
          x: box.x,
          y: box.y,
          w: box.w,
          h: box.h,
          rows,
          options: {
            fontFace: textStyle(style, undefined, slideRect).fontFace,
            fontSize: textStyle(style, undefined, slideRect).fontSize,
            color: textStyle(style, undefined, slideRect).color,
          },
          source_selector: selectorFor(slideId, node),
          source_rect_px: box.px,
          source_refs: [`html:${slideId}:${selectorFor(slideId, node)}`],
          evidence_status: 'provisional',
          public_use_status: 'pending',
        };
      }

      function mediaFrom(node, slideId, slideRect) {
        const box = rectToInches(node, slideRect);
        const source = node.currentSrc || node.src || node.getAttribute('src') || '';
        const type = node.tagName.toLowerCase() === 'video' ? 'video' : 'image';
        return {
          type,
          id: nextId(slideId, node, type),
          x: box.x,
          y: box.y,
          w: box.w,
          h: box.h,
          source_asset: source,
          editability: 'media-object',
          source_selector: selectorFor(slideId, node),
          source_rect_px: box.px,
          source_refs: [`html:${slideId}:${selectorFor(slideId, node)}`],
          evidence_status: 'provisional',
          public_use_status: 'pending',
        };
      }

      function walk(node, slideId, slideRect, output, visitedVisualKeys) {
        if (!visible(node)) return;
        const tag = node.tagName.toLowerCase();
        if (tag === 'svg' || tag === 'canvas') {
          const box = rectToInches(node, slideRect);
          complexVisuals.push({
            slide_id: slideId,
            selector: selectorFor(slideId, node),
            reason: tag,
            rect: box,
          });
          return;
        }
        if (tag === 'img' || tag === 'video') {
          const media = mediaFrom(node, slideId, slideRect);
          if (media.source_asset) output.push(media);
          else sourceAssetWarnings.push(`${media.id}: missing src`);
          return;
        }
        if (tag === 'table') {
          const style = getComputedStyle(node);
          const table = tableFrom(node, slideId, slideRect, style);
          if (table.rows.length > 0) output.push(table);
          return;
        }

        const style = getComputedStyle(node);
        const visual = visualInfo(node, style);
        const box = rectToInches(node, slideRect);
        if (visual.hasComplexVisual) {
          complexVisuals.push({
            slide_id: slideId,
            selector: selectorFor(slideId, node),
            reason: [
              visual.backgroundImage !== 'none' ? `background-image:${visual.backgroundImage.slice(0, 80)}` : '',
              pseudoHasContent(node, '::before') ? '::before' : '',
              pseudoHasContent(node, '::after') ? '::after' : '',
            ].filter(Boolean).join(', ') || 'complex-css',
            rect: box,
          });
        }
        if (visual.hasBasicVisual && (box.w > 0.01 && box.h > 0.01)) {
          const key = [
            box.x,
            box.y,
            box.w,
            box.h,
            visual.background.hex,
            visual.borderWidth,
            ...['top', 'right', 'bottom', 'left'].flatMap((side) => [visual.borders[side].width, visual.borders[side].color.hex]),
          ].join('|');
          if (!visitedVisualKeys.has(key)) {
            if (visual.background.alpha > 0 || visual.uniformBorder) {
              output.push(shapeFrom(node, slideId, slideRect, style, visual));
            }
            if (!visual.uniformBorder) {
              for (const side of ['top', 'right', 'bottom', 'left']) {
                if (visual.borders[side].width > 0) output.push(lineFrom(node, slideId, slideRect, visual, side));
              }
            }
            visitedVisualKeys.add(key);
          }
        }
        const text = cleanText(node);
        const directParts = hasVisibleTextChild(node) ? directTextParts(node, slideRect, style) : [];
        for (const part of directParts) {
          output.push(textFrom(node, slideId, slideRect, style, part.text, part.box));
        }
        if (text && !hasVisibleTextChild(node)) {
          output.push(textFrom(node, slideId, slideRect, style));
          return;
        }
        for (const child of Array.from(node.children)) walk(child, slideId, slideRect, output, visitedVisualKeys);
      }

      const slides = slideElements.map((slide, index) => {
        const slideId = slide.getAttribute('data-slide-id') || slide.id || `slide-${index + 1}`;
        const slideRect = slide.getBoundingClientRect();
        const slideStyle = getComputedStyle(slide);
        const background = parseColor(slideStyle.backgroundColor);
        const elements = [];
        const visitedVisualKeys = new Set();
        for (const child of Array.from(slide.children)) walk(child, slideId, slideRect, elements, visitedVisualKeys);
        const evidence = slide.getAttribute('data-evidence') || '';
        return {
          id: slideId,
          background: background.hex || 'FFFFFF',
          elements,
          notes: evidence ? `Source evidence note: ${evidence}` : '',
          source_refs: [`html:${slideId}`],
          evidence_status: 'provisional',
          public_use_status: 'pending',
          source_rect_px: { width: slideRect.width, height: slideRect.height },
        };
      });

      if (slideElements.length === 0) warnings.push('No .slide or [data-slide-id] slide elements were found');
      warnings.push(...sourceAssetWarnings);
      return {
        title: document.title || 'HTML Deck',
        slides,
        complexVisuals,
        warnings,
        viewport: { width: 1600, height: 900 },
      };
    }, {
      widthIn: finiteNumber(Number(args['width-in']), 13.333),
      heightIn: finiteNumber(Number(args['height-in']), 7.5),
    });
  } finally {
    await browser.close();
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input || args.help) {
    usage();
    process.exitCode = 2;
    return;
  }

  const inputFile = path.resolve(args.input);
  if (!args.check && args.output) assertSafeOutputs(inputFile, [path.resolve(args.output)]);
  if (!fs.existsSync(inputFile)) throw new Error(`Input HTML does not exist: ${inputFile}`);
  const widthIn = finiteNumber(Number(args['width-in']), 13.333);
  const heightIn = finiteNumber(Number(args['height-in']), 7.5);
  if (!(widthIn > 0 && heightIn > 0)) throw new Error('Slide dimensions must be positive');

  const extracted = await extractFromBrowser({ inputFile, args });
  const warnings = [...extracted.warnings];
  const normalizedSlides = extracted.slides.map((slide) => ({
    ...slide,
    evidence_register_refs: Array.isArray(slide.evidence_register_refs) ? slide.evidence_register_refs : [],
    elements: slide.elements
      .map((element) => normalizeElement(element, inputFile, warnings))
      .filter(Boolean),
  }));
  const sourceHash = crypto.createHash('sha256').update(fs.readFileSync(inputFile)).digest('hex').toUpperCase();
  const title = args.title || extracted.title.replace(/\s*[·|].*$/, '').trim() || 'HTML Deck';
  const elementCounts = {};
  for (const slide of normalizedSlides) {
    for (const element of slide.elements) elementCounts[element.type] = (elementCounts[element.type] || 0) + 1;
  }
  const ir = {
    schema_version: '0.2',
    metadata: {
      title,
      author: 'Patrick Qu',
      subject: title,
      language: 'zh-CN',
      source_html: inputFile,
      source_sha256: sourceHash,
      conversion: {
        adapter: 'html_to_deck_ir.cjs',
        status: 'pilot-candidate',
        style_status: 'Provisional',
        evidence_status: 'provisional',
        evidence_register_required: true,
        browser_viewport: extracted.viewport,
        detected_slides: normalizedSlides.length,
        element_counts: elementCounts,
        complex_visual_exceptions: extracted.complexVisuals,
        warnings,
      },
    },
    delivery: {
      intent: 'presentation-ready',
      expected_review_rounds: 'unknown',
      evidence_fidelity: 'preserve-source',
      visual_failure_veto: true,
      status: 'provisional',
    },
    slide_size: { width_in: widthIn, height_in: heightIn },
    route: {
      carrier: 'Native / Hybrid PPTX',
      editability_target: 'E2',
      allowed_media_exceptions: ['image', 'video', 'complex-visual'],
      status: 'candidate',
    },
    editor: {
      html_mode: 'visual-editor',
      selection: 'click-and-lasso',
      nl_editing: 'patch-to-ir',
      save_target: 'deck-ir',
      source_adapter: 'semantic-html-extraction',
    },
    slides: normalizedSlides,
  };
  validateBasicIR(ir);

  if (args.check) {
    console.log(JSON.stringify({
      status: 'valid',
      input: inputFile,
      slides: ir.slides.length,
      elements: elementCounts,
      complex_visual_exceptions: extracted.complexVisuals.length,
      warnings: warnings.length,
    }));
    return;
  }

  if (!args.output) {
    usage();
    process.exitCode = 2;
    return;
  }
  const outputFile = path.resolve(args.output);
  writeNewFile(outputFile, `${JSON.stringify(ir, null, 2)}\n`);
  console.log(JSON.stringify({
    status: 'written',
    output: outputFile,
    slides: ir.slides.length,
    elements: elementCounts,
    complex_visual_exceptions: extracted.complexVisuals.length,
    warnings: warnings.length,
  }));
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exitCode = 1;
});
