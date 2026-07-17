# Output Routing Matrix

Use this matrix after the thesis, storyline, and page map are stable.

## Route Selection

| Need | Best Route | Why |
|---|---|---|
| Formal business deck that others must edit | Native editable PPTX | best for collaboration, speaker notes, corporate review |
| High-impact visual talk or interactive demo | HTML deck | best for expressive visuals, animation, browser playback |
| User needs to see pages before deciding | HTML storyboard preview or representative samples | best for fast visual review without committing to final output |
| Versionable technical or internal deck | Markdown/Marp-style source | best for diffs, repeatability, simple maintenance |
| Executive handout or immutable distribution | PDF export | best for locked presentation state |
| User will build in another AI/tool | Prompt-only package | best when local tools are unavailable |
| Strict corporate template | PPTX using real slide master/layout | avoids fake screenshot-based templates |
| Strong visuals plus PowerPoint editability | Studio Hybrid Mode | keeps business content editable while allowing semi-editable visual pages |

## PPTX First

Prefer PPTX-first when:

- the deck must be editable in PowerPoint;
- a real template, slide master, or corporate workflow is required;
- reviewers will comment or revise in Office;
- charts and tables must remain editable.

## HTML First

Prefer HTML-first when:

- the user wants browser-native playback;
- visual experimentation, animation, or interaction is central;
- the output is a public talk, demo, or web artifact;
- PowerPoint editability is not required.

## HTML Preview, Not HTML First

Use HTML storyboard preview when:

- the user needs to judge the deck visually before final production;
- the user is unsure about style, density, layout, or page rhythm;
- representative samples or section preview are enough to calibrate direction.

Do not treat HTML storyboard preview as final HTML-first routing. For editable PowerPoint deliverables, update the source of truth after preview feedback and build PPTX from the approved source and style rules.

## Source-First

Use source-first when:

- multiple formats are required;
- the deck will change repeatedly;
- content accuracy is more important than immediate visuals;
- long conversations risk losing context.

Recommended sources:

- `slides_source.md` for human-readable decks;
- `slides_source.json` for generated layouts, chart data, or automated builds.

## Hybrid Route

If both PPTX and HTML are required, the default route is:

1. stabilize thesis and page map;
2. create source of truth;
3. build PPTX if editability matters;
4. generate HTML after content is stable;
5. run separate QA for each format.

Use HTML-first only when the user explicitly chooses it or the presentation is fundamentally browser-native.

## Studio Hybrid Mode

Use `studio-hybrid-production-mode.md` when the user wants both:

- strong visual quality;
- practical PowerPoint editability.

Default sequence:

1. stabilize source and page map;
2. run storyline coherence check;
3. set density and layout per slide;
4. classify editability by slide;
5. build representative sample slides;
6. run visual QA rubric;
7. bulk-build PPTX;
8. render contact sheet;
9. optionally generate HTML/PDF after the PPTX content is stable.

Do not route through HTML-first if editable PowerPoint is the main deliverable.
