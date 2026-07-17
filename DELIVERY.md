# Delivery Manual

This delivery manual explains what is included in the current `ai-ppt-production-director` skill package, how to install and validate it, and what remains to test before public release.

## Delivered Scope

`ai-ppt-production-director` is a public, multi-agent, idea-to-deck skill.

It is designed to help an AI agent turn vague ideas, work experience, raw notes, and source materials into professional presentation plans or deliverables through:

- thesis and audience-promise shaping;
- source access verification for uploaded files, workspace files, explicit local paths, cloud links, and `Files mentioned by the user`;
- source extraction routing for PDFs, tables, spreadsheets, screenshots, and old decks;
- storyline design;
- page argument mapping;
- storyline coherence checking, slide-order repair, and transition drafting;
- speaker notes planning for talk track, transitions, evidence, speaker cues, Q&A backup, and presenter handoff;
- workplace language polish for Chinese business decks so titles, body copy, notes, and transitions avoid generic AI slogans without inventing facts or degrading necessary formality;
- preview budget modes for thumbnail storyboards, representative sample pages, section previews, and full HTML storyboard previews;
- quality control for content density, layout grammar, hybrid production, and visual QA;
- visual direction selection;
- built-in style lookbook and reference intake ladder for users without visual references;
- safe external template discovery guidance;
- user-provided PPT/PPTX template intake;
- reference deck reverse engineering for good-looking benchmark decks;
- visual asset system for icons, images, illustrations, and screenshots;
- output routing;
- editability classification;
- review gates;
- annotated and element-level revision loops;
- optional capability routing with built-in fallbacks and confirmation-before-install rules;
- QA and licensing checks.

## Delivered Files

Core workflow files:

- `core/idea-to-deck-workflow.md`
- `core/capability-levels.md`
- `core/workflow.md`
- `core/source-access-gate.md`
- `core/source-extraction-routing.md`
- `core/storyline-coherence-check.md`
- `core/speaker-notes-system.md`
- `core/workplace-language-polish.md`
- `core/preview-review-loop.md`
- `core/content-density-control.md`
- `core/layout-grammar.md`
- `core/studio-hybrid-production-mode.md`
- `core/visual-qa-rubric.md`
- `core/style-lookbook.md`
- `core/reference-intake-ladder.md`
- `core/template-discovery-guide.md`
- `core/optional-capability-registry.md`
- `core/skill-routing.md`
- `core/output-routing-matrix.md`
- `core/editability-levels.md`
- `core/review-gates.md`
- `core/annotated-revision-loop.md`
- `core/visual-annotation-protocol.md`
- `core/user-template-intake.md`
- `core/reference-deck-reverse-engineering.md`
- `core/visual-asset-system.md`
- `core/template-recipes.md`
- `core/html-presentation-spec.md`
- `core/qa-checklist.md`
- `core/licensing-policy.md`
- `core/page-map-template.md`
- `core/lightweight-record-template.md`
- `core/delivery-manual-template.md`

Agent adapters:

- `adapters/codex/SKILL.md`
- `adapters/claude/SKILL.md`
- `adapters/cursor/rules.md`
- `adapters/generic/prompt.md`

Release and operations files:

- `README.md`
- `OPTIONAL_TOOLS.md`
- `TESTING.md`
- `PUBLISHING.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `LICENSE`
- `scripts/package-codex.ps1`

## Installable Codex Package

Build the installable package:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\package-codex.ps1
```

Expected output:

```text
dist/codex/ai-ppt-production-director/
  SKILL.md
  references/
```

Install manually by copying the generated package into the Codex skills directory:

```powershell
$codexSkills = "<your-codex-skills-directory>"
Copy-Item -Recurse -Force ".\dist\codex\ai-ppt-production-director" (Join-Path $codexSkills "ai-ppt-production-director")
```

## Validation Performed

Run these checks before release:

```powershell
$skillCreator = "<path-to-skill-creator>"
python "$skillCreator\scripts\quick_validate.py" ".\adapters\codex"
python "$skillCreator\scripts\quick_validate.py" ".\adapters\claude"
python "$skillCreator\scripts\quick_validate.py" ".\dist\codex\ai-ppt-production-director"
```

Also scan for private or sensitive content:

```powershell
rg -n "private-company-name|session-id|local-user-path|token|password|secret|credential|POIZON|得物" .
```

Expected result:

- skill validation passes;
- sensitive scanner only finds policy/test language, not real private materials;
- `dist/` includes all core reference files.

## Behavior Tests

Use `TESTING.md` for the complete behavior suite.

Minimum required fresh-session tests before release:

- vague idea to deck;
- source access gate for uploads, mentioned files, explicit local paths, and workspace files;
- source access gate memory boundary: no memory, previous session logs, rollout summaries, chat-history archives, or remembered paths are used to locate current source files unless explicitly requested;
- PDF/table source extraction routing;
- board update planning;
- storyline coherence and slide-order repair;
- speaker notes planning and Q&A backup;
- workplace language polish and anti-AI wording behavior;
- preview budget and representative sample behavior;
- content density control;
- layout grammar and visual balance;
- Studio Hybrid Mode for visual quality plus editability;
- visual QA rubric behavior;
- Chinese language preference;
- licensing boundary;
- editability routing;
- sample slide gate;
- annotated revision loop;
- visual annotation protocol.
- user-provided template intake.
- reference deck reverse engineering.
- visual asset quality behavior.
- optional capability fallback and install-confirmation behavior.
- no-reference style recommendation behavior.
- external template discovery boundary behavior.

## Known Boundaries

This repository does not include:

- private business decks;
- internal screenshots, videos, logos, fonts, or brand assets;
- third-party template files;
- user-uploaded template files;
- optional third-party skills, plugins, or connectors as hard dependencies;
- real customer or company examples;
- local session transcripts.

The skill can guide PPTX, HTML, source-first, and prompt-only workflows, but actual production quality still depends on the host agent, available tools, model quality, and source material quality.

Optional tools may improve visual design, editable PPTX production, HTML deck production, annotation, or source extraction. They must remain optional, and the agent should continue with built-in fallbacks when they are unavailable.

## Maintenance Notes

Update this delivery manual whenever:

- the public interface changes;
- a new core workflow file is added;
- a new adapter is added;
- installation steps change;
- validation or behavior tests change;
- release boundaries change.

No skill or workflow delivery should be considered complete without an updated delivery manual.
