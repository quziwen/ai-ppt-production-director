# Visual co-design protocol

Purpose: help a non-designer choose a useful visual direction by seeing real pages, then preserve that choice through editable production. This is an orchestration protocol, not a Patrick style authority. Read current workspace SSOT before applying it.

## 1. Decide whether exploration is needed

- New or uncertain visual direction: infer viewing conditions from the brief and propose usually 2–3 visibly different options. Explain a recommendation and its tradeoffs in everyday language.
- Supplied template or accepted samples: inspect and reuse them. Explore only unresolved aspects; do not force a new style contest.
- Local correction: fix the affected objects and compare before/after. Preserve settled decisions elsewhere.
- Explicit deadline-first draft or delegated choice: recommend one feasible direction, build a small representative preview, and proceed within that delegation. Record that agent selection is not Patrick's personal approval.
- Storyline only: stop at that stage. Missing source access: report the gap; label any illustrative placeholders and never present them as the user's real content.

Do not ask the user to supply palette codes, font families, grid measurements, or aesthetic vocabulary. Ask only for unresolved information that changes the result, such as projection versus detailed reading. A new project may reuse a reference only when the user supplied it or an authorized current project record identifies it; do not search private historical decks by inference.

## 2. Make choices visible and comparable

After the required outline approval, choose the same real page IDs and content revision for every option. Include a viewpoint page and a dense content page; add a chart or relationship diagram when it is central or technically risky. A cover alone cannot demonstrate suitability for business content.

Create actual rendered samples in a locally available route, not only prose or a palette. An option must change meaningful hierarchy, spatial organization, density, or visual emphasis, not just its accent color. Keep conclusions, numbers, units, source notes, and must-keep content constant. If an option requires splitting a page, state that tradeoff explicitly and preserve the content mapping.

Show options side by side at comparable scale, with readable individual pages. Explain what is easy to see, what remains dense, and where each approach fits the audience. Use a whole-page view to inspect balance and detail views to inspect text; a thumbnail cannot prove text legibility. If rendering is unavailable, label proposals as unrendered and do not claim the sample gate passed.

Visual prototypes may be native slides, rendered HTML, or generated compositions. Choose a route that can realistically support the declared final editability. For precise tables, charts, and dense text, prefer real text and data in the prototype. Generated compositions can guide layout, but their lettering and numbers are never authoritative. Image generation is optional; this protocol adds no model, component library, external account, or vendor dependency.

### Finish a selectable sample set within the current budget

Before rendering, separate the requested viewing conditions and minimum deliverable from optional polish. For an open-ended request, two materially different directions on the matched representative pages are sufficient; add a third only when useful and affordable. An explicit requested count still controls. Do not expand a projection-only task into mobile/responsive testing or a full presentation.

Build the smallest complete handoff first: a local comparison entry with readable individual samples, their rendered images, and a short decision/QA record. Reuse the approved outline and existing deck records instead of recreating upstream analysis. Create the record alongside the samples, initially marking checks pending; link only to existing files. Keep content revision, source caveats, Provisional selection status, recommendation and next decision together. A generated file is not yet a passed visual gate. When using the review helper, its `comparison.html` is already the comparison entry: link that file and record the direction descriptions/recommendation separately in the short decision record or final reply. Do not build another gallery unless the requested interaction needs it.

Use four working states: create the agreed samples, render/measure them, actually inspect and correct material defects, then deliver. Keep a short pending checklist from the start; update that existing record as checks finish instead of inventing another documentation stage at the end. The final answer is part of the task, not optional work after it. Store shared required content once in the sample builder and vary composition explicitly; avoid duplicating the same text across independently authored templates. During authoring, allocate enough width/height for full titles, and use meaningful phrase breaks when wrapping is intended; do not leave single trailing characters stranded just to create a narrow title column.

If a deadline or runtime limit is available, note the start time and reserve the final portion (about one fifth as a planning starting point) for image inspection, targeted correction, record completion and the final reply. Check elapsed time after initial rendering and before each additional pass. Enter handoff when that reserve starts: fix only material defects that block the requested result and disclose unresolved ones, rather than adding cosmetic variants. Without a known limit, complete the minimum handoff before optional work. Batch the first render; after a local correction, re-render only affected samples. Once the requested set meets the applicable gates, deliver it immediately. Do not generate extra formats, rename already checked files to “final”, re-export identical content, or run another unchanged full batch just to make the handoff look more final.

Close with working preview links, plain-language differences and recommendation, the checks actually completed, unresolved defects and the user's next choice. If time or tools prevent completion, deliver the existing partial set with its exact missing checks and next action; do not label it Visual: pass or user-approved. Reducing optional scope never permits removing required content, skipping necessary inspection or overriding the visual-failure veto.

Treat closure as a short checkpoint, not a new production task: compare the required source facts with the rendered readback, inspect the actual final images, update the existing short record with the three results (`rendered`, `measured`, `viewed`) and remaining limitations, then reply with existing links. The review helper creates `HANDOFF.md` with real links and pending review fields. After checking the final images, fill its four items (actual image review, source/value check, differences/recommendation, remaining issues/next choice) in one short edit, and deliver. Reuse an existing decision record when available; do not duplicate both. Leave machine `viewed/accepted` as `not-run` and record the actual reviewer observation separately. Do not reformat the comparison page or write another validation script/long report, re-extract an already matched embedded IR, or restyle healthy content after these checks are complete. A font-metric warning by itself is not a reason to keep changing geometry: inspect the affected glyphs, record that observation and retain the warning. Repair if actual clipping is observed. When the known time reserve starts, finish this checkpoint before any optional investigation.

After local repairs, if the old/new screenshots would leave an incomplete comparison entry, make one final review manifest containing all selected final sample paths and run the existing helper once. This bounded consolidation is permitted instead of inventing a merger/gallery or manually rewriting links. Keep the earlier attempt and its failures; inspect every changed final image, retain evidence for identical unchanged images, then complete the short handoff and reply immediately.

### Reuse local rendering and review

For a Deck IR sample, use the existing adapter rather than writing an iframe wrapper or another rendering engine:

```text
node <skill>/scripts/html_visual_editor.cjs --input <deck.ir.json> --output <new-sample.html> --mode presentation
```

Omit `--mode` for the editor. Presentation mode and editor share the same IR and renderer; it does not turn the sample into native PPTX or certify E/H capabilities. For an existing HTML sample, review that file directly. Use paths explicitly available in the task; do not install dependencies or search business directories to satisfy the command.

When the task allows an existing Chrome and Playwright dependency, prepare a local review manifest next to the samples:

```json
{"width":1600,"height":900,"pages":[{"id":"direction-a-page-1","file":"a-page-1.html","selector":".stage","required_text":["The exact required title"]}]}
```

The `file` is relative to the manifest directory; all inputs stay within that directory. For an IR editor use `selector: "#slide-surface"` and, for multiple pages, `slide_id` to select the required stable page ID. Give each sample a unique `id`. Include actual must-keep phrases in `required_text` when useful; the manifest supplements rather than replaces source/data verification.

```text
node <skill>/scripts/review_html.cjs --manifest <review.json> --out <new-review-folder> --playwright <authorized-module-path> --chrome <authorized-chrome-exe>
```

The helper batches local screenshots and measurements, checks required text and chart warnings, and creates a comparison entry linking real samples and full images. It refuses existing output, records blocked requests/errors and uses a fresh local browser profile. Read the compact `QA.summary.json` first; it includes page results, missing text, problem counts/locators, bounded chart readbacks (visible categories, legend, labels, axis titles and mark geometry), and pointers to full evidence. Compare this readback with the actual source values; it is observed DOM data, not independent business verification or proof that glyphs are readable. Do not dump the complete `QA.json` or comparison HTML source into context on every successful run. Read only the affected page's detailed measurements when a specific finding needs diagnosis; truncated summary details are not absence of findings. Actually open every resulting page image, correct material defects in new versions, then update the short decision/QA record and deliver the existing links. A `warning` for ambiguous font/line metrics requires image inspection; it is not proven clipping and is not a visual pass. A helper's successful measurements alone are not Visual: pass; `viewed` and Patrick's `accepted` remain separate. No browser capability: state the missing check and deliver only the permitted partial sample, not a false visual acceptance.

## 3. Convert everyday feedback into scoped changes

| User feedback | Proposed response | What to check |
|---|---|---|
| 字大一点 | Increase the relevant text hierarchy, reflow or split as necessary | Wrapping, overflow, page-count impact; do not silently remove content |
| 别太花，稳重一点 | Reduce competing accents and decoration while preserving emphasis | Main conclusion still stands out; chart categories remain distinguishable |
| 内容别删太多 | Group, align or split; suggest notes/appendix only with clear content mapping | All must-keep content remains accessible and at a useful size |
| 太像模板了 | Choose composition from the actual comparison, process or hierarchy | Avoid cosmetic variety that obscures relationships |
| 我喜欢这页的感觉 | Inspect that page's hierarchy, spacing, palette and image treatment | Record only supported observations; adapt to current density and audience |
| 第二版，但字更大 | Keep the selected direction and adjust the named parameter | Do not restart unrelated style choices |

These are starting interpretations, not permanent visual rules. Apply low-risk, reversible adjustments and show their effect. Flag a real content, audience, or route tradeoff instead of making the user learn design terminology. If requested preferences conflict, demonstrate the tradeoff on an affected sample.

### Classify the feedback before changing the standard

Use the current instruction, approved requirement and actual result to choose the affected layer. One message may contain more than one kind; separate them in the existing revision/decision record.

| Kind | Response | What stays protected |
|---|---|---|
| Defect: output fails an accepted requirement | Link the requirement ID and observed defect; fix the earliest responsible source/layout/export layer and recheck affected artifacts against the unchanged pass condition. | Do not count an implementation error as a new user requirement, lower the target, hide a failure, or regenerate healthy unrelated pages. |
| Explicit change to this deck | Record the old/new requirement, user's confirmation, affected pages and invalidated checks. Apply an already clear authorized change without asking for the same confirmation again; clarify only material unresolved tradeoffs. | Keep valid upstream decisions and unrelated evidence. A plan approval is not automatic acceptance of the new rendered result. |
| Possible long-term preference | Keep this deck's confirmed choice local. Where proposal creation is in scope, use the existing Style Update Proposal route with evidence, applicable conditions and drawbacks. | Do not modify Constitution/other SSOT as a side effect or infer permanence from liking one sample. |

If “not professional enough” does not identify a defect or a new preference, inspect the affected sample and propose one or two concrete interpretations in everyday language. Show the effect or tradeoff; do not invent permanent numerical rules or make the user prescribe fonts and spacing. The feedback record should connect the user's words, requirement ID, classification, scoped change, invalidated evidence and recheck result. Reuse the existing Brief, `style_contract` and QA links; no separate feedback-standard ledger is required.

At a deadline or revision-count limit, complete authorized material repairs within scope or report what remains and the needed decision. Never mark a failed must-have as optional simply to finish. Conversely, do not restart three rounds of discovery for an already approved correction.

## 4. Lock a deck-local design decision

Extend the current deck's existing `style_contract` or equivalent record; do not create competing copies of visual tokens. Record:

- content/page-map revision and sample page IDs;
- actual preview paths and versions;
- selection status: pending, Patrick-confirmed, or agent-selected under explicit delegation;
- user's feedback and the concrete changes it produced;
- the deck's chosen palette, font hierarchy, spacing/grid, density, image and chart treatment, plus font availability/fallback;
- each decision's basis: SSOT-supported or deck-local Provisional;
- allowed editable-object/media exceptions and unresolved reconstruction constraints;
- affected pages and any acceptance invalidated by later changes.

Reference tokens from readable SSOT instead of duplicating them. For deck-local parameters, save the values actually used by the renderer so the next session can reproduce them. Passing technical QA does not turn a Provisional preference into permanent Patrick style. Potential reusable style findings follow the entrypoint's Style Update Proposal process and await Style Lab decision.

## 5. Produce and compare

Approved text/data controls content; approved visual samples control layout and hierarchy within the SSOT. Preserve native text, shapes, tables and charts required by the editability contract. Reconstruct independent image assets where feasible. If a complex visual cannot be reconstructed well, expose that specific exception and propose a replaceable asset or revised treatment; do not silently flatten the full slide.

Check a representative exported result early, before expanding the deck. Compare approved samples with actual final-carrier renders, checking font substitution, font size, line breaks, object positions, alignment, spacing, chart labels, clipping and hierarchy. Check that each series has an unambiguous visual encoding and legend mapping, and that gridlines do not run through numeric labels. Explicit source styling may require a scoped correction or documented exception; do not silently call it visually passed. Use the original content to verify numbers and wording; do not recover authoritative text from an image. Account for intended content changes when comparing renders rather than optimizing a raw pixel score.

After bulk production, inspect the full contact sheet for consistency and rhythm and review each page for material defects. A uniform palette alone does not establish visual quality. Repeat the affected comparisons after HTML edits, PPTX export or PowerPoint save/reopen; do not claim those steps ran if they did not.

Extend `visual_qa_report` with reference version, rendered artifact/environment, inspected pages, observed differences, severity, repair and recheck evidence. Separate technical render checks from Patrick's preference acceptance. Apply the existing visual-failure veto; do not introduce a second competing QA standard.

Record evidence separately: `rendered` (actual screenshots/pages), `measured` (DOM/geometry/font metrics), `viewed` (the image/page actually opened for inspection, page IDs and tool/human review record), and `accepted` (Patrick's real feedback). Generated screenshots and a script reporting zero overflow do not prove that anyone viewed the images. If image inspection is unavailable, mark that check `not-run` / `external-unverified`, describe the missing action and do not claim Visual: pass. For browser measurements, wait for fonts and stable layout and retain the measured values; a failed check without those values is unresolved, not proof of either a font defect or success.

## 6. Keep learning portable and proportionate

When borrowing from a design skill or article, identify the concrete mechanism it improves: choosing a direction, producing layout, or inspecting output. A web UI library is not automatically a slide design system. Transfer only relevant ideas; do not install or bind the source tool merely to borrow a method.

Use an existing deck's source, style contract, accepted samples and issue log to resume batches across sessions. Keep sample and content versions linked. Do not require the user to restate preferences already recorded. Record new preferences at deck scope; propose long-term promotion only with evidence, applicable scenarios and possible downsides.

For workflow evaluation, compare the same content against the earlier process. Observe time until direction selection, repeated aesthetic clarifications, visual defects after export, and preserved content/editability. Label observations versus estimates and user acceptance versus agent judgment. Successful packaging alone does not validate aesthetic improvement.
