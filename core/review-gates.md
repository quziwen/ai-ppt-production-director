# Review Gates

Use review gates to prevent generic, overproduced, or hard-to-edit decks.

## Gate 1. Thesis Gate

Pass criteria:

- the deck has one clear point of view;
- the audience and desired decision/reaction are explicit;
- weak or missing evidence is identified.

## Gate 2. Storyline Gate

Pass criteria:

- 2-3 storyline options were considered for non-trivial decks;
- the recommended storyline has a clear reason;
- the story has tension, sequence, and payoff.
- the selected storyline has a clear story spine and primary logic type.

## Gate 3. Page Map Gate

Pass criteria:

- every slide has a conclusion-style title;
- every slide answers one question;
- every slide has a logic role;
- every slide has a previous link and next setup;
- each slide has a visual form and source/evidence direction;
- high-risk slides are flagged.

## Gate 3A. Coherence Gate

Use when:

- the deck is high-stakes;
- the source material is fragmented;
- the user reports jumpy logic, disconnected pages, or weak transitions;
- an AI-generated draft is being revised.

Pass criteria:

- `storyline-coherence-check.md` has been run;
- weak slide-to-slide links are fixed or documented;
- recommended reordering has been applied to the page map;
- transition sentences are drafted for major slides or sections;
- removed, merged, or split slides are documented.

## Gate 4. Visual Direction Gate

Pass criteria:

- one visual recipe or direction is selected;
- palette, typography, density, chart style, and image treatment are defined;
- third-party template files are not redistributed.
- content density level and layout family are defined for representative pages.

## Gate 4A. Quality Control Gate

Use before sample slide production for non-trivial decks.

Pass criteria:

- `content-density-control.md` has been applied to main page types;
- `layout-grammar.md` has been used to select layout families;
- `studio-hybrid-production-mode.md` has been selected or rejected with reason when the user wants both visual quality and editability;
- page-level editability risk is known;
- sample-slide candidates are selected.

## Gate 4B. Preview Budget Gate

Use before spending time or tokens on visual previews.

Pass criteria:

- `preview-review-loop.md` has been considered when the user is unsure about style, density, layout, or audience reaction;
- preview mode is selected: `no-preview`, `thumbnail-storyboard`, `representative-samples`, `section-preview`, or `full-html-preview`;
- the cost/time tradeoff is stated for high-cost previews;
- representative samples are chosen from the riskiest page types, not only easy pages;
- full HTML preview is used only when explicitly requested or justified by deck risk.

## Gate 5. Sample / Preview Gate

Use when:

- the deck is high-stakes;
- a new visual direction is being used;
- the output route or tool is untested;
- the user cares about aesthetic quality.
- the user is not confident judging only a page map or outline.

Pass criteria:

- 1-3 representative slides, a thumbnail storyboard, a section preview, or a full HTML storyboard is built or described according to preview budget;
- the user can approve, reject, or redirect before bulk production;
- editability level is clear.
- visual QA rubric pass threshold is met or required fixes are listed.
- source of truth is updated before final PPTX or HTML production.

## Gate 6. Full Build Gate

Pass criteria:

- all slides are built from the approved page map;
- source of truth is updated;
- no unresolved placeholder remains unless explicitly allowed.

## Gate 7. Final QA Gate

Pass criteria:

- content, visuals, licensing, editability, media, notes, and package completeness were checked;
- known limitations are documented;
- final files and source files are named clearly.

## Visual QA Gate

Use `visual-qa-rubric.md` on sample slides and final contact sheets when rendering or previews are available.

Pass criteria:

- hierarchy, layout balance, density fit, and business clarity meet the required threshold for the deck risk level;
- slides with weak scores are redesigned or documented as known limitations;
- contact sheet does not show random style shifts, title drift, or obvious density imbalance.

## Contact Sheet QA

When the toolchain allows it, render all slides to images or a contact sheet before final delivery. Check:

- page rhythm;
- repeated or drifting layouts;
- text density;
- title consistency;
- color consistency;
- chart readability;
- obvious overflow or clipping.
