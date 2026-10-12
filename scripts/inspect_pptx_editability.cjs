#!/usr/bin/env node

/* Package-level structural inspection for Native / Hybrid PPTX output. */

const fs = require('node:fs');
const path = require('node:path');
const { assertSafeOutputs, writeNewFile } = require('./safe_output.cjs');

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

function usage() {
  console.error('Usage: inspect_pptx_editability.cjs --input <deck.pptx> [--output <report.json>] [--node-modules <path>]');
}

function loadJsZip(nodeModulesArg) {
  const candidates = [];
  if (nodeModulesArg) candidates.push(nodeModulesArg);
  if (process.env.PPT_DIRECTOR_NODE_MODULES) candidates.push(process.env.PPT_DIRECTOR_NODE_MODULES);
  candidates.push(path.resolve(__dirname, '..', '..', '..', 'node_modules'));
  candidates.push(path.resolve(process.cwd(), 'node_modules'));
  for (const root of candidates) {
    if (!root) continue;
    const packageDir = path.join(root, 'jszip');
    if (fs.existsSync(packageDir)) return require(packageDir);
  }
  throw new Error('jszip was not found. Pass --node-modules <runtime node_modules>.');
}

function matches(text, expression) {
  return (text.match(expression) || []).length;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input || args.help) {
    usage();
    process.exitCode = 2;
    return;
  }
  const input = path.resolve(args.input);
  const reportPath = args.output ? path.resolve(args.output) : `${input}.editability.package.json`;
  assertSafeOutputs(input, [reportPath]);
  const JSZip = loadJsZip(args['node-modules']);
  const zip = await JSZip.loadAsync(fs.readFileSync(input));
  const names = Object.keys(zip.files).filter((name) => !zip.files[name].dir);
  const slideNames = names.filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name));
  const noteNames = names.filter((name) => /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(name));
  const chartNames = names.filter((name) => /(^ppt\/charts\/chart\d+\.xml$|^ppt\/slides\/charts\/chart\d+\.xml$)/.test(name));
  const mediaNames = names.filter((name) => /^ppt\/media\//.test(name));
  const workbookNames = names.filter((name) => /^ppt\/embeddings\/.*\.(xlsx|xlsm)$/i.test(name));
  const slideRecords = [];
  let textRuns = 0;
  let nativeShapes = 0;
  let pictures = 0;
  let graphicFrames = 0;
  let tableFrames = 0;
  let chartRelationships = 0;

  for (const name of slideNames) {
    const xml = await zip.files[name].async('text');
    const relName = name.replace(/^ppt\/slides\/(slide\d+)\.xml$/, 'ppt/slides/_rels/$1.xml.rels');
    const relXml = zip.files[relName] ? await zip.files[relName].async('text') : '';
    const slide = {
      name,
      text_runs: matches(xml, /<a:t(?:\s|>)/g),
      native_shapes: matches(xml, /<p:sp(?:\s|>)/g),
      pictures: matches(xml, /<p:pic(?:\s|>)/g),
      graphic_frames: matches(xml, /<p:graphicFrame(?:\s|>)/g),
      table_frames: matches(xml, /drawingml\/2006\/table/g),
      chart_relationships: matches(relXml, /relationships\/chart/g),
    };
    textRuns += slide.text_runs;
    nativeShapes += slide.native_shapes;
    pictures += slide.pictures;
    graphicFrames += slide.graphic_frames;
    tableFrames += slide.table_frames;
    chartRelationships += slide.chart_relationships;
    slideRecords.push(slide);
  }

  const report = {
    schema_version: '0.2',
    input,
    package: {
      slides: slideNames.length,
      notes: noteNames.length,
      media_files: mediaNames.length,
      chart_xml: chartNames.length,
      embedded_workbooks: workbookNames.length,
    },
    objects: {
      text_runs: textRuns,
      native_shapes: nativeShapes,
      pictures,
      graphic_frames: graphicFrames,
      table_frames: tableFrames,
      chart_relationships: chartRelationships,
    },
    slides_detail: slideRecords,
    interpretation: {
      native_text_present: textRuns > 0,
      native_shape_present: nativeShapes > 0,
      native_table_present: tableFrames > 0,
      native_chart_present: chartNames.length > 0 || chartRelationships > 0,
      notes_present: noteNames.length > 0,
      picture_objects_present: pictures > 0,
      package_structurally_inspected: true,
      power_point_edit_save_reopen: 'not-tested-by-this-inspector',
    },
  };

  writeNewFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ status: 'inspected', report: reportPath, package: report.package, objects: report.objects }));
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exitCode = 1;
});
