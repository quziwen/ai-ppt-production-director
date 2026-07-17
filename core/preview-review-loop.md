# Preview Review Loop

Use this module when the user needs to see and feel the deck before final production.

The goal is to help users who are not good at PPT design make decisions from visible pages, without forcing a costly full-deck preview by default.

## Core Principle

Do not default to full HTML preview or page-by-page confirmation for every deck.

Default to the lowest preview cost that can answer the user's uncertainty:

- unclear storyline -> thumbnail storyboard or audience playback review;
- unclear style -> 2-3 representative sample slides;
- unclear section quality -> section preview;
- high-risk final review -> full HTML preview or contact sheet;
- low-risk quick draft -> page map plus lightweight QA.

## Preview Budget Levels

| Level | Cost | Use When | Output |
|---|---:|---|---|
| no-preview | lowest | user is clear, deck is low-risk | page map, route, then build |
| thumbnail-storyboard | low | user needs to understand flow, not visual polish | slide-by-slide text storyboard or rough wireframe |
| representative-samples | medium | user is unsure about style, density, or layout | 2-3 sample pages, usually cover, core argument, complex data/process page |
| section-preview | medium-high | deck is long or section quality is uncertain | one section or 2-4 pages per section |
| full-html-preview | high | high-risk, external-facing, user explicitly wants visual review | complete HTML storyboard preview |

## Default Selection Rules

Use `representative-samples` by default when:

- the user says they are not good at PPT;
- the user cannot describe the desired style;
- prior AI slides looked ugly, generic, too sparse, or too crowded;
- visual quality matters but the deck is not ready for full build;
- the deck has one or more complex data, process, or framework pages.

Use `thumbnail-storyboard` when:

- storyline and page order are still uncertain;
- the user wants to review the deck from the audience's perspective;
- token/time budget is tight.

Use `section-preview` when:

- the deck has more than 15 slides;
- different sections use different page types;
- the user wants to approve chunks instead of every slide.

Use `full-html-preview` only when:

- the user explicitly asks for a full visual preview;
- the deck is high-stakes and visual coherence across the full deck is critical;
- a production preview is cheaper or safer than rebuilding PPTX repeatedly;
- the user accepts the extra time and cost.

## User Choice UX

Do not ask vague open-ended style questions when the user is unsure.

Offer concrete choices:

```text
Preview budget:
A. Fast: text storyboard only
B. Recommended: 3 representative sample pages
C. Thorough: section preview
D. Full: complete HTML preview
```

Offer style choices:

```text
Visual direction:
A. Board minimal: restrained, direct, decision-focused
B. Finance control room: structured, data-rich, dashboard-like
C. Blueprint research: visually rich, systematic, NotebookLM-like
```

Offer feedback choices:

```text
For each sample, mark:
- logic: clear / jumpy / repetitive / missing evidence
- density: too sparse / right / too crowded
- visual: too plain / right / too decorative
- tone: too AI / too casual / too hard / right
```

## HTML Storyboard Preview

An HTML storyboard preview is a review artifact, not automatically the final deliverable.

It should:

- follow `html-presentation-spec.md`;
- use stable slide and element anchors when feedback is expected;
- represent layout, density, and visual direction enough for review;
- avoid overbuilding animation or final polish before approval;
- keep `slides_source.md` or `slides_source.json` as source of truth.

For final editable PPTX workflows, do not rely on HTML-to-PPTX conversion for pixel-perfect output. Update the source first, then build PPTX from the stable source and approved style rules.

## Full-Deck Preview Coherence Pass

When generating a full-deck preview, full HTML preview, contact sheet, or complete storyboard, run a whole-deck coherence pass before asking the user to review visuals.

Check:

- whether the slide order still follows the chosen story spine;
- whether each slide answers the audience question raised by the previous slide;
- whether each slide sets up the next slide;
- whether section transitions have explicit bridge logic;
- whether the deck jumps between abstraction levels, topics, or time periods without explanation;
- whether any slide is redundant, misplaced, missing, or unsupported;
- whether speaker notes or transition lines are needed to make the connection clear.

Output the result as:

```text
Full-deck coherence pass:
Story spine:
Overall flow: pass / needs work
Weak page links:
| From | To | Issue | Fix |
Transition gaps:
| Slide | Needed bridge |
Reorder or rewrite actions:
| Slide | Action | Reason |
```

If the coherence pass finds material sequence problems, update `slides_source.md`, `slides_source.json`, or the page map first. Do not proceed to final PPTX production just because the preview looks visually acceptable.

## Audience Playback Review

When the user wants to judge as an audience, simulate the audience reaction for each slide or sample:

```text
Slide:
What the audience understands:
Likely confusion:
Expected next question:
Does the next slide answer it:
Adjustment needed:
```

Use this before visual production if the main risk is logic, not design.

## Representative Sample Selection

Pick samples that expose the most risk:

- cover or opening promise page;
- core argument or thesis page;
- complex data, table, chart, process, or framework page;
- one transition or section divider if pacing matters;
- one decision or recommendation page for executive decks.

Do not pick only easy pages. Sample slides should test the deck's hard parts.

## Feedback Translation

Translate user feelings into production changes:

| User Feedback | Likely Translation |
|---|---|
| "not good-looking" | visual hierarchy, spacing, art direction, or asset system issue |
| "too plain" | add visual motif, diagram language, richer layout, or better assets |
| "too crowded" | reduce visible text, split slide, move detail to notes or appendix |
| "too empty" | add proof point, implication, visual explanation, or combine weak slide |
| "not my style" | update style tokens, tone, density, or template recipe |
| "I do not know" | run audience playback and offer 2-3 concrete options |

## Review Decision Template

```text
Preview mode:
Why this mode:
Cost/time tradeoff:
Slides or sections to preview:
What the user should judge:
Fallback if user is unsure:
When to move to full production:
```

## Pass Criteria

The preview loop passes when:

- the user has seen enough to make a direction decision;
- full-deck previews have passed page-to-page coherence review or have an explicit fix list;
- visual direction, density, and layout rules are stable enough for bulk production;
- major logic or audience-confusion issues are fixed;
- source of truth is updated before final output generation;
- full HTML preview is used only when the extra cost is justified.
