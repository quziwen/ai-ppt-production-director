# Reference Deck Reverse Engineering

Use this workflow when the user provides a deck that "looks good" and wants future decks to reach a similar visual quality.

The goal is not to copy the reference deck. The goal is to extract reusable design principles, page patterns, pacing, and visual system rules, then decide whether the final output should prioritize editability or high-fidelity visual polish.

## First Judgment

Before using a reference deck, classify it:

| Class | Meaning | Allowed Use |
|---|---|---|
| editable-template | real PowerPoint objects, layouts, charts, and text | can adapt if rights allow |
| rendered-poster-deck | each slide is mostly a full-slide image | can learn style, but editability is low |
| hybrid-deck | image-heavy backgrounds with editable overlays | can adapt patterns cautiously |
| inspiration-only | rights or structure unclear | extract abstract principles only |
| forbidden | private or unauthorized | do not use |

## What To Extract

Extract the visual system:

- page rhythm: cover, section break, concept page, framework page, data page, closing page;
- layout families: split page, timeline, pyramid, funnel, card grid, diagnostic sidebar, architecture map, process flow;
- visual motif: grid paper, blueprint lines, circuit traces, isometric diagrams, editorial spreads, control-room panels;
- color system: dominant background, main text, secondary text, accent, warning/highlight color;
- typography hierarchy: title, subtitle, body, label, footer, note;
- diagram language: line weight, arrow style, node style, callout style, icon style;
- texture and background: subtle grid, noise, paper, blueprint, geometric field;
- density rules: how much text per slide, how many blocks, how much white space;
- footer and citation behavior;
- chapter and pacing strategy.

## Visual Quality Rubric

Score the reference or target deck from 1 to 5:

| Dimension | What 5 Looks Like |
|---|---|
| art direction | one recognizable visual world, not a collection of slides |
| page rhythm | varied page types without random layout jumps |
| diagram quality | diagrams explain the point, not generic decoration |
| hierarchy | the eye knows what to read first, second, third |
| density control | information-rich but not cramped |
| asset consistency | icons, images, lines, textures, and callouts belong together |
| business clarity | every beautiful page still advances the argument |
| editability fit | output format matches downstream editing needs |

## Editability Decision

When a reference deck is beautiful because it is rendered as full-slide artwork, state the tradeoff:

- high-fidelity visual output may be `image-based` or `html-maintainable`;
- business review decks usually need `native-editable`;
- a hybrid approach can use editable text and charts over a controlled visual system;
- if numbers and text will change often, do not copy a rendered-poster approach blindly.

## Reverse Engineering Workflow

1. Render or inspect the reference deck as a contact sheet.
2. Classify editability and rights.
3. Identify 6-10 recurring page patterns.
4. Extract style tokens.
5. Extract diagram and asset rules.
6. Write a benchmark recipe.
7. Build 1-2 sample slides from the user's content.
8. Compare against the benchmark using the visual quality rubric.
9. Decide whether to continue as native-editable, html-maintainable, image-based, or hybrid.

## Benchmark Recipe Template

```text
Reference deck:
Rights/use boundary:
Editability class:
Visual world:
Dominant palette:
Accent behavior:
Typography hierarchy:
Background/texture:
Motif:
Page pattern library:
Diagram rules:
Asset rules:
Density rules:
Footer/citation rules:
Do not copy:
Target implementation mode:
Sample slide gate:
```

## Do Not

- copy proprietary slide images into a public repository;
- treat a full-slide image deck as an editable PPT template;
- ignore the user's future editing needs;
- chase beauty by sacrificing content correctness;
- apply all reference styles at once when only one pattern is useful.

## Public Repository Rule

Public repositories may contain:

- reverse-engineering workflow;
- abstract benchmark recipes;
- fictional screenshots or original seed templates;
- visual quality rubric.

Public repositories must not contain:

- reference deck files without rights;
- extracted full-slide images;
- proprietary templates;
- private or third-party screenshots.
