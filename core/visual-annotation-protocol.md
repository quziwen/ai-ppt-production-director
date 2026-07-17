# Visual Annotation Protocol

Use this protocol when the workflow needs Claude Design / Open Design-style targeted edits: the user clicks, marks, circles, or comments on a specific place in the deck and expects the AI to change that exact element.

This is stricter than a page-level revision loop. It requires stable element anchors so feedback can be applied surgically instead of regenerating the whole slide.

## Principle

Every production-ready deck should be comment-addressable.

The agent should be able to answer:

- which slide is being commented on;
- which element is being targeted;
- what source content produced that element;
- what design token or layout rule controls it;
- whether the change affects one element, one slide, similar elements, or the whole deck.

## Anchor Model

Use stable IDs for meaningful slide elements.

Recommended ID format:

```text
s{slideNumber}.{elementType}.{semanticName}
```

Examples:

```text
s01.title.headline
s01.kpi.revenue_growth
s03.chart.timeline
s04.table.root_causes
s07.callout.board_decision
s10.footer.page_indicator
```

Element types:

- `title`
- `subtitle`
- `body`
- `kpi`
- `chart`
- `table`
- `image`
- `video`
- `callout`
- `quote`
- `shape`
- `footer`
- `notes`

## HTML Deck Requirements

For HTML decks, add machine-readable anchors:

```html
<section class="slide" data-slide-id="s03">
  <h1 data-element-id="s03.title.headline">Delivery has slipped by X months</h1>
  <div class="timeline" data-element-id="s03.chart.timeline"></div>
</section>
```

If a visual review mode is generated, it may display temporary annotation labels, but labels should not appear in the final presentation unless requested.

## PPTX Requirements

For PPTX decks, use the strongest anchor available in the toolchain:

- shape name;
- alt text;
- speaker-note mapping;
- slide source mapping;
- exported screenshot plus bounding box fallback.

Recommended source mapping:

```json
{
  "slide_id": "s03",
  "elements": [
    {
      "element_id": "s03.title.headline",
      "type": "title",
      "source": "slides_source.md#slide-3-title",
      "pptx_anchor": "shape-name-or-alt-text-if-available"
    }
  ]
}
```

If the PPTX tool cannot preserve shape names or alt text, keep an external `annotation_map.json`.

## Screenshot / Image Markup Fallback

When the user provides a marked screenshot, map the mark to an element using:

- slide number;
- approximate bounding box;
- nearby text;
- visual role;
- source mapping.

Use this fallback format:

```json
{
  "slide_id": "s03",
  "bbox": [0.12, 0.18, 0.78, 0.31],
  "nearest_text": "Delivery has slipped",
  "inferred_element_id": "s03.title.headline",
  "confidence": "medium"
}
```

Coordinates should be normalized from 0 to 1 so they are independent of screenshot resolution.

If confidence is low, ask one targeted clarification before editing.

## Comment Object

Convert every annotation into a comment object:

```json
{
  "comment_id": "c001",
  "slide_id": "s03",
  "element_id": "s03.title.headline",
  "target_type": "title",
  "comment": "This title sounds too slogan-like. Make it more like a direct finance executive briefing.",
  "requested_action": "rewrite",
  "scope": "similar-title-style",
  "priority": "must-fix",
  "status": "open"
}
```

## Surgical Edit Workflow

1. Resolve the annotation to a slide and element anchor.
2. Classify the requested action: rewrite, move, resize, recolor, restyle, replace, simplify, add, remove, or explain.
3. Identify whether the change is local or systemic.
4. Update the source of truth and anchor map.
5. Patch only the affected element when possible.
6. Re-render or regenerate the affected slide.
7. Run targeted QA on the changed element and similar elements.
8. Mark the comment resolved or list the blocker.

## Scope Rules

| Scope | Meaning | Example |
|---|---|---|
| element-only | change just the selected object | "make this callout shorter" |
| slide-only | change the selected slide | "make this slide less crowded" |
| pattern | change similar elements | "all section headers should be shorter" |
| deck-wide | change the system | "remove the purple startup style everywhere" |
| future-default | remember as future preference | "my style is direct finance executive briefing" |

Do not apply a deck-wide change from a local annotation unless the user asks for that scope or the issue is clearly systemic.

## Review UI Pattern

When the environment supports it, create a review artifact:

- slide preview or contact sheet;
- visible anchor labels in review mode;
- comment list linked to anchors;
- resolved/open status;
- exportable `annotation_map.json`;
- optional before/after screenshots.

When the environment does not support a canvas, simulate it with:

```text
Slide 3 / s03.title.headline:
Comment: ...
Action: ...
Scope: ...
```

## Do Not

- treat all comments as page-level feedback;
- regenerate the entire deck when one anchored element can be patched;
- lose comments when the artifact changes;
- remove anchor IDs during cleanup;
- leave review labels visible in final output;
- claim pixel-level targeting if the platform only received vague text.
