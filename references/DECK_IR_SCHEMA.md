# Deck IR Schema

> Version: 0.2
>
> Status: minimal production schema / evidence and handoff pilot

The Deck IR is a per-deck production representation. It is not Patrick's style SSOT, and it must not be used to promote one deck's visual decisions into permanent rules.

## 1. Purpose

The same semantic slide model can feed:

- an HTML preview or visual editor;
- a Native or Hybrid PPTX exporter;
- object-level editability and provenance QA.

The HTML renderer must not be used as a screenshot source for a Native PPTX route.

## 2. Top-level shape

```json
{
  "schema_version": "0.2",
  "metadata": {
    "title": "Deck title",
    "author": "Deck author",
    "subject": "Deck subject"
  },
  "delivery": {
    "intent": "editable-working-deck",
    "expected_review_rounds": "2-3",
    "evidence_fidelity": "preserve-source",
    "visual_failure_veto": true
  },
  "slide_size": {
    "width_in": 13.333,
    "height_in": 7.5
  },
  "route": {
    "carrier": "Native PPTX",
    "editability_target": "E2",
    "allowed_media_exceptions": ["image", "video", "complex-visual"]
  },
  "editor": {
    "html_mode": "visual-editor",
    "selection": "click-and-lasso",
    "nl_editing": "patch-to-ir",
    "save_target": "deck-ir",
    "allowed_origins": ["https://trusted-host.example"]
  },
  "slides": [
    {
      "id": "P20",
      "background": "F8F3E8",
      "evidence_register_refs": [],
      "elements": [],
      "notes": "Speaker notes"
    }
  ]
}
```

All coordinates are inches. All object IDs are stable within the Deck IR and must be retained in the object-level Editability Report, even if an exporter uses a different internal object name.

`delivery` records this deck's operational intent; it is not a style authority. `visual_failure_veto: true` means a material visual failure blocks delivery unless a current explicit exception is recorded. `evidence_fidelity` applies to data-bearing content and may be overridden only in the Deck Brief with a reason.

## 3. Element types

### Text

```json
{
  "type": "text",
  "id": "P20-title",
  "text": "A conclusion title",
  "x": 0.97,
  "y": 1.07,
  "w": 11.0,
  "h": 0.52,
  "style": {
    "fontFace": "Georgia",
    "fontSize": 25,
    "bold": true,
    "color": "203B61",
    "align": "left",
    "valign": "mid"
  }
}
```

### Shape

```json
{
  "type": "shape",
  "id": "P20-shared-foundation",
  "geometry": "roundRect",
  "x": 4.85,
  "y": 2.85,
  "w": 3.15,
  "h": 1.65,
  "fill": "E9F7F4",
  "line": { "color": "2D9A80", "width": 1 },
  "text": "共享底座\n数据 · 知识 · 规则\n权限 · 工作流",
  "text_style": {
    "fontSize": 16,
    "bold": true,
    "color": "2D9A80",
    "align": "center",
    "valign": "mid"
  }
}
```

The minimal exporter represents shape text as a native shape plus a native text box when the backend does not support a single combined object. Both objects must be reported.

### Line

```json
{
  "type": "line",
  "id": "P04-takeaway-border-left",
  "x": 0.73,
  "y": 5.02,
  "w": 0,
  "h": 0.60,
  "line": { "color": "C9A24B", "width": 3.75 }
}
```

Lines are native shape objects. They are used when the source has a one-sided
CSS border or a standalone rule so that the exporter does not turn a partial
border into a misleading full rectangle. A zero width or height denotes a
vertical or horizontal line; the HTML editor may use a small visual hit area
without changing the saved IR geometry.

### Table

```json
{
  "type": "table",
  "id": "QA-object-table",
  "x": 1.20,
  "y": 3.05,
  "w": 4.75,
  "h": 2.05,
  "rows": [
    ["Object", "Required", "Status"],
    ["Text / shapes", "Yes", "Native"]
  ],
  "options": {
    "fontSize": 11,
    "color": "43505F"
  }
}
```

### Chart

```json
{
  "type": "chart",
  "id": "QA-native-coverage-chart",
  "chart_type": "bar",
  "x": 6.85,
  "y": 2.58,
  "w": 4.55,
  "h": 2.65,
  "series": [
    {
      "name": "Native coverage",
      "labels": ["Text", "Shape", "Table", "Chart"],
      "values": [1, 1, 1, 1]
    }
  ],
  "options": {
    "chartColors": ["2D9A80"],
    "showLegend": false,
    "showValue": true
  }
}
```

Charts are only `E2`-eligible after the exporter produces a valid chart data path, including any required embedded workbook, and PowerPoint edit-save-reopen succeeds.

#### HTML chart preview v0.3.3

`scripts/chart_preview.cjs` is a generic SVG adapter embedded into the standalone editor, not a style authority or an external library. SVG coordinates use points (`element.w/h * 72`) within the IR object bounds. Native PPTX remains a separate semantic export; SVG is not used as a screenshot or replacement for native charts.

Supported preview: single/multiple series with identical flat category labels and finite numeric values; `bar` with `barGrouping: clustered` (default), vertical `barDir: col` or horizontal `bar`; and ordinary `line`. All series and signed values are retained. Zero bars have zero length. Missing/non-numeric values and inconsistent categories are not silently converted or aligned by index.

Mapped options cover `showTitle/title`, title font/color/alignment, `showLegend/legendPos` (`b/t/l/r/tr`) and legend font/color, `showValue` and data-label font/color, category/value axis labels and titles (`showCatAxisTitle/showValAxisTitle`), axis font/color/visibility/orientation, explicit value-axis min/max/major unit and basic solid value-grid lines. Category labels wrap without truncating text. `fontSize` controls data labels; individual title/legend/axis font-size fields take precedence for those roles. Values use the supplied `dataLabelFormatCode` / `valAxisLabelFormatCode`: `General`, `0`, `#,##0`, up to six fixed decimal places, optionally `%`. Data-label default `#,##0` matches the current native exporter; use explicit precision when decimals are material. Formatting does not change stored numbers. Other Excel formats are not guessed.

Not every native chart option is supported. Pie/stacked/combination/secondary-axis/logarithmic charts, multilevel categories, missing values, unsupported option keys or number formats, a clipping explicit axis range, and boxes too small for their content display `unsupported` with a visible explanation and original data. The original IR is unchanged, and this state does not reduce Native PPTX capabilities. Change the route/options only within the Deck Brief's authorization; do not silently substitute another chart. Grid/marker/label positioning support is deliberately limited to the options accepted by this module.

After fonts load, the editor measures SVG label bounds and overlaps; detected problems become `review-required`, visibly listed in the current-page inspector. `rendered` means supported rendering and no detected label-bound issue, not a visual pass, full-deck scan, user approval or pixel parity with Office. Actually view representative HTML/PPTX images before delivery. Dense/long labels may require a larger chart or an approved layout change; do not hide the warning or remove content to pass QA.

Charts remain selectable/movable/resizable with stable IDs; save retains all series/options in IR and explicit re-export produces native PPTX. This patch adds no chart-data natural-language command or arbitrary option patch, and does not certify E3/H3. Unsupported chart previews and media placeholders must remain disclosed.

### Image and video

```json
{
  "type": "image",
  "id": "P07-dashboard-screenshot",
  "path": "assets/pbi/pbi_profit_dashboard_redacted.png",
  "x": 8.30,
  "y": 2.20,
  "w": 3.80,
  "h": 2.60,
  "editability": "media-object"
}
```

```json
{
  "type": "video",
  "id": "P04-process-video",
  "path": "assets/media/finance_ai_observation_618_full_167s.mp4",
  "cover": "assets/media/finance_ai_observation_618_poster.jpg",
  "x": 1.20,
  "y": 2.88,
  "w": 6.05,
  "h": 2.25,
  "editability": "media-object"
}
```

Media objects are replaceable/croppable or playable, not semantically text-editable. They must be listed as exceptions when the deck target is `E1` or higher.

## 4. Evidence fidelity

Every data-bearing slide or element must either carry an `evidence` record or point to one in `evidence_register_refs`:

```json
{
  "evidence": {
    "mode": "preserve-source",
    "source_refs": ["research.pdf:page-12", "brief:evidence-03"],
    "source_scope": {
      "period": "FY2025",
      "currency": "CNY",
      "denominator": "all sampled entities"
    },
    "original_context_preserved": true,
    "transformation_type": "none",
    "method_or_formula": "N/A",
    "checks": {
      "number": "verified",
      "unit": "verified",
      "period": "verified",
      "denominator": "verified",
      "axis": "not-applicable",
      "legend": "not-applicable",
      "labels": "verified"
    },
    "status": "verified",
    "notes": ""
  }
}
```

Allowed `mode` values are `preserve-source`, `controlled-redraw`, `recompute`, and `not-applicable`. Allowed verification values are `verified`, `pending`, `provisional`, `not-run`, and `not-applicable`; `rejected` may be used for a failed record. `source_refs` and `evidence_status` at the element's top level remain backward-compatible shorthand, but the nested `evidence` record is canonical for data-bearing content.

Rules:

- `preserve-source` must retain the context needed to interpret the source; a crop-only operation cannot remove a material axis, legend, unit, period, or annotation.
- `controlled-redraw` must record the source and field-level checks, not only a screenshot or a list of final values.
- `recompute` must record inputs, scope, method or formula, rounding, and verification; the derived result must not overwrite the source value in the record.
- An accepted edit to numeric text, table cells, or chart data changes the related evidence status to `pending` until the new value and scope are reverified.
- An absent, unresolved, or unrun evidence check is not silently treated as `verified` by an exporter or visual renderer.

The evidence record is provenance metadata, not a place to store Patrick-specific colors, fonts, or visual tokens.

## 5. HTML editor identity and patch boundary

When an HTML visual editor is requested, every selectable element must retain its Deck IR `id` in the rendered page. The editor may maintain transient UI state, but accepted changes must be expressed against stable IDs and written back to the Deck IR rather than only to generated HTML/CSS.

The minimal patch vocabulary is:

```json
{
  "operation": "set_text | move | resize | set_property | replace_media",
  "target_ids": ["P20-title"],
  "value": "New conclusion title",
  "reason": "User natural-language instruction",
  "source": "user | assistant",
  "status": "preview | accepted | rejected"
}
```

The editor or host may use a richer internal command format, but it must validate the target IDs, object types, and property types before applying a patch. Unknown properties, unsupported object conversions, and silent style-system mutations must be rejected or surfaced as an explicit confirmation item.

When the editor is embedded in a host page, `editor.allowed_origins` must list the
exact allowed origins. The generated page rejects incoming patches from other
origins and does not broadcast IR snapshots to an arbitrary `*` target. A
standalone local HTML file has no external host bridge; callers should use the
public editor API or open the generated page in a controlled same-origin host.

## 6. Provenance

Each element may include:

```json
{
  "source_refs": ["source-file:paragraph-12", "page-map:P20"],
  "evidence_status": "verified | pending | provisional",
  "public_use_status": "approved | pending | restricted"
}
```

These fields support audit and delivery reporting. They do not change the SSOT authority order.

## 7. Export and QA boundary

The HTML and Native PPTX adapters share `scripts/deck_ir_validation.cjs`. Supported input schema is exactly `0.2`: missing/unknown versions require explicit migration, not a guessed default. Slide dimensions must be positive finite numbers; slide and element IDs are nonblank and globally unique. Element x/y/w/h are finite numbers (not numeric strings or null), nonnegative, with x+w/y+h inside the canvas (0.0001-inch arithmetic tolerance). Zero line width/height remains valid. This checks bounding boxes, not rotated extents, text wrapping, font availability, or visual quality. Geometry repeated in style/options must match the element geometry, not override it. HTML does not support audio; Native PPTX may represent it as a declared media exception. This is a shared minimum structural contract, not complete semantic validation of every chart/table/backend option.

All four adapters use `scripts/safe_output.cjs`: input/output/report must be distinct, including resolved path aliases; existing destinations are refused. Always choose new versioned output/report paths. Output creation is exclusive; there is no overwrite switch. Native export's default report replaces `.pptx` with `.editability.ir.json`, or appends that suffix when output has no `.pptx` extension. Preflight validation/path errors produce no final artifact. Filesystem failures during writing can leave incomplete new artifacts; a nonzero exit is not a successful delivery and partial files must be disclosed. The optional semantic HTML importer still produces pilot IR; downstream validation may reject its geometry, requiring scoped correction, not weakening the contract.

The exporter must reject unknown element types by default. It may accept declared media exceptions. It must not silently convert a required text, table, or chart element into a raster image.

The generated PPTX is still subject to the Editability Contract: package inspection, representative edit-save-reopen, and visual verification after round-trip.

## 8. Standalone HTML presentation mode (v0.3.4)

`node scripts/html_visual_editor.cjs --input deck-ir.json --output deck.html --mode presentation` exports the same standalone HTML with presentation as its initial view. `--mode editor` is the default; `--mode=presentation` / `--mode=editor` are also accepted. Unknown or missing mode values fail before input reading or any output write, including with `--check`. Existing destination and input/output alias protections are unchanged; use a new output path.

The toolbar's `#enter-presentation` button enters presentation on the current editor slide. An optional URL query `view=presentation` or `view=editor` overrides the exported initial view; unrecognized query values are ignored. These are transient view controls, not IR fields, and do not rewrite the URL. The public `window.PatrickPptDirectorEditor` API additionally exposes `getMode()` and `setMode('editor' | 'presentation')`; other values throw without a state change. Existing selectors and editor layout rules remain in place, with one added toolbar button.

Presentation hides the editor toolbar, sidebars, canvas toolbar and command bar, and fits the entire canvas into the viewport at the IR aspect ratio (letterboxing as necessary, no cropping or minimum editor-size clamp). It reuses the same renderer, stable object IDs, text, chart labels, series, evidence and embedded IR; no iframe, external library or network dependency is added. Existing chart warnings and media placeholders are retained. The low-opacity, hover/focus-revealed navigation `#presentation-prev`, `#presentation-next`, `#exit-presentation` has accessible labels and a live page counter; it overlays a small bottom-right area rather than reducing the canvas.

Right/Down/Space advance; Left/Up go back; Home/End select first/last; Esc returns to editing. Page indices clamp at the ends (no wrapping). These shortcuts run only in presentation, outside inputs, textareas, selects, editable content and role=textbox, and ignore composition, Alt/Ctrl/Meta or already-handled events. Space on buttons/links/summary retains native activation. There is no autoplay, animation scheduler, browser-fullscreen request or media playback feature.

Returning restores the pre-presentation editor slide and selection; accepted IR data, undo/redo stacks, patch log and command input are retained. Entering cancels unfinished pointer gestures and uncommitted direct-text/table drafts rather than recording an implicit patch. In presentation, selection/drag/resize/lasso/double-click editing, natural-language application and undo/redo actions are disabled. `applyPatches` throws a read-only error; host patches pass the unchanged source/origin gate but are then rejected by that same mutation guard, not queued for replay. Save/read APIs and existing bridge origin rules are unchanged. This is a UI interaction boundary, not isolation from same-page JavaScript (the existing `getIR()` still returns the live IR object).

This addition does not change schema version, evidence status or editability level. Browser layout/navigation tests do not establish Office round-trip fidelity, whole-deck visual acceptance, or E3/H3.

Programmatic slide review uses `window.PatrickPptDirectorEditor.selectSlide(slideId)` after `setMode('presentation')` (or a presentation initial view). It requires an exact existing slide ID and presentation mode; an unknown ID throws `Unknown slide ID: ...`, and a valid ID in editor mode throws `selectSlide requires presentation mode`, both without state changes. It returns the selected ID after synchronously rendering that slide; sizing/font checks complete through the existing render cycle. It changes only the displayed page, never IR, history, patch log, selection or the saved pre-presentation editor page. Exiting still restores that editor page and selection. Do not simulate clicks on hidden sidebar buttons to drive presentation; those remain inert.

## 9. Shared chart layout defaults (v0.3.4, Provisional)

`scripts/chart_layout_defaults.cjs` exports the self-contained `resolveChartLayoutDefaults(options, seriesCount)`, returning copied `options` and adopted `layout_defaults`. HTML embeds this exact function before `renderChartPreview`; Native PPTX calls the same function. These are generic Provisional rendering defaults, not Patrick SSOT, approved per-deck style decisions or changes to source IR.

- Only when `showValue === true` and `valGridLine === undefined`, adopt `valGridLine: { style: 'none' }` to avoid value-grid lines crossing numeric labels. Keep axes, tick labels, values and categories. Any explicit `valGridLine` value is preserved, including `{}`, `null`, `style: 'solid'`, `style: 'none'` and native-only styles. Preservation does not imply HTML supports all explicit styles; unsupported choices still show the existing preview limitation.
- With no `chartColors`, both backends use the existing HTML generic six-color palette in this order: `4472C4`, `ED7D31`, `A5A5A5`, `FFC000`, `5B9BD5`, `70AD47`. A nonempty valid six-digit-hex array shorter than the series count is extended with unused colors from that palette, in order. Comparison ignores `#` and letter case; supplied entries, spelling and ordering remain untouched. Complete supplied arrays, including explicit duplicates, remain unchanged. Duplicate series colors are a visual risk requiring manual review, not automatic approval or permission to rewrite supplied colors.
- No random or cyclic reuse fills missing series slots. If the generic palette cannot supply enough unused colors, native export fails before final writes; HTML shows `unsupported` with original data. Supply a complete explicit palette. This does not relax existing malformed/empty-palette checks or add new palette generation.
- Native chart reports record the actual adopted `valGridLine` and/or full resolved `chartColors` under each object's `layout_defaults`, alongside any previously adopted category-label default. Explicit values are not reported as defaults. Options and series passed to the native backend are copies; renderer defaults do not mutate source IR, series, labels, evidence or metadata.

No label-position option or label-background fill is written into the IR or added to native export. Line/series crossings, intentional grid lines and explicit duplicate palettes still require actual Office image review. OOXML and browser checks alone do not close those visual risks or establish E3/H3.

### HTML line-label placement

After insertion and font loading, an HTML line chart with numeric labels and no explicit `dataLabelPosition` uses a bounded deterministic local search around each point. It checks actual text bounds against other labels, all series points and segments, axes/gridlines, fixed chart text and chart edges. Placement is recomputed from the original positions on each layout check, without changing source values, labels, series or IR; it does not claim pixel identity with PowerPoint.

Explicit label positions do not enter automatic avoidance. For line charts, `t` places the actual glyph box above the marker (2 SVG-point clearance), and `ctr` centers it on the point; `outEnd` retains the previous outward layout. Actual collisions are still reported, not exempted. If local space is insufficient, every value remains present and the chart becomes `review-required`; enlarge or change the chart within authorization and recheck. A warning is not a passed visual gate. The automatic search is not a general chart-label optimizer and does not guarantee that arbitrary dense charts are readable.

A moved number must still identify its series. When `dataLabelColor` is absent, HTML line labels use their own series color. Explicit label colors remain unchanged. Where the label lacks a unique matching series color and has moved or is closer to another series, the preview attempts a short connector without crossing labels, points or chart lines. If it cannot place a safe connector, it reports the association as `review-required` rather than silently treating clear text as unambiguous. No series-name prefix, numeric reformatting, value/IR change or native-export option is introduced. Actual visual inspection remains necessary for low-contrast palettes and very close hues; a unique hex value alone is not a human readability guarantee.
