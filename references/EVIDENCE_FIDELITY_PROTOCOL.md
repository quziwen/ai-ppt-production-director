# Evidence Fidelity Protocol

> Version: 0.1
>
> Status: working pilot contract / P1

This protocol applies to decks containing financial, research, operating, market, or other data-bearing claims. It controls how source evidence is retained or transformed. It does not define Patrick's style and does not replace the source authority hierarchy.

## 1. Select one evidence mode

Record the mode in the Deck Brief, page argument map, Deck IR, and evidence register:

| Mode | Meaning | Minimum requirement |
|---|---|---|
| `preserve-source` | Keep the source chart, table, screenshot, or evidence context substantially intact | Retain source reference, period, unit, denominator, axis, legend, and necessary notes; cropping cannot remove meaning |
| `controlled-redraw` | Rebuild the visual as a native chart, table, or semantic shape arrangement | Preserve the source meaning and values; record source references, transformation, and field-by-field verification |
| `recompute` | Recalculate or aggregate values before presenting them | Record inputs, formula/method, scope, rounding, and verification result; do not present an unverified calculation as source fact |
| `not-applicable` | The page has no factual or data-bearing evidence | Explain why the page is exempt; this does not exempt narrative or visual QA |

If no mode is specified for a data-bearing page, use `preserve-source` as a provisional working assumption and surface the decision before redrawing or recomputing.

## 2. Evidence register record

Each data-bearing page or element must have a record like this:

```text
evidence_id:
slide_id:
element_id:
claim_or_visual:
mode: preserve-source / controlled-redraw / recompute / not-applicable
source_refs:
source_scope: period, population, currency, denominator, or sample boundary
original_context_preserved: true / false / not-applicable
transformation_type: none / crop-only / layout-redraw / aggregation / recompute / other
method_or_formula: N/A when not transformed
checks:
  number: verified / pending / provisional / not-run / not-applicable
  unit: verified / pending / provisional / not-run / not-applicable
  period: verified / pending / provisional / not-run / not-applicable
  denominator: verified / pending / provisional / not-run / not-applicable
  axis: verified / pending / provisional / not-run / not-applicable
  legend: verified / pending / provisional / not-run / not-applicable
  labels: verified / pending / provisional / not-run / not-applicable
status: verified / pending / provisional / not-run / rejected
notes:
```

`source_refs` must point to the actual file, page, table, paragraph, data range, or approved source record. A historical deck, generated image, or tool output is not a source reference unless the Brief explicitly treats it as the source for this task.

## 3. Rules for data-bearing visuals

- A chart is not evidence merely because it has bars, lines, or numbers. It needs a traceable source and an understandable conclusion.
- Preserve axis labels, units, period, legend, denominator, sample boundary, and material annotations when they are needed to interpret the claim.
- A screenshot or source chart can remain a declared media exception in a Hybrid deck; do not call it a native editable chart.
- A controlled redraw must be checked against the source before delivery, including labels and ordering, not only the numeric values.
- A recomputed result must be labeled as derived and must not overwrite the original source value in the evidence record.
- If a user edits a numeric text, table cell, or chart data in HTML or PowerPoint, the related evidence status becomes `pending` until the new value and scope are reverified.
- If verification is not run, report `not-run` or `pending`; do not infer `verified` from package inspection, visual similarity, or a successful export.

## 4. Prohibited shortcuts

Do not:

- remove a source chart's axis, legend, unit, or date merely to make it fit;
- redraw a chart from a screenshot without recording the source and checking the values;
- merge different periods, currencies, populations, or denominators without recording the transformation;
- turn an interpretation into a fact by removing its evidence status;
- use a generated visual or historical deck as proof that an unverified number is correct;
- hide an evidence failure behind a successful editability or visual check.

## 5. Evidence gate

The evidence gate passes only when every data-bearing element is either:

1. `verified` under the selected mode;
2. explicitly marked `pending` or `provisional` with a current confirmation to deliver with that limitation; or
3. excluded from the mainline and moved to an appendix or notes with its limitation disclosed.

The default is to block delivery of a public or high-risk deck when a material number, chart label, unit, period, or source boundary is unresolved. A current exception must name the item, impact, owner, and acceptance decision.

## 6. Relationship to style and vendors

This protocol is an evidence and provenance contract. It does not prescribe colors, fonts, layout, chart theme, or a particular exporter. Third-party product comparisons may suggest useful test tasks, but they are not evidence of data correctness, editability, or Patrick style.
