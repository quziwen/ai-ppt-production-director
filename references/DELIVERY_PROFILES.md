# Delivery Profiles

> Version: 0.1
>
> Status: candidate workflow contract / P0–P2 pilot

This file defines delivery intent and review-round profiles. It does not define Patrick's permanent style, palette, typography, slide patterns, or tool preference. The profile changes production emphasis and evidence requirements; it never overrides the current SSOT, Deck Brief, source boundary, or QA veto.

## 1. Choose the profile before rendering

Record one profile in the Deck Brief and route manifest:

| Profile | Use when | Primary optimization | Minimum evidence beyond ordinary deck QA |
|---|---|---|---|
| `presentation-ready` | One-off or low-round presentation | First complete narrative and visual read | Approved outline, source/evidence boundary, visual QA, and declared carrier/editability |
| `editable-working-deck` | Two or more review rounds or active co-editing | Stable semantic objects, source fidelity, predictable revision | Native-object coverage, representative edit-save-reopen, evidence register, and revision-task result |
| `final-handoff` | Another person or organization will receive and reuse the deck | Reproducible editing, verification, and safe handoff | Complete source/route/evidence records, rollback point, revision log, and final round-trip visual QA |

The profile is not a quality ranking. A `presentation-ready` deck may still be Native/Hybrid E2, and an `editable-working-deck` may still fail visual QA. Do not use the profile to excuse a known defect.

## 2. Selection rules

1. If the user explicitly names the intended use, use that choice and record it.
2. If the deck is for a single external talk and no later editor is identified, recommend `presentation-ready`.
3. If the user expects internal review, customer review, or more than one change round, recommend `editable-working-deck`.
4. If the output will be delivered as a reusable source package, recommend `final-handoff`.
5. If both presentation and handoff matter, choose `final-handoff` and record the presentation quality as a separate acceptance dimension.
6. If no PPTX editability target is given, a PPTX request should recommend `Native / Hybrid E2`; this is a capability recommendation, not a Patrick style rule.

## 3. Profile-specific workflow

### `presentation-ready`

- Confirm the Storyline and page map before rendering.
- Give extra attention to conclusion titles, spoken transitions, information density, visual hierarchy, and the first-read of representative pages.
- Keep the source/evidence register for every factual or data-bearing page; visual simplification must not remove required context.
- If the user later requests edits, create a new IR/version rather than patching an untracked exported artifact.

### `editable-working-deck`

- Treat text, shapes, tables, charts, and notes named in the Brief as semantic objects, not screenshot content.
- Preserve data-bearing source context and mark every redraw or recomputation.
- Define a small representative revision-task set before full production: text, number/date, geometry, and table/chart data when present.
- Run the task set after export and after at least one accepted HTML/IR edit when HTML is in scope.

### `final-handoff`

- Deliver or store the current Deck IR/source, approved page map, route manifest, evidence register, visual QA report, object-level Editability Report, and limitations.
- Include the final tested revision tasks, actual observed time where measured, and any known manual repair.
- Include a rollback point and identify the next editor or owner.
- Do not call the deck “fully editable” when media or complex-visual exceptions remain; list them by slide and object.

## 4. Revision-task recording

Record each task with the distinction below:

```text
task_id:
target_slide_or_object:
requested_change:
input_state:
start_time:
end_time:
observed_seconds:        # leave blank when not measured
estimate_seconds:        # use only when explicitly an estimate
data_reverification: verified / pending / not-run / not-applicable
visual_result: pass / fail / not-run
editability_result: pass / fail / not-run
manual_repair:
notes:
```

Do not copy a third-party article's score or time estimate into this record. External comparisons can motivate a task set, but our benchmark must report our own observed evidence.

## 5. Gate result

The delivery record should report the profile and five separate outcomes:

```text
narrative: pass / fail / not-run
evidence: pass / fail / not-run
visual: pass / fail / not-run
editability: pass / fail / not-run
handoff: pass / fail / not-run
visual_failure_veto: true / explicitly-confirmed-exception
```

Any material visual failure or an unrun mandatory check blocks delivery by default. A current explicit exception must name the defect, impact, owner, and acceptance decision.
