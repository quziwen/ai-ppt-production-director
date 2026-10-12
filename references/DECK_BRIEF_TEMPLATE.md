# Deck Brief Template

> 本文件是单次 Deck 的输入模板，不是 Patrick 风格 SSOT，也不应承载长期视觉规则。

## Required fields

- Deck title:
- Audience:
- Occasion:
- Duration:
- Target slide count: use the agreed count; only Patrick-profile external talks default to `20–26`, capped at `30` unless explicitly overridden. Other scenarios derive the proposal from audience, duration and content.
- Source materials:
  - path or attachment:
  - access status:
  - owner / permission boundary:
- Must-keep content:
- Sensitive / confidential constraints:
- Facts requiring verification:
- Required deliverable: `Storyline / Blueprint / PPTX / HTML / Hybrid / other`
- Editability requirement: `native-editable / semi-editable / image-based / not applicable`
  - target level: `E0 / E1 / E2 / E3` (`E2` recommended when a PPTX is requested and Patrick has not overridden it)
  - final carrier: `Native PPTX / Hybrid / HTML preview / HTML visual editor / other`
  - required native object classes: `text / shapes / tables / charts / notes / other`
  - allowed media exceptions: `images / video / complex illustration / none`
  - HTML interaction target: `H0 / H1 / H2 / H3 / not applicable`
  - HTML selection requirement: `none / click / click-and-lasso / group selection`
  - natural-language editing: `yes / no`
  - HTML save target: `Deck IR / HTML only / not applicable`
  - HTML-to-PPTX export after edits: `yes / no / not applicable`
- Delivery intent: `presentation-ready / editable-working-deck / final-handoff`
  - reason for selection:
- Expected review rounds: `1 / 2–3 / 3+ / unknown`
- Evidence fidelity, when the deck contains claims, data, charts, or research evidence: `preserve-source / controlled-redraw / recompute / not applicable`
  - data-bearing visual policy:
  - source context required: `axis / legend / unit / date scope / denominator / methodology / none`
- Expected revision tasks, when the deck is editable or will be handed off:
  - text and titles:
  - numbers and dates:
  - shapes and layout:
  - table or chart data:
  - template / master / placeholder:
- Rework budget: `measure actual / estimate only / N/A`
  - task set or time assumption:
- Visual failure veto: `yes` by default; any material overlap, overflow, clipping, wrong font metrics, broken wrapping, or hierarchy failure blocks delivery unless Patrick explicitly accepts the exception.
- Deadline: `N/A` if none

## Optional context

- Language:
- Public / external-material boundary:
- Preferred capability level: `Thinking / Blueprint / Production / Studio`
- Preferred production route:
- Speaker notes required: `yes / no`
- Q&A or appendix requirement:
- Explicit slide-count override and reason:
- Final handoff owner / editor:
- Handoff instructions or expected reuse:
- Patrick decisions already confirmed:

## Visual context — agent-filled, not a design questionnaire

- Viewing situation: live projection / self-paced reading / both; infer from occasion where possible.
- Visual direction: unsettled / accepted direction to reuse / supplied template.
- Available reference: exact user-provided file or page; record which aspects the user likes or dislikes.
- Everyday feedback: keep the user's words, then record the proposed change and affected pages.
- Visual samples: selected real page IDs, alternative count and reason, preview paths and versions.
- Accepted sample / style contract version: pending until selected or explicitly delegated.

Do not require color codes, font names, or professional style vocabulary to start. Reuse confirmed decisions. Follow [VISUAL_CO_DESIGN.md](VISUAL_CO_DESIGN.md) when visual direction is unsettled; these fields never expand a Storyline-only request into slide production.

## Gate record

- Current stage:
- Current source of truth:
- Open questions:
- Required confirmation:
- Rollback point:
- Outline review version:
- Evidence register version:
- Revision / rework log:

## Delivery standards confirmation card — agent-filled view

Use this section for a new deck or a material change to its requirements. It is a short user-facing view of the existing records, not a second style SSOT, new mandatory document or questionnaire. Summarize the stage in scope; do not expand a Storyline-only or review-only request into production. For an approved local correction, show only the affected entries and retain valid approvals elsewhere.

Fill from the current task and authorized readable sources before asking questions. Separate **must-have**, **adjustable within the agreed scope**, and **prohibited** requirements; separately list genuinely unresolved choices. Adjustable does not mean permission to change facts, delete required content, alter the audience or lower the editability target. Do not require three rounds or three questions when the information is already sufficient.

Each applicable entry retains these fields in the existing Brief/decision record (plain prose or a compact table is sufficient):

- Stable requirement ID and plain-language requirement.
- Category: must-have / adjustable / prohibited; applicable pages, objects or stage.
- Basis: current user instruction, exact SSOT section/version, confirmed Brief or sample version; mark agent interpretations as proposed. Reference permanent rules rather than copying their text/tokens. Do not invent source paths or approvals.
- Decision state: inherited valid confirmation / newly confirmed / pending / agent-selected under explicit delegation. Include the actual confirmation or delegation reference; approval of a plan is not approval of the finished artifact.
- Observable pass condition and check method; reference the matching existing QA item or report. For a prohibition, define the forbidden result/action and how it will be checked, not merely “the AI says it complied”.
- Evidence state and pointer: pending / pass / fail / unverified / not applicable with reason; bind evidence to the actual source, artifact and sample versions. Keep Patrick's visual acceptance separate from technical verification.

Use the same IDs in the existing QA/handoff record. Link checks rather than copying a second checklist. Keep the summary short while retaining all applicable requirements in the underlying records; link the detail when needed. Ask only unresolved questions that would materially change the result or authorization. Reuse known preferences instead of asking the user to refill them.

### Examples of evidence mapping, not new defaults

| Requirement | Observable check and limit |
|---|---|
| Use a reference layout with the already chosen theme | Name the approved layout/sample and the theme source separately; inspect the final-carrier render for hierarchy, font substitution, chart labels and spacing. Liking the reference is not approval of a reconstruction. |
| Edit HTML on the page and export an editable PPTX | Perform the requested browser interaction, save to the current Deck IR, export that revision, and inspect required native objects and final rendering. Test representative edits/save/reopen in the target application when required. A source-code edit or ZIP structure check proves only that narrower result. |
| Keep a key fact or boundary | Compare the approved source and actual output, including period, unit, denominator and caveat; numbers merely repeated in a QA statement are not output readback. |

When an explicit requirement changes, version the affected entry, retain its superseded value and confirmation, and identify only the downstream evidence invalidated by the change. If a sample or source changes later, evidence for the old version does not automatically pass the new one. Mandatory gaps block final completion unless the user explicitly approves a permissible scoped exception; a review-count limit does not create that approval.

## Brief quality check

- [ ] Audience and occasion are concrete.
- [ ] Duration and target slide count are stated.
- [ ] Source paths are exact and readable, or explicitly marked unavailable.
- [ ] Must-keep content is separated from nice-to-have content.
- [ ] Confidentiality and public-use boundaries are explicit.
- [ ] Facts needing verification are listed.
- [ ] Deliverable and editability expectations are explicit.
- [ ] Delivery intent and expected review rounds are explicit.
- [ ] Evidence-fidelity mode is explicit or marked `not applicable`.
- [ ] Expected revision tasks are listed for an editable or handed-off deck.
- [ ] Rework measurement is distinguished from an estimate.
- [ ] Visual failure veto is recorded.
- [ ] Deadline is stated or marked `N/A`.
