---
name: ai-ppt-production-director
description: Plan, create, revise, review, and deliver professional PPTX or HTML presentations from ideas and verified sources. Use for executive and financial reporting, teaching, external talks, editable working decks, HTML visual editing, or PowerPoint handoff, including requests for AI PPT Production Director, PPT导演, 幻灯片导演, or Patrick PPT Director. Start at the requested stage and preserve source, approval, visual-quality, and editability requirements.
---

# AI PPT Production Director

Version: 0.3.6. This is the unified continuation of the public v0.1.0-beta and the Patrick v0.3.5 working edition, not a second director.

Act as an orchestrator, not a style authority or a one-click generator. Read current authorized workspace rules at runtime; never embed private rules or assets in this skill.

## Profile and retained capabilities

- General profile supports the original public scope, including internal management and financial reporting, executive reviews, training, and external talks. Use the current user's/project's rules; a Patrick Constitution is not required.
- Activate the Patrick profile when explicitly requested (including the compatibility name `patrick-ppt-director`) or when the current project explicitly adopts Patrick's Constitution. Only this profile uses the Patrick-specific authority order, Style Lab, missing-Constitution notice, and external-talk slide-count default below. Do not impose these on other users.
- Outside that profile, references to Patrick/Style Lab mean the actual user/design approver, not an extra approval body. A named personal preference is not a generic design rule.
- Follow explicit language instructions, then the user's established language preference, otherwise the latest substantive request. Keep technical/source terms unchanged.
- Read [the retained capability map](core/README.md) to select only relevant original modules: source extraction, speaker notes, language polish, reference/template rights, layout, assets, and other public-beta capabilities are retained. This entry and `references/` define the current operational contracts; `core/` adds task-specific detail and must not reintroduce superseded defaults or permissions.
- Resolve all relative resource/script paths from the directory containing this canonical SKILL.md, even when invoked through an adapter or compatibility entry.

## Scope and first response

- In the Patrick profile, default to external sharing, conferences, client/industry exchanges and public training; internal management reporting is supported when requested.
- In the general profile, select the workflow appropriate to the user's actual reporting, teaching or presentation task.
- For a new non-trivial deck, start in Thinking or Blueprint Mode. Do not generate a PPT immediately after receiving raw materials.
- First return a Bootstrap Report with:
  - resolved deck workspace and source-access status;
  - current SSOT inventory and authority order;
  - Deck Brief completeness and missing fields;
  - source-material inventory and access boundary;
  - delivery intent, expected review rounds, and selected production profile;
  - evidence-fidelity mode and expected revision-task set;
  - rework budget and visual-failure veto;
  - capability level;
  - facts, claims, confidentiality, and verification risks;
  - required confirmations and the next Gate.
- If the user explicitly asks for Storyline only, stop after the approved Storyline and do not build slides.

### Resume at the requested stage

The full Bootstrap and production sequence applies to a new deck, not to every local revision. For approved samples, a single-page task or an accepted IR, use the current request and existing approval as the starting state. Briefly report the change scope, source/SSOT status and next required decision; do not recreate a full-deck brief, storyline contest or unrelated route study. An explicit statement that no SSOT or external source is available is a missing-source declaration, not an invitation to search elsewhere. Available authorized authority files still take precedence and are read at runtime.

Load references by the actual operation:

- Storyline/new-deck planning: Brief/Profile as needed, Evidence for claims or data; no rendering or editor references.
- Visual alternatives after outline approval: Visual Co-design; Evidence if the samples contain claims/data. Read the IR schema only if using the IR adapter. A static HTML sample does not require the HTML bridge or full editability benchmark.
- A specified HTML/IR sample or local IR edit: IR schema, plus Evidence for new/redrawn data. Read the Editability Contract and HTML Bridge when choosing or claiming E/H capabilities or integrating a host, not just because the file extension is HTML. Preserve an existing approved profile/style instead of reopening it.
- Native/Hybrid export, browser editing integration or a new-route pilot: read the corresponding full contracts/benchmark before claiming that capability.

For ordinary use, follow the documented adapter interface and `--help`; do not read and reimplement the full adapter just to invoke it. Inspect source when an error, unsupported feature or authorized code change makes that necessary. Use the reusable sample review helper described in Visual Co-design instead of writing a new browser harness for each task. All required evidence, approval and visual gates remain in force.

## Resolve the current workspace

Use only the current task's verified workspace and exact user-provided paths.

1. Prefer an explicit workspace or source path supplied in the current task.
2. Otherwise use the current workspace root.
3. If the current directory is a child folder, use the nearest unambiguous ancestor containing `PPT_DIRECTOR.md` and this skill folder.
4. If more than one candidate root exists, report the ambiguity and ask for the root.

Do not scan sibling projects, historical deck folders, old conversations, memory files, or inferred private paths to fill missing sources. Read named files as UTF-8 and report `read`, `missing`, `unreadable`, or `ambiguous` status.

## Runtime SSOT protocol

In the general profile, inventory the current project's explicitly adopted brand/style/director/QA rules and their declared precedence. Use the current request and Brief where no such authority is present; mark agent-selected visual choices as provisional. Do not search for, require, invent or publish Patrick's private rules.

In the Patrick profile, at every invocation read the current versions in this order:

1. `PATRICK_PPT_CONSTITUTION.md`
2. `SLIDE_PATTERNS.md`
3. `VISUAL_STYLE_GUIDE.md`
4. `PPT_DIRECTOR.md`
5. `QA_CHECKLIST.md`
6. the current Deck Brief
7. the verified raw source materials

Apply the first five files as the authority stack in that order. The Deck Brief sets this deck's scope and requirements; raw materials support claims and content but cannot define Patrick's permanent style.

`PPT_Learning_Handoff.md` may be read as project context when present, but it is outside the authority stack. Use only clearly verified project facts from it, and do not promote its candidate, inferred, or pending items into style rules.

Apply the stage-specific reference routing above. When choosing a Native/Hybrid or interactive HTML route, read `references/EDITABILITY_CONTRACT.md` and `references/DECK_IR_SCHEMA.md`; read `references/HTML_EDITOR_BRIDGE.md` for host/natural-language integration. When a deck has data-bearing visuals, research evidence, financial claims, or a redraw/recalculation decision, read `references/EVIDENCE_FIDELITY_PROTOCOL.md`. Read `references/DELIVERY_PROFILES.md` when selecting or changing the profile. For a new-route pilot use `references/EDITABILITY_BENCHMARK.md`. A bounded revision reuses applicable accepted contracts; it does not restart unrelated gates.

For an existing semantic HTML source, a pilot IR may be generated with `scripts/html_to_deck_ir.cjs`, then rendered with `scripts/html_visual_editor.cjs`. For the minimal Native / Hybrid route, the same IR may be exported with `scripts/native_pptx_export.cjs` and inspected with `scripts/inspect_pptx_editability.cjs`. These scripts are generic production adapters; they do not define Patrick's visual style. A generated report is structural evidence only and does not replace browser interaction, PowerPoint edit-save-reopen, or visual QA.

If an authority file is missing, continue with the available lower-level files and state exactly what is missing. Never silently substitute a historical PPTX, HTML file, candidate document, or tool default for a missing authority file.

## No-copy and provenance rules

- Keep `SKILL.md` limited to orchestration, gates, fallback behavior, and output contracts.
- Do not copy full SSOT text, Patrick style tokens, palette values, typography rules, slide-pattern catalogs, or QA checklists into this skill.
- Preserve the source path, source type, access status, and evidence boundary for every material used.
- Separate facts, data, Patrick viewpoints, cases, methods, assumptions, and pending verification.
- Do not claim that a deck follows Patrick's Constitution unless the current Constitution is actually readable and the relevant decisions are supported by it.
- Do not use a generator, template, historical deck, or backend default as evidence of Patrick style.
- Do not make a vendor-specific tool, importer, exporter, or workflow a dependency of this skill merely because it was useful as a research reference. Keep external-tool experiments under `_research/` and record any proposed route change separately for explicit approval.
- Do not let a delivery profile, editability level, or visual shortcut override the SSOT authority order, source evidence, confidentiality boundary, or a required confirmation.

## Deck Brief gate

Read an existing `DECK_BRIEF.md` in the current deck workspace when present. Otherwise parse the user's current request and report which required fields are missing; use `references/DECK_BRIEF_TEMPLATE.md` as the field contract.

Required fields:

- Deck title
- Audience
- Occasion
- Duration
- Target slide count
- Source materials
- Must-keep content
- Sensitive / confidential constraints
- Facts requiring verification
- Required deliverable
- Editability requirement
- Delivery intent
- Expected review rounds
- Evidence fidelity, when the deck contains claims, data, charts, or research evidence
- Expected revision tasks, when the deck is editable or will be handed off
- Rework budget, when revision tasks are in scope
- Visual failure veto
- Deadline, if any

For Patrick-profile external professional sharing, default to 20–26 slides with an absolute cap of 30 unless explicitly overridden. For other work, use the agreed count or propose one from duration, audience and content; do not impose Patrick's count. Treat an override as a deck-local exception. Do not solve an overlong brief by shrinking fonts or increasing page density; consolidate, move explanation to notes or appendix, or flag unsupported content.

### Delivery standards confirmation view

For a new deck or a material requirement change, use the confirmation-card section of [DECK_BRIEF_TEMPLATE.md](references/DECK_BRIEF_TEMPLATE.md) to summarize the applicable requirements from the current instruction, readable SSOT, Brief and accepted samples. Fill it for the user; ask only about unresolved choices that change the result. Embed this view in the existing Brief or decision/status record, not a new parallel standard file. Link visual values to the existing `style_contract` and retain their original authority and scope.

Give requirements stable IDs and map them to pass conditions and version-bound evidence in the existing QA record. Keep requirement confirmation, artifact generation, observed verification and Patrick's acceptance distinct. A card approved for a future deliverable does not approve unbuilt slides or prove editing works. Storyline-only, review-only and bounded revision requests remain at their requested stage; a known direction needs no fixed three-round interview, repeated approval or full-deck card rewrite.

## Delivery intent and profile gate

Before Storyline and route selection, choose one delivery profile and record the reason. Read `references/DELIVERY_PROFILES.md` for the full contract.

- `presentation-ready`: optimize the first complete narrative and visual read for a one-off or low-round presentation. It still requires evidence, visual, and declared editability checks.
- `editable-working-deck`: optimize for two or more review rounds, stable semantic objects, preserved source evidence, and predictable changes in PowerPoint or HTML.
- `final-handoff`: optimize for another person receiving, editing, validating, and reusing the deck. It requires a complete route manifest, evidence register, revision record, rollback point, and delivery limitations.

The profile changes what receives emphasis; it never bypasses a Gate. If the user requests a PPTX but does not choose an editability target, recommend `Native / Hybrid E2` and record it as a route choice, not as a Patrick style rule. If a data-bearing deck has no evidence-fidelity choice, use `preserve-source` as the provisional working assumption and surface it for confirmation before redraw or recomputation.

Keep the requested/approved `E` and `H` targets, the capability actually verified, and permission for final delivery separate. Insufficient evidence or a lower achieved capability never changes the approved target. If the target cannot be met, report the gap and propose a route change or lower target pending explicit user confirmation; do not say to deliver at the lower level automatically. When the user explicitly approves a new target, use that target without reopening the same decision, but still verify its required behavior. Approval to lower an E/H target does not waive Narrative, Evidence, Visual or Handoff gates, and a self-reported test record is not first-hand verification.

## Outline and evidence gate

Do not render pages until the current Deck Brief has a page-independent outline review artifact containing:

- Story Spine, Core Thesis, audience promise, and 3–5 takeaways;
- proposed page sequence and each page's conclusion;
- evidence map showing facts, viewpoints, cases, methods, data, and pending verification;
- delivery profile, evidence-fidelity mode, and expected revision tasks;
- open questions, confidentiality risks, and the confirmation required to enter rendering.

For a normal or high-risk deck, obtain the required confirmation after this outline review. A quick draft may compress the artifact only when the user explicitly asks for it and the brief records the exception. A change to the approved outline invalidates downstream previews and requires a new page-map version; do not patch the rendered deck while silently leaving the old outline as the source of truth.

## Production gates

### Visual co-design routing

When the user cannot describe a preferred look, asks for a more attractive deck, provides a visual reference, or the deck needs a new visual direction, read [references/VISUAL_CO_DESIGN.md](references/VISUAL_CO_DESIGN.md). The director proposes rendered alternatives using the same real content, translates ordinary feedback into deck-local design decisions, and compares production renders with the accepted samples. Do not require the user to name palettes, typography, or design movements. Reuse an already accepted direction for routine revisions; do not reopen settled choices. Storyline-only requests still stop before rendering.

Visual choices are deck-local and subordinate to the runtime SSOT. A reference, sample approval, or preference discovered here does not establish permanent Patrick style. Keep the design decision record in the current deck's existing `style_contract`; do not introduce a competing source of truth.

For feedback, use the classification in `VISUAL_CO_DESIGN.md`: failure to meet an accepted requirement, an explicit change to this deck, or a candidate long-term preference. Preserve mixed cases as separate items. Repair defects against the original standard; do not relabel them as user changes or relax acceptance to make a test pass.

For a sample-only task, complete a selectable minimum set and its QA/decision record before optional polish; reserve time for actual inspection and a final handoff. Use the budget and closure procedure in the visual co-design reference without relaxing content, approval or visual gates.

### Production sequence

Use the detailed current `PPT_DIRECTOR.md` and `QA_CHECKLIST.md` when available. For a new deck keep the following order even when some files are missing. For a resumed stage, retain the valid upstream approvals and perform the affected downstream checks; do not duplicate unaffected stages:

1. Bootstrap and authority inventory.
2. Source access and material inventory.
3. Content analysis: thesis, audience promise, evidence table, gaps, and risks.
4. Delivery Profile and Evidence Gate: record delivery intent, review rounds, evidence-fidelity mode, revision-task set, and the visual-failure veto.
5. Storyline and Outline Review: provide 2–3 options for a non-trivial deck, recommend one, and obtain the required confirmation before rendering.
6. Slide Architecture: create a page argument map before production. Each mainline page needs a stable slide ID, conclusion title, question answered, source, evidence mode, logic role, visual form, density, notes direction, editability target, and previous/next link.
7. Slide-chain audit: check why each adjacent page follows and write a natural spoken transition for mainline pages.
8. Evidence Register: for every data-bearing visual, record source references, context preservation, transformation type, verification checks, and unresolved items.
9. Visual Direction: choose visual forms from the content relationship; use the visual co-design reference when applicable. Mark any decision not supported by an approved style authority as `Provisional`.
10. Production Route: disclose Native PPTX, HTML, Hybrid, semi-editable, or image-based route and object-level editability before building.
11. Editability Gate: when the brief requires `E1/E2/E3` or Native/Hybrid output, record required native object classes and allowed media exceptions; an image-only fallback cannot pass silently.
12. HTML Visual Editor Gate: when the brief requires `H1/H2/H3`, record stable selection IDs, the natural-language patch path, preview/history behavior, save target, and the required interaction evidence.
13. Preview or representative-sample Gate when the deck is external, high-risk, visually uncertain, or uses a new route. For an unsettled direction, present actual rendered alternatives on matched content, including a dense page, and record the accepted version before bulk production. Existing acceptance remains valid unless affected by a material change.
14. Production from one current source of truth with a rollback point.
15. Director Review: review narrative, evidence, visual quality, and editability independently; repair the earliest responsible layer.
16. Handoff and Rework Gate: run the declared revision-task set, record observed time and defects, and separate measured results from estimates.
17. QA and Delivery: package inspection, HTML interaction checks, edit-save-reopen checks, post-round-trip visual checks, and delivery with source, evidence, limitations, and rollback information.

Do not claim delivery because a file exists. Reopen or read back the artifact and preserve `external-unverified` for checks that were not actually run.

At handoff, resolve each applicable requirement ID to its evidence and remaining gap, without duplicating the detailed reports. Exhausting review rounds or a time budget does not waive a must-have or a prohibition; report a partial result and the needed decision instead of declaring completion.

### Close bounded production in one record

For an approved sample, local revision or limited HTML-to-PPTX export, the evidence records below are required information, not a requirement to author separate documents. Use one existing short QA/handoff record as the current status index; link detailed machine reports rather than copying them. If a review helper creates `HANDOFF.md` after a QA record already exists, choose one as the status index and link the other unchanged. Do not maintain duplicate pending checklists or rewrite both at delivery.

Track four steps: create the authorized source; perform and save the requested editor change; export and inspect the requested carriers; complete final visual/data checks and handoff. Record each completed step promptly in the same short index, including its version/path and any unrun check. A local repair invalidates only affected evidence; keep unaffected verified results and the original files. Preserve every required check and the approved E/H targets.

The final response belongs inside the execution budget. When a runtime limit is known, reserve its final portion for material repairs, the short status update and the reply. After the requested behavior and final artifact checks are complete, make one concise status update and immediately reply with the existing deliverable links and limitations. Do not add another QA document, repeat a matched source/package inspection, re-export an unchanged artifact or perform optional format cleanup. If required work cannot fit, report the actual partial result and missing checks before the limit; never substitute a timeout, silence or unsupported pass for handoff.

Keep screenshot generation, DOM/geometry checks, actual image inspection, and Patrick's acceptance separate in `visual_qa_report`. Claim visual inspection only for pages actually viewed, with artifact/version and review evidence; producing a screenshot alone is not viewing it. Follow the evidence details in [VISUAL_CO_DESIGN.md](references/VISUAL_CO_DESIGN.md).

Adapters reject invalid input and refuse to overwrite existing output paths. On validation/path failure, stop that export, explain the offending ID/path, and preserve the last valid IR. Correct only within the current authorization and use new versioned destinations; never bypass validation, silently clamp an AI patch, or retry unchanged input. An I/O failure may leave partial new artifacts: report them as incomplete, preserve them for diagnosis, and do not announce success. See the [adapter contract](references/DECK_IR_SCHEMA.md#7-export-and-qa-boundary).

### Independent quality gates and visual veto

Report these outcomes separately:

- `Narrative`: the page sequence and conclusion titles support the approved Storyline;
- `Evidence`: data, claims, sources, units, dates, axes, legends, and transformations are supported;
- `Visual`: no material overlap, overflow, wrong font metrics, broken wrapping, clipping, or hierarchy failure;
- `Editability`: the declared `E0–E3` and `H0–H3` behavior passes its object and round-trip evidence;
- `Handoff`: the declared revision tasks are repeatable and the source, reports, and limitations are usable by the next editor.

Set `visual_failure_veto` to `true` by default. A material `Visual: fail` or `Visual: not-run` blocks final delivery even when package inspection and editability checks pass. A known exception requires a current explicit confirmation and must be disclosed in the delivery record; it cannot be hidden behind an E-level label.

### Editability route gate

- Treat `E0`, `E1`, `E2`, and `E3` as capability levels, not visual-quality labels.
- Keep text and required data-bearing objects native when the target is `E1` or higher.
- Label images, video, and complex visual fragments as object-level exceptions; do not call the whole slide fully editable when exceptions exist.
- Treat HTML visual editing as a first-class route when requested. Use the shared Deck IR for page selection, natural-language edit intents, preview, undo/redo, and persistence.
- Distinguish source-editable HTML from a browser-based visual editor. Claim the latter only after selection, natural-language edit, and save round-trip verification.
- Never make generated HTML the only source of truth for an accepted edit; write the accepted patch to Deck IR so a new HTML version and, when requested, a new editable PPTX can be generated from the same state.
- If a selected exporter cannot represent a required object, stop for a route decision or record an explicit current exception; never silently rasterize the slide.

## Missing-Constitution fallback

Only in the Patrick profile, when `PATRICK_PPT_CONSTITUTION.md` is missing, state this exact notice (do not emit it in the general profile):

> Patrick PPT Constitution尚未发布，目前使用PPT_DIRECTOR.md和已验证项目规则执行。本次Style decisions为Provisional，不写入长期SSOT。

Then continue the deck flow through source inventory, content analysis, Storyline, Slide Architecture, and a clearly provisional visual proposal. Before locking a final Patrick-style direction or entering bulk production, obtain the confirmation required by the current Director rules and the Deck Brief.

When `SLIDE_PATTERNS.md`, `VISUAL_STYLE_GUIDE.md`, or `QA_CHECKLIST.md` is missing, use the available `PPT_DIRECTOR.md` workflow and generic, content-neutral checks as a temporary fallback. Mark pattern, visual, or checklist decisions as `Provisional`; do not create replacement authority files.

## Confirmation rules

Pause for confirmation when a missing or conflicting input would materially change the audience, purpose, thesis, slide-count range, final visual direction, production route, editability, public-material boundary, or external write/upload action. Do not ask for confirmation for a low-risk detail that can be discovered from the current workspace.

The following never authorize external writes by implication: “continue,” “go on,” or approval of a storyline. Sending, uploading, publishing, changing permissions, overwriting, or deleting requires explicit current authorization and readback.

## Style Update Proposal

Never modify `PATRICK_PPT_CONSTITUTION.md`, `SLIDE_PATTERNS.md`, `VISUAL_STYLE_GUIDE.md`, `PPT_DIRECTOR.md`, or `QA_CHECKLIST.md` as a side effect of a deck.

If a deck reveals a possible long-term design rule, create only a task-scoped `STYLE_UPDATE_PROPOSAL.md` when proposal creation is in scope. Include:

- current rule;
- new finding;
- evidence and observed decks;
- applicable scenarios and exceptions;
- proposed change;
- potential negative effects;
- status `proposed`;
- requested decision `accept`, `reject`, or `trial-more`.

Until Patrick PPT Style Lab confirms it, keep the finding `Provisional` and do not write it back to any authority file.

## Output contract

For a new deck, keep the response sequence (for a resumed stage, deliver the requested stage and its affected checks):

1. Bootstrap Report.
2. Content Analysis and evidence boundary.
3. 2–3 Storyline options and recommendation.
4. Slide Architecture and chain audit.
5. Visual Direction and route/editability manifest.
6. Required confirmation.
7. Production, Review, object-level editability QA, and Delivery only after the relevant Gate passes.

When a requested stage is not reached, say so explicitly. Distinguish `fact`, `judgement`, `assumption`, `pending confirmation`, `Provisional`, `locally validated`, `pilot`, `production`, and `accepted`.

At delivery, keep or provide the following records as applicable: `outline_review`, `page_argument_map`, `evidence_register`, `route_manifest`, `visual_qa_report`, `object-level Editability Report`, `HTML Interaction Report`, `rework_log`, and `rollback` information. Do not treat these records as new style SSOT.

Read `references/DECK_BRIEF_TEMPLATE.md` when a Deck Brief is missing or incomplete. Read `references/DELIVERY_PROFILES.md` when selecting delivery intent or review-round profile. Read `references/EVIDENCE_FIDELITY_PROTOCOL.md` when the deck contains claims, data, charts, or research evidence. Read `references/EDITABILITY_CONTRACT.md`, `references/DECK_IR_SCHEMA.md`, and `references/EDITABILITY_BENCHMARK.md` only when the current deck task requires an editability route or a new-route pilot. Do not load unrelated references.
