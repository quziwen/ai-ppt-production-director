# Annotated Revision Loop

Use this loop when the user says the deck, page, tone, content, layout, color, or style is not right.

The goal is to turn subjective feedback into a specific revision plan, update the source of truth, and prevent the same issue from recurring.

For direct canvas markups, inline comments, screenshot circles, or element-level annotations, use `visual-annotation-protocol.md` first. This loop handles the broader revision process; the annotation protocol resolves exactly what object is being changed.

## Supported Feedback Forms

Accept feedback in any of these forms:

- natural language: "this does not sound like me";
- page-level notes: "slide 4 is too crowded";
- element-level notes: "make the title shorter and stronger";
- style notes: "less tech, more executive";
- color notes: "avoid purple, use colder finance colors";
- content notes: "this claim is too generic";
- screenshot or visual markup when the platform supports images;
- inline comments attached to specific elements;
- coordinate or bounding-box annotations;
- external review comments from PowerPoint, PDF, Figma, Canva, or browser screenshots.

If the current platform cannot read visual annotations directly, ask the user to describe the markups as slide number, target element or anchor ID, problem, and desired change.

## Revision Intake Format

When feedback is vague, convert it into this structure:

| Field | Meaning |
|---|---|
| slide | slide number or section |
| target | title, body copy, chart, layout, color, image, notes, transition, or whole deck |
| anchor | stable element ID, shape name, alt text, or inferred screenshot region |
| issue | what feels wrong |
| desired change | what the user wants instead |
| priority | must-fix, should-fix, optional |
| scope | one slide, similar slides, whole deck, or future decks |

Example:

```text
Slide 3 | s03.title.headline | too generic | rewrite in my direct executive style | must-fix | whole deck title style
```

## Three Revision Types

Classify each requested change before editing.

| Type | Examples | Action |
|---|---|---|
| Content Fit | wrong point, weak evidence, generic wording, not user's voice | update thesis, source, page argument, or copy |
| Visual Fit | wrong layout, color, density, typography, chart style | update visual recipe, layout, or style tokens |
| Production Fit | not editable, wrong format, broken media, overflow | update build route, source, or output files |

## User Voice Calibration

When the user says "not like me", do not only rewrite the sentence. Extract a reusable voice rule.

Capture:

- preferred directness level;
- sentence length;
- management tone;
- tolerance for slogans or metaphors;
- whether to use first person;
- whether to use financial/operational language;
- words or phrases to avoid;
- example before/after if available.

Apply the rule to the current deck and record it in the lightweight record. Do not publish private user voice examples in a public repository.

## Visual Calibration

When the user says the style, color, or layout is wrong, revise the visual system before editing slides one by one.

Capture:

- disliked visual traits;
- desired visual traits;
- palette changes;
- typography changes;
- density changes;
- chart/table treatment;
- image or illustration treatment;
- similar pages that should change together.

If the requested style conflicts with the selected template recipe, propose one of:

- update the current recipe tokens;
- switch recipe;
- create a hybrid direction;
- keep current style for this deck only.

## Revision Workflow

1. Resolve visual annotations to slide and element anchors when available.
2. Parse feedback into a revision table.
3. Confirm ambiguous or high-impact changes.
4. Update the source of truth first when one exists.
5. Patch the affected element, slide, or system rule.
6. Re-run targeted QA on affected slides and similar elements.
7. If the issue is systemic, update the voice rule, visual recipe, or page map.
8. Return a short change log and remaining open items.

## Do Not

- defend the existing draft instead of extracting the real issue;
- rewrite all slides when only one style rule needs to change;
- downgrade element-level annotations into vague page-level feedback;
- apply visual edits slide by slide when the design system is wrong;
- turn private voice samples into public examples;
- claim screenshot-level changes were applied unless the output was actually edited or rebuilt.

## Output Template

```text
Revision plan

| slide | anchor | target | issue | change | priority | scope |
|---|---|---|---|---|---|---|

System updates
- Voice rule:
- Visual rule:
- Source update:

Execution
- Changed:
- QA checked:
- Still needs confirmation:
```
