# Content Density Control

Use this module when slide text is too sparse, too crowded, or mismatched to the presentation scene.

The goal is to control how much content belongs on the visible slide versus speaker notes, appendix, or source material.

## Density Levels

| Level | Visible Text | Best For |
|---|---|---|
| headline-only | one main sentence plus optional label | keynote, chapter divider, strong viewpoint |
| executive-brief | conclusion title plus 2-4 concise support points | board, executive, decision pages |
| balanced-explain | title plus diagram/table/chart and short explanation | normal business presentations |
| teaching-detail | title plus concept, example, and explanation cues | training, lecture, classroom |
| appendix-heavy | dense table, definitions, assumptions, backup detail | appendix, audit trail, source support |

## Default Mapping

| Scenario | Default Density |
|---|---|
| board update | executive-brief |
| finance analysis | balanced-explain |
| CFO or executive review | executive-brief to balanced-explain |
| classroom lecture | teaching-detail |
| public keynote | headline-only to balanced-explain |
| product demo | balanced-explain |
| appendix | appendix-heavy |

## Text Budget

Use these as defaults, not hard rules:

- headline-only: 5-18 words visible;
- executive-brief: 20-55 words visible;
- balanced-explain: 45-95 words visible;
- teaching-detail: 80-140 words visible;
- appendix-heavy: as needed, but should not be used in the main story unless approved.

## Overflow Routing

When content exceeds the density level:

- move examples to speaker notes;
- move spoken explanation, caveats, and likely objections to structured speaker notes;
- move detailed evidence to appendix;
- split one slide into two;
- convert text into diagram, table, or timeline;
- replace paragraphs with a conclusion title plus structured support.

## Underfill Routing

When the slide is too empty:

- add a visual explanation, not filler text;
- add a proof point, example, implication, or next-action box;
- combine with a neighboring weak slide;
- turn it into a deliberate chapter divider only if the pacing needs it.

## Density Decision Template

```text
Slide:
Audience:
Scene:
Density level:
Visible copy budget:
Speaker notes budget:
Speaker notes depth:
Required note types:
Appendix/support needed:
Reason:
```

## QA Questions

- Can the audience read the slide in 8-12 seconds?
- Is the slide useful without the speaker?
- Is the speaker note carrying the detail that should not be on the slide?
- Is this a main-story slide or appendix slide?
- Does density match neighboring slides, or is there an intentional rhythm shift?
