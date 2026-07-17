# Style Lookbook

Use this lookbook when the user has no reference deck, no favorite template, or cannot describe the desired visual style.

The goal is to reduce user effort. The agent should recommend 2-3 suitable visual directions based on audience, topic, scene, time limit, editability need, and risk level.

These are original style directions, not third-party template files.

## Recommendation Rule

If the user has no visual reference:

1. infer the presentation scene;
2. recommend 2-3 style cards;
3. explain why each fits or does not fit;
4. choose a default if the user does not want to decide;
5. move to a sample slide gate for high-stakes or visually uncertain decks.

Do not ask the user to browse template sites before giving a useful default.

## Style Cards

### board-update-minimal

Best for:

- board updates;
- steering committee reviews;
- project delay or risk reports;
- executive governance decks.

Visual promise:

- calm, precise, decision-oriented.

Design tokens:

- background: white or warm light gray;
- text: black, charcoal, muted gray;
- accent: one restrained blue, green, or amber;
- density: executive-brief;
- layout: title strip, decision boxes, status bands, risk tables, timeline.

Avoid:

- decorative imagery;
- dramatic gradients;
- startup-style purple;
- over-designed pages that hide the ask.

Default implementation:

- `native-editable` PPTX for formal reviews.

### finance-control-room

Best for:

- finance business review;
- KPI and variance analysis;
- budget, forecast, and operating rhythm;
- CFO or finance COE presentations.

Visual promise:

- structured, data-aware, action-oriented.

Design tokens:

- background: dark navy, slate, or light dashboard grid depending on audience;
- text: high-contrast labels and number hierarchy;
- accent: variance colors used only for signal;
- density: balanced-explain to appendix-heavy;
- layout: dashboard grid, driver tree, variance bridge, action table.

Avoid:

- decorative charts;
- red/green overload;
- tables without management interpretation.

Default implementation:

- `native-editable` PPTX for charts and tables.

### executive-consulting-dark

Best for:

- strategy reviews;
- transformation narratives;
- executive recommendations;
- external-facing thought leadership when a premium mood is needed.

Visual promise:

- high-contrast, sharp, serious, consulting-grade.

Design tokens:

- background: dark graphite, navy, black-blue;
- text: white and muted gray;
- accent: restrained gold, cyan, lime, or amber;
- density: executive-brief;
- layout: large conclusion titles, structured frameworks, tradeoff matrices, roadmap pages.

Avoid:

- too many accents;
- decorative glow effects;
- unreadable small text on dark backgrounds.

Default implementation:

- `native-editable` or `semi-editable` depending on visual ambition.

### academic-clean-lecture

Best for:

- courses;
- internal training;
- university or classroom lectures;
- concept explanation.

Visual promise:

- clear, teachable, easy to follow.

Design tokens:

- background: white or paper-like neutral;
- text: strong hierarchy with readable body copy;
- accent: one academic blue, green, or red;
- density: balanced-explain to teaching-detail;
- layout: concept diagram, example box, step explanation, recap page.

Avoid:

- executive over-compression;
- tiny charts;
- pages that need speaker narration but have no cues.

Default implementation:

- PPTX or HTML depending on classroom setup.

### product-demo-swiss

Best for:

- product demo;
- technical walkthrough;
- platform introduction;
- architecture or workflow explanation.

Visual promise:

- clean, precise, modern, product-led.

Design tokens:

- background: white, off-white, or light technical gray;
- text: strong typographic grid;
- accent: one product color;
- density: balanced-explain;
- layout: Swiss grid, screenshot frame, numbered workflow, architecture map.

Avoid:

- screenshots without framing;
- inconsistent icon styles;
- decorative mockups that reduce clarity.

Default implementation:

- `native-editable` PPTX for formal demos, HTML for interactive demos.

### magazine-storytelling

Best for:

- opinion talks;
- public sharing;
- founder or expert speeches;
- industry trend narratives.

Visual promise:

- editorial, memorable, story-driven.

Design tokens:

- background: editorial spreads, textured neutrals, or strong image fields when rights are clear;
- text: large titles, pull quotes, chapter rhythm;
- accent: style-specific but limited;
- density: headline-only to balanced-explain;
- layout: cover spread, quote page, visual metaphor, chapter divider, story sequence.

Avoid:

- fake stock-photo emotion;
- image-heavy pages without rights;
- long paragraphs on editorial pages.

Default implementation:

- `html-maintainable`, `semi-editable`, or hybrid depending on editability needs.

### blueprint-research

Best for:

- research briefings;
- NotebookLM-like visual benchmark requests;
- conceptual finance or AI topics;
- external sharing where visual identity matters.

Visual promise:

- analytical, diagram-rich, blueprint-like.

Design tokens:

- background: light blueprint grid, technical paper, or muted blue-gray;
- text: navy, slate, charcoal;
- accent: amber, red-orange, or cyan for key signals;
- density: balanced-explain;
- layout: system map, compass, ladder, architecture, causal loop, framework diagram.

Avoid:

- copying NotebookLM slide images;
- making every slide a dense poster;
- sacrificing editable numbers and text when the deck needs review.

Default implementation:

- hybrid: editable text and charts for business pages, semi-editable or rendered visual pages for concept pages.

## Selection Heuristics

| User Need | Default Recommendation |
|---|---|
| board decision | `board-update-minimal` |
| finance analysis | `finance-control-room` |
| executive strategy | `executive-consulting-dark` |
| course or training | `academic-clean-lecture` |
| product or tech demo | `product-demo-swiss` |
| public opinion talk | `magazine-storytelling` |
| NotebookLM-like visual quality | `blueprint-research` plus hybrid route |

## Style Recommendation Output

When style is unclear, return:

```text
Recommended visual directions:
1. <style card> - why it fits
2. <style card> - why it fits
3. <style card> - why it is bolder or safer

Default choice:
<style card>

Tradeoff:
<editability vs visual fidelity>

Sample slide gate:
<which 1-2 slides should be prototyped first>
```

