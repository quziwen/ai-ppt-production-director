# Editability Benchmark

> Version: 0.2
>
> Status: pilot protocol / first-pass and handoff comparison

This benchmark verifies production capability and downstream handoff cost. It is not a Patrick style test and does not promote a deck's one-off visual choices into permanent rules. Report first-pass quality and revision/handoff quality as separate dimensions; do not collapse them into one score.

## 1. Read-only baseline

Use a current approved deck or a purpose-built fixture as a read-only visual/content baseline. The baseline must be named in the benchmark record. Original files under the project and external delivery folder must not be overwritten, renamed, or patched by this benchmark.

The pilot copy belongs under a task-specific `_research/<pilot-name>/` folder or another explicitly separate output folder. Any native or Hybrid output must be written there; never overwrite the approved source or delivery folder.

## 2. Representative page sample

Select representative pages from the current approved deck or fixture. If the Kalkon Shanghai deck is used, use it only as a read-only baseline and record that fact. The first sample should cover, as applicable:

- a page with multiple text boxes and a clear title hierarchy;
- a page with arrows, semantic blocks, or another relationship diagram;
- a matrix/workflow page with repeated shapes and labels;
- a data-bearing table or chart, when the Brief requires one;
- a media page as an exception case, when the deck contains video or complex visuals.

The first benchmark need not regenerate a full deck. It must prove the object classes and revision tasks that the selected Brief would require.

## 3. Routes under test

At minimum compare:

1. a config-first Native route using the available presentation object model;
2. a structured source-to-DrawingML route, only when the current Deck Brief explicitly selects it.

External tools may be consulted as UX or architecture references, but they are not required production routes, runtime dependencies, or evidence of Patrick style. Any tool-specific experiment belongs under `_research/` and must not silently change this benchmark or the Skill's default route.

### Profile dimension

Run the sample under the selected delivery profile when relevant:

- `presentation-ready`: assess first-read narrative, visual hierarchy, density, and representative-page polish;
- `editable-working-deck`: assess semantic object coverage, evidence preservation, and repeatable revision;
- `final-handoff`: assess the complete source package, reports, rollback point, and another-editor handoff.

The profile changes the test emphasis, not the minimum visual or evidence gates.

## 4. Test assertions

### Package assertions

- native text runs exist for every required text object;
- native shape objects exist for required basic geometry;
- native table and chart structures exist when required;
- speaker notes exist when required;
- no unintended full-slide picture replaces a required editable page;
- image/video/complex-visual exceptions are listed by slide and object.

### Round-trip assertions

On representative pages:

1. change a title or body text;
2. move or resize a shape;
3. change one table cell if a table exists;
4. change one chart value if a chart exists;
5. save and reopen the PPTX;
6. rerun structural and visual checks.

### Visual assertions

After initial export and after every required round-trip:

- render the representative page at the target slide size;
- compare title position, font metrics, wrapping, margins, alignment, and object order with the approved page map or baseline;
- check overlap, overflow, clipping, missing labels, missing units, broken axes/legends, and unexpected full-slide pictures;
- record `pass`, `fail`, or `not-run` with a short evidence path.

Structural editability passing does not waive a visual failure.

### HTML assertions

If HTML visual editing is in scope, verify selection, text edit, object movement, data edit, save, reload, and export back to the Deck IR. A static HTML page or a source-editable file does not pass this assertion.

## 5. Revision and rework assertions

Define the task set before production. Include the applicable tasks below and do not invent a pass from a file-open check:

| Task | Minimum action | Required result |
|---|---|---|
| Text | Change a title or body sentence | Text changes, remains in bounds, and survives save/reopen |
| Number/date | Change a material number or date | New value is traceable and evidence status is reverified or marked pending |
| Geometry | Move or resize a shape | Position/size changes without unexpected overlap or clipping |
| Table | Change one cell when a table exists | Cell remains a native editable cell after reopen |
| Chart | Change one data value when a chart exists | Data path remains native and labels/context remain correct |
| HTML/IR | Apply one accepted HTML patch when HTML is in scope | Selection IDs, IR, reload, and re-export remain consistent |

Record observed duration and defects for each task. If timing was not measured, leave the observed field blank and record an estimate separately. External comparison articles may motivate this task set, but their scores and time estimates are not our benchmark baseline.

## 6. Required benchmark outputs

- a separate native/Hybrid sample PPTX;
- a rendered preview of the sample;
- a package/object inspection receipt;
- an edit-save-reopen receipt;
- an object-level Editability Report;
- an evidence register or explicit `not-applicable` record;
- a visual QA report after the final round-trip;
- a revision/rework log that separates observed time from estimates;
- a list of unsupported or provisional cases.

The benchmark status must be one of `candidate`, `pilot-passed`, `production-ready`, or `blocked`. `pilot-passed` is not the same as formal production acceptance for every future deck. A material visual failure, unresolved evidence item, or mandatory unrun check blocks `production-ready` unless a current explicit exception is recorded.
