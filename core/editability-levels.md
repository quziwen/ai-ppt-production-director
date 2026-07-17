# Editability Levels

Classify deliverables by editability before promising output quality.

| Level | Meaning | Best For | Risk |
|---|---|---|---|
| native-editable | real PowerPoint text boxes, shapes, tables, charts, and layouts | formal business decks | harder to make highly visual |
| semi-editable | static backgrounds or images with editable text overlays | fast polished drafts | harder to revise structure |
| html-maintainable | editable in HTML/CSS/source files, not native PowerPoint | visual talks and web decks | not suitable for Office-only teams |
| image-based | slides are mostly rendered images | concept art or visual mockups | poor business editability |
| pdf-only | final locked output | distribution and handouts | not a working deck source |

## Default Rule

For business, board, finance, client, investor, or internal review decks, default to `native-editable` unless the user explicitly chooses another level.

For visual talks, product demos, or interactive sessions, `html-maintainable` may be better than forcing PowerPoint editability.

Beautiful generated decks are often `image-based` or rendered-poster style. Treat them as visual benchmarks, not editable templates, unless the underlying editable objects are available.

## Disclosure Rule

State the editability level in the build route. If a route sacrifices editability for speed or visual quality, say so before building.

## Visual Fidelity Versus Editability

Users may ask for both a designer-level look and full PowerPoint editability. Treat this as a production tradeoff, not a yes/no promise.

Default decision rules:

- if numbers, titles, tables, charts, decisions, owners, or notes will change, keep those elements `native-editable`;
- if a reference deck looks good because it is rendered artwork, use it as a benchmark, not as an editable template;
- if high-fidelity visual motifs are important, use `semi-editable` backgrounds only for selected hero, chapter, or concept pages;
- if exact visual reproduction matters more than editing, disclose `image-based` or `html-maintainable` tradeoffs;
- if the user wants both, use Studio Hybrid Mode and classify editability by page.

## Page-Level Classification

For Studio Hybrid Mode, classify editability by page:

```text
Slide:
Primary purpose:
Editability level:
Editable elements:
Non-editable or semi-editable elements:
Reason:
User-facing tradeoff:
```

Core business content should remain editable whenever possible:

- titles;
- body copy;
- charts;
- tables;
- decisions;
- risks;
- dates;
- owners;
- numbers;
- speaker notes.

Visual backgrounds, decorative motifs, concept illustrations, or high-impact hero graphics may be semi-editable or image-based when the user accepts the tradeoff.
