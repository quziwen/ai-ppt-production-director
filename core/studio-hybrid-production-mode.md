# Studio Hybrid Production Mode

Use this mode when the user wants both strong visual quality and practical PowerPoint editability.

This is the default mode for users who effectively want "beautiful enough to use" and "editable enough to revise", especially for business, finance, board, client, lecture, or external-sharing decks.

## Core Position

Do not default to HTML-first when the final deliverable must be editable in PowerPoint.

Do not bulk-generate a full PPTX before the storyline, page map, visual direction, content density, and representative sample slides are stable.

Default route:

```text
source-first -> PPTX-first -> hybrid visual pages -> render QA -> final package
```

## When To Use

Use Studio Hybrid Mode when:

- the user wants a professional, beautiful PPT;
- the user also needs to edit text, tables, numbers, charts, or notes later;
- prior AI-generated slides looked plain, unbalanced, or hard to revise;
- the deck contains a mix of data pages and visual concept pages;
- the user references NotebookLM, designer decks, or high-end visual examples but still needs PowerPoint handoff.

## Page-Level Route

Classify each page before building.

| Page Type | Default Route | Editability Target |
|---|---|---|
| executive summary | PPTX native objects | native-editable |
| finance table or chart | PPTX chart/table/text | native-editable |
| roadmap or timeline | PPTX shapes/text | native-editable |
| risk or decision page | PPTX shapes/tables | native-editable |
| cover | visual background plus editable title | semi-editable |
| section divider | visual background plus editable title | semi-editable |
| concept metaphor page | rendered visual plus editable headline or callouts | semi-editable or image-based |
| public keynote hero page | rendered visual or HTML prototype | semi-editable, image-based, or html-maintainable |
| appendix | PPTX text/table | native-editable |

## Production Sequence

1. Create or update `slides_source.md` or `slides_source.json`.
2. Run storyline coherence check.
3. Select style card and recipe.
4. Set content density by slide.
5. Select layout family for each slide.
6. Classify editability level by slide.
7. Build 1-2 sample slides:
   - one dense business/content slide;
   - one visual/hero/concept slide when needed.
8. Render sample slides to images or preview.
9. Run visual QA rubric on sample slides.
10. Get user approval or revise.
11. Bulk-build remaining slides.
12. Render contact sheet.
13. Run final QA.

## Explicit Tradeoff Disclosure

State this before production when relevant:

```text
The default route will keep core business content editable in PowerPoint.
Some high-visual pages may use semi-editable backgrounds or rendered visuals.
This improves visual quality but means those decorative or concept elements are not fully editable.
```

## Do Not Promise

Do not promise:

- pixel-perfect HTML-to-PPTX conversion;
- full editability for complex rendered artwork;
- perfect visual quality from one prompt;
- bulk production without a sample slide gate when visual quality matters.

## Pass Criteria

Studio Hybrid Mode passes when:

- the user knows which pages are native-editable, semi-editable, html-maintainable, image-based, or pdf-only;
- content pages stay editable;
- visual pages are deliberately classified;
- sample slides pass visual QA before bulk production;
- final contact sheet shows consistent rhythm, density, alignment, and visual system.

