#!/usr/bin/env node

/*
 * Minimal Native / Hybrid PPTX exporter for Deck IR v0.2.
 *
 * This file contains generic object mapping only. It must not contain
 * Patrick-specific style rules. Visual and content decisions belong in the
 * per-deck Deck IR after the current SSOT and Deck Brief have been read.
 */

const fs = require('node:fs');
const path = require('node:path');
const { validateDeckIR } = require('./deck_ir_validation.cjs');
const { assertSafeOutputs, writeNewFile } = require('./safe_output.cjs');
const { resolveChartLayoutDefaults } = require('./chart_layout_defaults.cjs');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
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

function printUsage() {
  console.error('Usage: native_pptx_export.cjs --input <deck-ir.json> --output <deck.pptx> [--report <report.json>] [--node-modules <path>]');
}

function loadPptxGenJS(nodeModulesArg) {
  const candidates = [];
  if (nodeModulesArg) candidates.push(nodeModulesArg);
  if (process.env.PPT_DIRECTOR_NODE_MODULES) candidates.push(process.env.PPT_DIRECTOR_NODE_MODULES);
  candidates.push(path.resolve(__dirname, '..', '..', '..', 'node_modules'));
  candidates.push(path.resolve(process.cwd(), 'node_modules'));

  for (const root of candidates) {
    if (!root) continue;
    const packageDir = path.join(root, 'pptxgenjs');
    if (fs.existsSync(packageDir)) return require(packageDir);
  }

  throw new Error([
    'pptxgenjs was not found.',
    'Pass --node-modules <runtime node_modules> or set PPT_DIRECTOR_NODE_MODULES.',
  ].join(' '));
}

function color(value) {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'object') return value;
  return String(value).replace(/^#/, '');
}

function fill(value) {
  if (value === undefined || value === null || value === 'none') return undefined;
  if (typeof value === 'object') return value;
  return { color: color(value) };
}

function line(value) {
  if (value === undefined || value === null || value === 'none') {
    return { color: 'FFFFFF', transparency: 100, width: 0 };
  }
  if (typeof value === 'string') return { color: color(value), width: 1 };
  const out = { ...value };
  if (out.color !== undefined) out.color = color(out.color);
  if (out.fill !== undefined && out.color === undefined) out.color = color(out.fill);
  delete out.fill;
  return out;
}

function position(element) {
  for (const key of ['x', 'y', 'w', 'h']) {
    if (typeof element[key] !== 'number') {
      throw new Error(`Element ${element.id || '<unnamed>'} is missing numeric ${key}.`);
    }
  }
  return { x: element.x, y: element.y, w: element.w, h: element.h };
}

function textOptions(element, defaults = {}) {
  const source = { ...(element.style || element.text_style || {}), ...defaults };
  const out = { ...source };
  if (out.fontFamily !== undefined && out.fontFace === undefined) out.fontFace = out.fontFamily;
  if (out.alignment !== undefined && out.align === undefined) out.align = out.alignment;
  if (out.verticalAlignment !== undefined && out.valign === undefined) out.valign = out.verticalAlignment;
  if (out.color !== undefined) out.color = color(out.color);
  if (out.fill !== undefined) out.fill = fill(out.fill);
  delete out.fontFamily;
  delete out.alignment;
  delete out.verticalAlignment;
  return out;
}

function shapeName(pptx, geometry) {
  if (!geometry) throw new Error('Shape element is missing geometry.');
  return pptx.ShapeType[geometry] || geometry;
}

function resolveAsset(inputPath, inputFile) {
  if (!inputPath) return inputPath;
  if (path.isAbsolute(inputPath)) return inputPath;
  return path.resolve(path.dirname(inputFile), inputPath);
}

function evidenceMetadata(element) {
  const metadata = {};
  if (Array.isArray(element.source_refs)) metadata.source_refs = element.source_refs;
  if (element.evidence_status !== undefined) metadata.evidence_status = element.evidence_status;
  if (element.evidence !== undefined) metadata.evidence = element.evidence;
  return metadata;
}

function addElement({ pptx, slide, element, inputFile, reportSlide }) {
  const id = element.id || `${element.type}-${reportSlide.objects.length + 1}`;
  const pos = position(element);

  if (element.type === 'text') {
    slide.addText(String(element.text ?? ''), {
      ...pos,
      objectName: id,
      margin: 0,
      fontFace: 'Arial',
      fontSize: 16,
      color: '000000',
      fit: 'shrink',
      ...textOptions(element),
    });
    reportSlide.objects.push({ id, type: 'text', representation: 'native-text', editability: 'native-editable', ...evidenceMetadata(element) });
    return;
  }

  if (element.type === 'shape' || element.type === 'line') {
    const geometry = element.type === 'line' ? 'line' : element.geometry;
    slide.addShape(shapeName(pptx, geometry), {
      ...pos,
      objectName: id,
      ...(element.fill !== undefined ? { fill: fill(element.fill) } : {}),
      line: line(element.line),
      ...(element.rotate !== undefined ? { rotate: element.rotate } : {}),
      ...(element.transparency !== undefined ? { transparency: element.transparency } : {}),
    });
    reportSlide.objects.push({ id, type: element.type, representation: 'native-shape', editability: 'native-editable', ...evidenceMetadata(element) });
    if (element.text !== undefined) {
      const textId = `${id}-text`;
      slide.addText(String(element.text), {
        ...pos,
        objectName: textId,
        margin: element.text_margin ?? 0.08,
        fontFace: 'Arial',
        fontSize: 16,
        color: '000000',
        fit: 'shrink',
        valign: 'mid',
        align: 'center',
        ...textOptions({ text_style: element.text_style || {} }),
      });
      reportSlide.objects.push({ id: textId, type: 'text', representation: 'native-text', editability: 'native-editable', parent: id, ...evidenceMetadata(element) });
    }
    return;
  }

  if (element.type === 'table') {
    if (!Array.isArray(element.rows)) throw new Error(`Table ${id} is missing rows.`);
    slide.addTable(element.rows, {
      ...pos,
      objectName: id,
      fontFace: 'Arial',
      fontSize: 12,
      color: '000000',
      margin: 0.08,
      ...(element.options || {}),
    });
    reportSlide.objects.push({ id, type: 'table', representation: 'native-table', editability: 'native-editable', ...evidenceMetadata(element) });
    return;
  }

  if (element.type === 'chart') {
    if (!Array.isArray(element.series)) throw new Error(`Chart ${id} is missing series.`);
    const chartType = element.chart_type || element.chartType || 'bar';
    const { options: chartOptions, layout_defaults: layoutDefaults } = resolveChartLayoutDefaults(element.options, element.series.length);
    // Office's nextTo default places category names on the zero axis, over
    // negative horizontal bars. Keep explicit choices; move only an omitted
    // label position outside the plot, without changing source IR or data.
    if (chartType === 'bar' && chartOptions.barDir === 'bar'
        && chartOptions.catAxisLabelPos === undefined
        && element.series.some(s => Array.isArray(s.values) && s.values.some(v => typeof v === 'number' && v < 0))) {
      chartOptions.catAxisLabelPos = 'low';
      layoutDefaults.catAxisLabelPos = 'low';
    }
    slide.addChart(chartType, JSON.parse(JSON.stringify(element.series)), {
      ...pos,
      objectName: id,
      ...chartOptions,
    });
    reportSlide.objects.push({ id, type: 'chart', representation: 'native-chart', editability: 'native-editable-pending-roundtrip', layout_defaults: layoutDefaults, ...evidenceMetadata(element) });
    return;
  }

  if (element.type === 'image') {
    const asset = resolveAsset(element.path, inputFile);
    if (!asset && !element.data) throw new Error(`Image ${id} needs path or data.`);
    slide.addImage({
      ...pos,
      objectName: id,
      ...(asset ? { path: asset } : { data: element.data }),
    });
    reportSlide.objects.push({ id, type: 'image', representation: 'media-object', editability: 'media-object', ...evidenceMetadata(element) });
    return;
  }

  if (element.type === 'video' || element.type === 'audio') {
    const asset = resolveAsset(element.path, inputFile);
    if (!asset && !element.link) throw new Error(`${element.type} ${id} needs path or link.`);
    slide.addMedia({
      ...pos,
      objectName: id,
      type: element.type,
      ...(asset ? { path: asset } : { link: element.link }),
      ...(element.cover ? { cover: resolveAsset(element.cover, inputFile) } : {}),
    });
    reportSlide.objects.push({ id, type: element.type, representation: 'media-object', editability: 'media-object', ...evidenceMetadata(element) });
    return;
  }

  throw new Error(`Unsupported Deck IR element type: ${element.type}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input || !args.output || args.help) {
    printUsage();
    process.exitCode = 2;
    return;
  }

  const inputFile = path.resolve(args.input);
  const outputFile = path.resolve(args.output);
  const reportFile = path.resolve(args.report || (/\.pptx$/i.test(outputFile)
    ? outputFile.replace(/\.pptx$/i, '.editability.ir.json')
    : outputFile + '.editability.ir.json'));
  assertSafeOutputs(inputFile, [outputFile, reportFile]);
  const ir = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  validateDeckIR(ir, { backend: 'pptx' });

  const PptxGenJS = loadPptxGenJS(args['node-modules']);
  const pptx = new PptxGenJS();
  const size = ir.slide_size || {};
  if (typeof size.width_in === 'number' && typeof size.height_in === 'number') {
    const layoutName = 'PPT_DIRECTOR_CUSTOM';
    pptx.defineLayout({ name: layoutName, width: size.width_in, height: size.height_in });
    pptx.layout = layoutName;
  } else {
    pptx.layout = 'LAYOUT_WIDE';
  }
  pptx.author = ir.metadata?.author || 'Patrick PPT Director';
  pptx.company = ir.metadata?.company || 'Local';
  pptx.subject = ir.metadata?.subject || 'Native / Hybrid presentation';
  pptx.title = ir.metadata?.title || 'Native / Hybrid presentation';
  if (ir.metadata?.lang) pptx.lang = ir.metadata.lang;

  const report = {
    schema_version: '0.2',
    delivery: ir.delivery || {
      intent: 'presentation-ready',
      expected_review_rounds: 'unknown',
      evidence_fidelity: 'preserve-source',
      visual_failure_veto: true,
      status: 'provisional',
    },
    route: ir.route || { carrier: 'Native PPTX', editability_target: 'E1' },
    input: inputFile,
    output: outputFile,
    status: 'building',
    slides: [],
    totals: { text: 0, shape: 0, line: 0, table: 0, chart: 0, image: 0, video: 0, audio: 0, native: 0, media: 0 },
  };

  for (const slideDef of ir.slides) {
    const slide = pptx.addSlide();
    if (slideDef.background) slide.background = { color: color(slideDef.background) };
    const reportSlide = {
      id: slideDef.id || `slide-${report.slides.length + 1}`,
      evidence_register_refs: slideDef.evidence_register_refs || [],
      objects: [],
      notes: Boolean(slideDef.notes),
    };
    for (const element of slideDef.elements || []) {
      addElement({ pptx, slide, element, inputFile, reportSlide });
    }
    if (slideDef.notes) slide.addNotes(String(slideDef.notes));
    report.slides.push(reportSlide);
  }

  for (const slide of report.slides) {
    for (const object of slide.objects) {
      if (report.totals[object.type] !== undefined) report.totals[object.type] += 1;
      if (object.editability === 'media-object') report.totals.media += 1;
      else report.totals.native += 1;
    }
  }

  const bytes = await pptx.write({ outputType: 'nodebuffer' });
  writeNewFile(outputFile, bytes);
  report.status = 'exported';
  report.report = reportFile;
  writeNewFile(reportFile, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ status: report.status, output: outputFile, report: reportFile, totals: report.totals }));
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exitCode = 1;
});
