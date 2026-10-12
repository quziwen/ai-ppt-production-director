'use strict';

// Generic transport invariants, not style rules. The geometry/origin functions
// are also embedded verbatim in the standalone editor to avoid divergent checks.
function validateGeometry(element, size) {
  for (const key of ['x', 'y', 'w', 'h']) {
    if (typeof element[key] !== 'number' || !Number.isFinite(element[key])) {
      throw new Error(element.id + ' must contain finite numeric ' + key);
    }
    if (element[key] < 0) throw new Error(element.id + ' geometry cannot be negative');
  }
  // Conversion rounds to four decimals. This is an arithmetic tolerance only.
  if (element.x + element.w > size.width_in + 0.0001 || element.y + element.h > size.height_in + 0.0001) {
    throw new Error(element.id + ' is outside the slide canvas');
  }
}

function normalizeAllowedOrigins(values) {
  if (!Array.isArray(values)) return [];
  const origins = [];
  for (const value of values) {
    if (typeof value !== 'string') continue;
    const candidate = value.trim();
    // URL alone is too permissive: paths, credentials, backslashes and opaque
    // origins are not an origin allowlist. Never pass a wildcard to postMessage.
    if (candidate.includes('*') || !/^https?:\/\/[^/?#\\\s]+\/?$/i.test(candidate)) continue;
    try {
      const url = new URL(candidate);
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.origin === 'null' || url.origin.includes('*')) continue;
      if (!origins.includes(url.origin)) origins.push(url.origin);
    } catch { /* Invalid entries are fail-closed, not a standalone-editor error. */ }
  }
  return origins;
}

function validateDeckIR(ir, { backend = 'html' } = {}) {
  const requireThat = (condition, message) => { if (!condition) throw new Error(message); };
  requireThat(ir && typeof ir === 'object' && !Array.isArray(ir), 'Deck IR must be an object');
  requireThat(ir.schema_version === '0.2', 'Deck IR schema_version must be supported version 0.2; migrate explicitly');
  const size = ir.slide_size;
  requireThat(size && ['width_in', 'height_in'].every(k => typeof size[k] === 'number' && Number.isFinite(size[k]) && size[k] > 0), 'Deck IR slide_size must contain positive finite width_in and height_in');
  requireThat(Array.isArray(ir.slides) && ir.slides.length > 0, 'Deck IR must contain at least one slide');
  const allowed = new Set(['text', 'shape', 'line', 'table', 'chart', 'image', 'video']);
  if (backend === 'pptx') allowed.add('audio');
  const ids = new Set();
  function identity(object) {
    requireThat(object && typeof object.id === 'string' && object.id.trim().length > 0, 'Every slide/element needs a non-empty id');
    requireThat(!ids.has(object.id), 'Duplicate slide or object id: ' + object.id);
    ids.add(object.id);
  }
  for (const slide of ir.slides) {
    identity(slide);
    requireThat(Array.isArray(slide.elements), 'Slide ' + slide.id + ' must contain elements[]');
    for (const element of slide.elements) {
      identity(element);
      requireThat(allowed.has(element.type), 'Unsupported Deck IR element type: ' + element.type);
      validateGeometry(element, size);
      if (element.type === 'table') {
        requireThat(Array.isArray(element.rows) && element.rows.every(Array.isArray), element.id + ' table must contain rows as arrays');
      }
      if (element.type === 'chart') requireThat(Array.isArray(element.series), element.id + ' chart must contain series[]');
      // Backend options must not secretly override the validated geometry.
      for (const options of [element.style, element.text_style, element.options]) {
        if (!options || typeof options !== 'object') continue;
        for (const key of ['x', 'y', 'w', 'h']) {
          requireThat(options[key] === undefined || options[key] === element[key], element.id + ' duplicate geometry in options must match ' + key);
        }
      }
    }
  }
  return true;
}

module.exports = { validateDeckIR, validateGeometry, normalizeAllowedOrigins };
