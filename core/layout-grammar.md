# Layout Grammar

Use this grammar to prevent unbalanced, arbitrary, or visually weak slide layouts.

The goal is to make each slide look intentionally composed before detailed design begins.

## Layout Rule

Every slide must declare a layout family before production.

Do not place text, images, charts, or cards freely without a layout decision.

## Stage Geometry

Default slide format:

- 16:9 aspect ratio;
- safe margin on all sides;
- consistent title zone;
- consistent footer or page number zone when used;
- main content grid;
- visual focus area.

## Recommended Grid

Use one of:

- 12-column grid for flexible business layouts;
- 2-column split for comparison or concept plus explanation;
- 3-column card system for options, pillars, drivers;
- 4-quadrant matrix for tradeoffs and risk;
- full-bleed visual field for covers and section dividers;
- dashboard grid for finance or KPI pages.

## Layout Families

| Family | Best For | Structure |
|---|---|---|
| single-message | one key conclusion or quote | large title, minimal support, strong whitespace |
| title-plus-body | standard explanation | conclusion title, body blocks, optional visual |
| split-visual-text | concept explanation | visual or chart left, explanation right |
| three-card | pillars, drivers, options | three equal cards with one hierarchy |
| matrix | comparisons, risk, priority | 2x2 or table grid, clear axis labels |
| timeline | sequence or recovery plan | horizontal or vertical path with milestones |
| dashboard | finance and KPI | grid of metrics, chart, driver, action |
| decision-page | board/client ask | decision box, rationale, implications |
| appendix-detail | dense support | small title, table/detail, notes or source |

## Balance Checks

Before building, check:

- there is one visual center of gravity;
- the slide is not evenly filled without hierarchy;
- title and body align to the same grid;
- chart/table/image size matches importance;
- no side of the slide feels accidentally heavier;
- repeated objects use equal spacing;
- dense pages have clear grouping;
- empty space is intentional, not forgotten.

## Anti-Patterns

Avoid:

- title floating without alignment;
- centered title plus random cards below;
- too many equal-weight boxes;
- image pasted without crop logic;
- chart squeezed beside long paragraphs;
- cards with inconsistent padding;
- icons used to fill gaps;
- appendix-level detail on main narrative slides.

## Layout Specification Template

```text
Slide:
Layout family:
Grid:
Title zone:
Primary visual zone:
Secondary content zone:
Footer/source zone:
Visual weight:
Alignment rule:
Spacing rule:
What must not happen:
```

## Page Map Addition

For non-trivial decks, add:

```text
Layout family:
Visual weight:
Density level:
Editable elements:
```

