'use strict';
const fs = require('node:fs');
const path = require('node:path');

function canonicalPath(filename) {
  let current = path.resolve(filename);
  const suffix = [];
  while (!fs.existsSync(current)) {
    const parent = path.dirname(current);
    if (parent === current) break;
    suffix.unshift(path.basename(current));
    current = parent;
  }
  const real = fs.existsSync(current) ? fs.realpathSync.native(current) : current;
  const resolved = path.join(real, ...suffix);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

function assertSafeOutputs(input, outputs) {
  const paths = [input, ...outputs];
  const canonical = paths.map(canonicalPath);
  const stats = paths.map(p => fs.existsSync(p) ? fs.statSync(p, { bigint: true }) : null);
  for (let i = 0; i < paths.length; i += 1) {
    for (let j = i + 1; j < paths.length; j += 1) {
      const sameFile = stats[i] && stats[j] && stats[i].ino !== 0n && stats[i].dev === stats[j].dev && stats[i].ino === stats[j].ino;
      if (canonical[i] === canonical[j] || sameFile) {
        throw new Error('Input/output/report path collision: ' + paths[i] + ' <-> ' + paths[j]);
      }
    }
  }
  for (const output of outputs) {
    // lstat also detects a dangling symlink: it is not an unused destination.
    try {
      fs.lstatSync(output);
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    throw new Error('Output already exists; choose a new versioned path: ' + output);
  }
}

function writeNewFile(filename, data) {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  // Exclusive create also rejects an output created after the preflight check.
  fs.writeFileSync(filename, data, { encoding: 'utf8', flag: 'wx' });
}

module.exports = { assertSafeOutputs, writeNewFile };
