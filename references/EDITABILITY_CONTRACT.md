# Editability Contract

> Version: 0.2
>
> Status: working production contract / evidence and handoff pilot
>
> This file defines artifact capability and acceptance gates. It is not Patrick's style SSOT and must not contain Patrick-specific colors, fonts, visual tokens, or slide-pattern rules.

## 1. Purpose

The Patrick PPT Director must disclose and verify what the delivered HTML or PPTX can be edited as. “The file opens” is not evidence of editability.

The contract applies to new decks and to any deck whose brief requests `native-editable`, `semi-editable`, `Native PPTX`, `Hybrid`, or an HTML visual editor. A deck may still use images, video, or complex illustrations, but those exceptions must be declared at object level.

## 2. Editability levels

| Level | Contract | Typical use |
|---|---|---|
| `E0` | Whole-slide raster or picture carrier; only the source artifact or the picture itself can be replaced. | Legacy or explicitly image-based delivery |
| `E1` | Required text, basic shapes, and speaker notes are native/editable objects. Images and video remain media objects. | Minimum native PPTX |
| `E2` | `E1` plus native tables and charts whose cells or data can be edited. | Recommended Patrick PPT Director default |
| `E3` | `E2` plus reusable Master/Layout/Placeholder/Theme structure and verified global edits. | Future template/system capability |

`E2` is a recommended default, not a permanent Patrick style rule. A Deck Brief may explicitly choose another level and must record the reason.

### Target changes require a decision

For both `E0–E3` and `H0–H3`, record three distinct states: the requested/approved target, the capability supported by actual evidence, and whether final delivery is authorized. A lower proven capability or missing evidence is a gap against the target, not permission to replace it. Propose a lower target only as an option awaiting the user's explicit confirmation; retain the approved target until that decision is made. Never infer permission to deliver at E2 from failure to verify a requested E3, or at H0/H1 from failure to verify H2/H3.

After an explicit target change, record the approval and assess the new target; do not insist on withdrawn capabilities. This decision changes only the requested capability. It does not validate missing evidence, turn self-reported checks into observed tests, or waive Narrative, Evidence, Visual or Handoff. In particular, `Visual: not-run` still blocks final delivery unless a separate, current and explicit visual exception satisfies the independent quality gate below.

An `E0–E3` label describes object capability only. It does not certify narrative quality, evidence correctness, visual layout, or handoff readiness. Those outcomes must be reported separately. In particular, a structurally editable PPTX with incorrect typography, wrapping, position, overlap, clipping, or chart context has not passed the visual gate.

## 3. Object-level contract

| Visible object | Required representation for `E1/E2` | Allowed exception | Evidence required |
|---|---|---|---|
| Title, subtitle, body, labels, bullets | Native text box or native text runs | None when text editing is required | Text object inspection plus edit-save-reopen |
| Rectangles, cards, circles, lines, arrows | Native shape or verified custom geometry | Complex artwork may be `custom-geometry` or image | Shape inspection plus move/resize/fill test |
| Table | Native table with editable cells | Raster table only with explicit E0 exception | Cell edit-save-reopen |
| Chart | Native chart with editable series/data | Raster chart only with explicit exception | Data edit-save-reopen |
| Image | Native image/media object | None; an image is not claimed to be semantically editable | Image object and replacement/crop status |
| Video | Native playable media object where supported | Poster image or external media reference | Relationship/media check and playback status |
| Complex illustration / imported artwork | Native SVG/custom geometry where supported, otherwise image | Must be labeled `complex-visual-exception` | Object-level report and visual comparison |
| Speaker notes | Native notes or verified notes part | None when notes are required | Notes inspection and readback |

The contract is object-level. A slide that contains an editable title and a full-slide background image is not “fully editable”; it is a Hybrid slide and must say so.

## 4. Route contract

### Native

The page is authored from semantic objects and exported to native PowerPoint objects. Text, basic shapes, tables, charts, and notes must survive as their corresponding native objects.

### Hybrid

Text and required data-bearing objects remain native. Photos, video, screenshots, complex artwork, or high-fidelity visual fragments may remain media objects. The object-level exception list is mandatory.

### Image-based

The slide is delivered as a picture or raster page. It may be a valid visual deliverable, but it cannot pass an `E1/E2/E3` editability gate without an explicit Deck Brief override.

There is no silent downgrade from Native or Hybrid to Image-based. If a selected exporter cannot represent a required object, the run must stop for a route decision or record an explicit exception and confirmation.

## 5. HTML visual editor contract

These are different capabilities and must not be conflated:

- `html-source-editable`: a developer can edit HTML/CSS/source files.
- `html-content-editable`: selected text can be edited in the browser.
- `html-visual-editor`: the user can select, move, resize, restyle, edit data, and save changes back to the Deck IR.

For this project, when HTML visual editing is requested, the interaction target is the user-confirmed behavior: the generated page exposes selectable slide objects, supports area/lasso selection, and accepts a natural-language instruction for the selected objects. The interaction is a production requirement; no third-party product is a runtime dependency.

The editor must use this semantic loop:

```text
page selection → stable object IDs → natural-language edit intent
→ validated patch to Deck IR → preview / undo → save
```

The editor must not treat arbitrary HTML mutation as the source of truth. Every accepted change must be representable as a constrained Deck IR patch so that the change can be rendered again and, where requested, exported to PPTX.

HTML and PPTX are sibling deliverables by default, not a real-time bidirectional synchronization system:

```text
Deck IR → editable HTML
Deck IR → Native / Hybrid E2 PPTX
```

If the user accepts an HTML edit, the editor may write a new version of the Deck IR and generate a new PPTX candidate from that version. This is an explicit export step, not a requirement to keep an already-delivered PPTX continuously synchronized. PPTX-to-HTML reverse synchronization is out of scope unless the Deck Brief explicitly requests it.

HTML interaction capability is reported separately from the `E0–E3` PPTX capability:

| Level | Contract |
|---|---|
| `H0` | HTML preview or source-editable page only |
| `H1` | Select objects and directly edit text or basic geometry in the browser |
| `H2` | Area/lasso selection plus natural-language edits, preview, undo/redo, and save back to Deck IR |
| `H3` | `H2` plus the accepted HTML/IR result can be exported as Native/Hybrid PPTX and the affected objects pass native-object round-trip checks |

`html-visual-editor` must not be claimed merely because the page contains `contenteditable` nodes. At minimum, the selected object IDs, the applied edit, the saved Deck IR, and the reloaded page must be demonstrably consistent.

## 6. Required production evidence

For an approved bounded sample or local revision, record the applicable evidence in the single QA/handoff index defined in the Skill entrypoint. Separate evidence dimensions do not require separate prose reports. Keep machine reports and interaction records as linked evidence, update the index as each check finishes, and use that same record for the final handoff. This does not waive any required behavior, actual inspection or user confirmation.

Before bulk production:

1. The Deck Brief records the delivery intent, expected review rounds, editability level, final carrier, required native object classes, allowed media exceptions, evidence-fidelity mode when applicable, and the visual-failure veto.
2. The selected route and exporter are recorded in a route manifest.
3. At least one representative page is exported and inspected before full-deck generation when the route is new or the deck is external/high-risk.

At export and delivery:

1. The PPTX package is inspected for native text, shapes, tables, charts, notes, relationships, and unintended full-slide pictures.
2. Representative objects are edited in PowerPoint or the target editor, saved, reopened, and re-inspected.
3. Visual rendering is checked after the edit round-trip.
4. An object-level Editability Report is delivered or stored with the verification evidence.
5. The declared revision-task set is run and recorded with actual duration when measured; estimates must be labeled as estimates.

For `H2/H3` HTML visual editing, also record:

1. Selection evidence: one object and a multi-object/lasso selection resolve to stable Deck IR IDs.
2. Natural-language edit evidence: the instruction is applied only to the selected IDs and produces a visible preview.
3. History evidence: undo/redo restores the previous and next IR states.
4. Persistence evidence: save, reload, and re-render preserve the accepted patch.
5. For `H3`, PPTX evidence: the affected text, shape, table, or chart is exported and passes the corresponding native round-trip check.

## 7. Independent quality and handoff gates

The delivery record must report these dimensions separately:

| Gate | Pass condition | Default failure consequence |
|---|---|---|
| `Narrative` | The approved Storyline, page roles, conclusion titles, and transitions remain coherent | Revise the outline or page map |
| `Evidence` | Required sources, values, scope, units, periods, axes, legends, and transformations are verified or explicitly accepted as limited | Block material unresolved claims or disclose a current exception |
| `Visual` | No material overlap, overflow, clipping, wrong font metrics, broken wrapping, or hierarchy failure after final round-trip | Block delivery when `visual_failure_veto: true` |
| `Editability` | The declared `E0–E3` / `H0–H3` capability passes its object and round-trip evidence | Route decision or explicit exception |
| `Handoff` | Source, reports, rollback point, limitations, and revision tasks are usable by the next editor | Block final handoff or label it incomplete |

`visual_failure_veto` is `true` by default. A material `Visual: fail` or mandatory `Visual: not-run` blocks final delivery even if the PPTX is structurally editable. A current explicit exception must name the defect, impact, owner, and acceptance decision; it cannot be hidden behind an E-level label.

## 8. Minimum acceptance rules

- Every required object class in the Slide Architecture has verified coverage, or an explicit exception is recorded.
- Required text is not baked into a full-slide image.
- A slide with a required editable chart or table must not use a raster fallback without current confirmation.
- The exported file must reopen after an edit-save-reopen round-trip.
- `E1/E2/E3` cannot be reported from metadata, filename, or exporter name alone.
- A historical image-based PPTX is not automatically upgraded by post-processing; regeneration from semantic source is required.

## 9. Relationship to SSOT and the Patrick Skill

This contract is a production capability contract. The Patrick PPT Director remains an orchestrator:

- it reads the current SSOT at runtime;
- it reads this contract when the requested carrier or editability level requires it;
- it selects or invokes the approved production route;
- it records object coverage and evidence;
- it never copies Patrick's style rules into this file or into `SKILL.md`.

New visual findings from a deck remain `Provisional` and go through `STYLE_UPDATE_PROPOSAL.md` when a style decision is proposed. They do not modify this contract or the Constitution automatically.
