'use strict';

// Generic Provisional render defaults, not Patrick SSOT. Keep this function
// self-contained: the standalone HTML embeds its source before the renderer.
function resolveChartLayoutDefaults(options, seriesCount) {
  const resolved = JSON.parse(JSON.stringify(options || {}));
  const layoutDefaults = {};
  if (resolved.showValue === true && resolved.valGridLine === undefined) {
    resolved.valGridLine = { style: 'none' };
    layoutDefaults.valGridLine = { style: 'none' };
  }
  // The existing HTML generic palette, in its original order, is shared by
  // both backends. Never cycle a short caller palette or invent random colors.
  const palette = ['4472C4', 'ED7D31', 'A5A5A5', 'FFC000', '5B9BD5', '70AD47'];
  const supplied = resolved.chartColors;
  if (supplied === undefined) {
    if (seriesCount > palette.length) throw new Error('Chart palette exhausted; provide explicit chartColors for every series');
    resolved.chartColors = palette.slice();
    layoutDefaults.chartColors = palette.slice();
  } else if (Array.isArray(supplied) && supplied.length > 0 && supplied.length < seriesCount
      && supplied.every(c => typeof c === 'string' && /^#?[0-9a-f]{6}$/i.test(c))) {
    const used = new Set(supplied.map(c => c.replace(/^#/, '').toUpperCase()));
    for (const color of palette) {
      if (supplied.length >= seriesCount) break;
      if (!used.has(color)) { supplied.push(color); used.add(color); }
    }
    if (supplied.length < seriesCount) throw new Error('Chart palette exhausted; provide explicit chartColors for every series');
    layoutDefaults.chartColors = supplied.slice();
  }
  return { options: resolved, layout_defaults: layoutDefaults };
}

module.exports = { resolveChartLayoutDefaults };
