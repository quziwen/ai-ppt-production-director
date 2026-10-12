# AI PPT Production Director

**Current version: 0.3.6 — 2026-10-12.**

This is the same public project. Patrick working editions through v0.3.5 are incorporated here, retaining all 34 original core modules. The root [SKILL.md](SKILL.md) is canonical; `patrick-ppt-director` is an optional compatibility entry, not a separate implementation. See [CHANGELOG.md](CHANGELOG.md).

The general profile supports financial/management reporting, executive reviews, training and external talks. The Patrick profile reads adopted personal rules from the current workspace. No personal Constitution, real deck, business data or private template is shipped.

### Unified capabilities

- Shared Deck IR, HTML visual editing and native/hybrid PPTX export through nine production/QA adapters.
- Selection, lasso, text/geometry edits, undo/redo and saved IR; bounded natural-language edits and a controlled host bridge.
- Delivery-standard confirmation, evidence-linked requirements, visual co-design and feedback classification.
- The original [capability library](core/README.md), including speaker notes, Chinese wording, template/reference rights, layout and licensing.

These are shipped capabilities, not whole-deck E3/H3 or cross-Office acceptance. See [release validation](RELEASE_VALIDATION.md).

### Installation and dependencies

Download the skill ZIP from [Releases](https://github.com/quziwen/ai-ppt-production-director/releases). Back up previous installations outside host discovery roots, then copy the complete `ai-ppt-production-director` directory into the actual skills directory used by Codex, Claude Code, DSH or Hermes. Optionally install the Patrick compatibility ZIP beside it. Use a fresh session to verify an upgrade.

Planning only needs readable instructions and authorized sources. Adapters require Node.js; PPTX export needs `pptxgenjs`, inspection needs `jszip`, and HTML import/review needs Playwright and an available browser. Use the documented options or `PPT_DIRECTOR_NODE_MODULES`; see [IR contract](references/DECK_IR_SCHEMA.md) and [visual review](references/VISUAL_CO_DESIGN.md). Nothing auto-installs or uploads. PPT Master is not a dependency.

Example: “使用幻灯片导演，先给Storyline，不要直接生成PPT。” Add “Patrick profile” when that personal workflow is intended.

中文名：AI 幻灯片制作导演

Tagline: Make AI think before it makes slides.

A multi-agent, idea-to-deck skill for turning vague ideas, work experience, raw notes, and source materials into audience-fit presentations through a slow, gated, professional workflow.

This is not a one-click PPT generator and not a template pack. It acts like a small production studio: writer, screenwriter, director, and production crew. The goal is to help an AI agent think through the point of view, storyline, page substance, visual direction, build route, and QA gates before producing slides.

This repository does not ship private decks, brand templates, screenshots, videos, or third-party template files. It provides reusable workflows, adapters, original template recipes, and testing prompts for public use.

## 中文简介

AI PPT Production Director（AI 幻灯片制作导演）是一个多 Agent 演示文稿制作工作流 Skill。

它不是一键生成 PPT 的工具，也不是模板包。它更像一个“作家 + 编剧 + 导演 + 制作团队”的工作流：先帮助 AI 把模糊想法、工作经验、资料和表达目标梳理清楚，再进入故事线设计、页面规划、视觉方向、制作路线、可编辑性取舍和质量检查。

核心目标：让 AI 先想清楚，再做 PPT。

## What This Skill Does

- Turns vague ideas or work experience into a clear thesis and audience promise.
- Clarifies the presentation requirement before production.
- Verifies source access before analysis, so "uploaded file", workspace file, local path, cloud link, and `Files mentioned by the user` are handled explicitly instead of assumed.
- Inventories source materials, flags sensitive/licensed assets, and routes extraction for PDFs, tables, spreadsheets, screenshots, and old decks.
- Designs 2-3 storyline options for non-trivial decks.
- Creates a page argument map with conclusion-style titles and visual direction.
- Checks storyline coherence so slides connect logically instead of feeling like disconnected points.
- Plans speaker notes, transition lines, evidence notes, and Q&A backup for decks that must be presented or handed off.
- Polishes Chinese business PPT wording so titles, body copy, speaker notes, and transitions sound like credible workplace communication instead of generic AI slogans.
- Uses preview budget modes so users can see thumbnail storyboards, representative sample pages, section previews, or full HTML previews without over-spending time and tokens by default.
- Uses source-document-first and style-sample-gate patterns for users who want professional decks rather than one-click drafts.
- Converts vague style requests into aesthetic boundaries: layout families, density, palette, type scale, chart language, asset role, and avoid list.
- Controls content density, layout grammar, hybrid editability tradeoffs, and visual QA before bulk production.
- Selects an original template recipe.
- Recommends built-in style directions when the user has no preferred PPT, screenshot, or template.
- Guides users on how to find external template inspiration safely without redistributing third-party files.
- Supports user-provided PPT/PPTX templates or reference decks when rights and confidentiality boundaries are clear.
- Reverse-engineers good-looking reference decks into reusable visual systems, page patterns, and quality rubrics without copying private or third-party assets.
- Adds visual asset discipline for icons, images, illustrations, screenshots, and other non-text elements so decks do not feel generic or overly simple.
- Routes work to PPTX, HTML, Markdown/Marp-style source, visual QA, writing cleanup, or prompt-only workflows.
- Applies QA gates before final delivery.
- Supports annotated revision loops when the user marks what does not match their voice, content, layout, color, or style expectations.
- Supports element-level annotation workflows inspired by design canvases: stable slide and element anchors, comment objects, targeted patches, and review-mode artifacts.
- Keeps lightweight records so long production threads remain manageable.
- Works without optional third-party skills or plugins, while allowing confirmed optional boosters for visual taste, editable PPTX production, HTML decks, annotation, or source extraction.

## What This Skill Does Not Do

- It does not include private business content.
- It does not redistribute Canva, Slidesgo, commercial templates, or downloaded third-party template files.
- It does not publish company logos, brand systems, screenshots, videos, or internal cases.
- It does not assume every AI agent has the same tools.
- It does not silently install optional tools, plugins, skills, templates, fonts, or assets.

## Repository Layout

```text
ai-ppt-production-director/
  README.md
  LICENSE
  DELIVERY.md
  CONTRIBUTING.md
  SECURITY.md
  PUBLISHING.md
  TESTING.md
  OPTIONAL_TOOLS.md
  core/
    idea-to-deck-workflow.md
    capability-levels.md
    research-informed-patterns.md
    workflow.md
    source-access-gate.md
    source-extraction-routing.md
    storyline-coherence-check.md
    speaker-notes-system.md
    workplace-language-polish.md
    preview-review-loop.md
    content-density-control.md
    layout-grammar.md
    studio-hybrid-production-mode.md
    visual-qa-rubric.md
    style-lookbook.md
    reference-intake-ladder.md
    template-discovery-guide.md
    optional-capability-registry.md
    skill-routing.md
    output-routing-matrix.md
    editability-levels.md
    review-gates.md
    annotated-revision-loop.md
    visual-annotation-protocol.md
    user-template-intake.md
    reference-deck-reverse-engineering.md
    visual-asset-system.md
    template-recipes.md
    html-presentation-spec.md
    qa-checklist.md
    licensing-policy.md
    page-map-template.md
    lightweight-record-template.md
    delivery-manual-template.md
  adapters/
    codex/
      SKILL.md
    claude/
      SKILL.md
    cursor/
      rules.md
    generic/
      prompt.md
  examples/
    finance-ai-talk.md
    board-update.md
    academic-lecture.md
  research/
    feishu-ai-ppt-article-review.md
  scripts/
    package-codex.ps1
  assets/
    templates/
      README.md
      original-minimal-business/
      original-dark-executive/
```

## Recommended Use

Use this skill when a deck matters enough that one-shot generation is risky, especially when the user starts from an unclear thought, project experience, rough notes, or mixed source materials:

- board updates;
- executive reviews;
- investor or client presentations;
- finance and business reviews;
- classroom lectures;
- external talks;
- product demos;
- AI-generated PPTX or HTML decks that need review gates;
- thought-leadership talks that need substance before slides;
- work-experience sharing decks that need lessons, not just chronology.
- iterative deck revisions where the user wants to mark what should change and have the AI update copy, visual rules, source files, or deliverables.
- private projects where the user uploads a favorite PPT/PPTX template and wants richer layout, color, or style guidance without redistributing that template.

For quick internal drafts, the workflow can run in direct mode, but it should still produce a page map before building.

## Quick Start

For reading and development, start with:

- `core/workflow.md`
- `core/idea-to-deck-workflow.md`
- `core/research-informed-patterns.md`
- `core/capability-levels.md`
- `core/source-access-gate.md`
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
- `core/optional-capability-registry.md`
- `core/template-recipes.md`
- `adapters/generic/prompt.md`

## Optional Boosters, Not Dependencies

The skill can run with only its built-in workflow files.

Optional tools may improve specific stages, such as visual taste, editable PPTX generation, HTML deck production, Figma/Canva-style annotation, image generation, or source extraction. They are never required for basic use.

Tools discovered from articles, social posts, or saved links should be treated by evidence level before recommendation: `verified-local`, `verified-official`, `article-only`, `external-service-risk`, or `inspiration-only`.

When an optional tool is missing, the agent should:

- continue with the built-in fallback;
- explain the benefit and tradeoff only when the missing tool materially matters;
- ask for user confirmation before install, connector authorization, upload, or external-tool use;
- avoid sending private decks, screenshots, templates, or business data to any external tool without explicit approval.

See `OPTIONAL_TOOLS.md` and `core/optional-capability-registry.md`.

## Research Notes

`research/feishu-ai-ppt-article-review.md` summarizes safe, public-facing lessons from Feishu-saved AI/PPT articles and independently checkable public projects. It is a development reference, not a template source. Do not copy private article text, proprietary decks, screenshots, or third-party template files into this repository.

For Codex installation, build the installable package first:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\package-codex.ps1
```

Then install or copy:

```text
dist/codex/ai-ppt-production-director/
```

The portable package contains canonical `SKILL.md`, current `references/`, retained `core/`, scripts and public supporting files. References resolve inside the package. The packaging script refuses an existing output directory.

## Testing

See `TESTING.md` for static checks, install package validation, clean install testing, and behavior test prompts.

For external beta testers, start with `BETA_TESTING.md`.

## Delivery Manual

See `DELIVERY.md` for delivered scope, files, installation, validation, known boundaries, and maintenance notes. No skill or workflow delivery should be considered complete without an updated delivery manual.

## License

See `LICENSE`.

## Publishing

See `PUBLISHING.md` before making the repository public.
