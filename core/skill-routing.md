# Skill Routing

Use this file to decide which capability should handle each part of the deck workflow.

## Routing Principles

- Strategy before production.
- Source access gate before source inventory and extraction.
- Memory and previous sessions are not source locators during Source Access Gate unless the user explicitly requests a memory/session-based lookup.
- Source inventory before reuse.
- Page map before build.
- QA before delivery.
- Speaker notes before presenter handoff.
- Writing cleanup after content is stable.
- Workplace language polish after facts, storyline, and page roles are stable.
- Licensing review before public sharing.
- Editability level before promising deliverables.
- Preview budget before high-cost visual generation.
- Sample or preview gate before bulk generation for high-risk or untested visual work.
- Built-in workflow before optional tools.
- User confirmation before installing, authorizing, uploading to, or routing private material through optional tools.

## Common Routes

| Need | Preferred Route |
|---|---|
| Clarify vague deck requirement | Production director workflow |
| Turn rough idea or work experience into a deck | Idea-to-deck workflow |
| User says they uploaded a file, provides a local path, or `Files mentioned by the user` appears | Source access gate before analysis |
| Fix jumpy logic, disconnected pages, or weak slide order | Storyline coherence check |
| Need presenter script, transitions, Q&A, or handoff notes | Speaker notes system |
| User needs to see pages before deciding | Preview review loop |
| User wants both strong visuals and editable PPTX | Studio Hybrid Production Mode |
| Text is too sparse, too crowded, or hard to calibrate | Content density control |
| Layout feels unbalanced or arbitrary | Layout grammar |
| Check whether slides look professional | Visual QA rubric |
| User has no reference style | Reference intake ladder, then style lookbook |
| User wants style inspiration | Style lookbook, then template discovery guide if needed |
| Extract source evidence from PDFs, tables, spreadsheets, or screenshots | Source extraction routing |
| Build executive storyline | Executive deck or strategy writing capability |
| Analyze source PPTX | PPTX reading/editing capability |
| Create editable PowerPoint | Presentation/PPTX generation capability |
| Use uploaded favorite PPT/PPTX as template | User template intake, then PPTX/template extraction capability |
| Learn from a good-looking reference deck | Reference deck reverse engineering |
| Create browser-playable deck | HTML deck workflow |
| Produce versionable internal or technical slides | Markdown/Marp-style source route |
| Improve Chinese wording | Writing cleanup capability |
| Chinese business deck sounds AI-generated, too grand, too slogan-like, or unlike workplace language | Workplace language polish, then optional writing cleanup capability |
| Check visual density and layout | Visual QA or browser screenshot review |
| Quickly calibrate visual direction without full build | Preview review loop, then representative samples |
| Improve icons, images, illustrations, or asset quality | Visual asset system |
| Improve designer-level visual taste | Optional capability registry, then visual recipes or confirmed visual-design booster |
| Use missing external skill or plugin | Optional capability registry, then ask before install or use fallback |
| Use design-canvas style annotation | Visual annotation protocol, with optional Figma/Canva/design-canvas routing only after confirmation |
| Generate supporting images | Image generation only after user confirms need and rights |
| Produce copyable prompt | Generic prompt adapter |

## Direct Mode

Use direct mode only when:

- the deck is low-risk;
- the user needs a fast draft;
- there are few or no source materials;
- no strict template is required;
- the deck is short.

Even in direct mode, produce a page map before building.

## Gated Mode

Use gated mode when:

- the deck is external, executive, board, client, investor, classroom, or conference-facing;
- the user provides reference decks or strict templates;
- the deck uses sensitive facts, charts, screenshots, video, or case material;
- the deck is over 20 slides;
- prior generation quality issues were reported.

In gated mode, ask for approval after the storyline, page map, visual direction, and representative page previews.

## Capability Modes

| Mode | Route |
|---|---|
| Thinking Mode | clarify thesis, audience, core arguments, and missing evidence |
| Blueprint Mode | produce storyline, page argument map, visual recipe, route, and QA plan |
| Production Mode | build PPTX, HTML, source files, or prompt package when tools are available |
| Studio Mode | add staged approvals, sample slide gate, contact sheet QA, and editability disclosure |

## Output Routing

Use `output-routing-matrix.md` when the user asks for files or when multiple output formats are possible.

Use `editability-levels.md` when the deck must be editable, reviewed, or handed off.

Use `source-access-gate.md` before reading, extracting, or relying on uploaded files, workspace files, explicit local paths, cloud links, connector files, or `Files mentioned by the user` entries. Do not use memory files or previous session logs to locate the current source file unless the user explicitly requests that lookup.

Use `user-template-intake.md` before using any uploaded PPT/PPTX as a template or style source.

Use `reference-deck-reverse-engineering.md` before trying to reproduce the quality of NotebookLM, generated, designer-made, or benchmark decks.

Use `visual-asset-system.md` before sourcing, generating, or revising icons, images, screenshots, illustrations, or decorative visuals.

Use `source-extraction-routing.md` before relying on extracted PDF tables, scanned documents, spreadsheets, screenshots, or old-deck content.

Use `reference-intake-ladder.md` and `style-lookbook.md` when the user has no reference deck, vague visual preferences, or asks the agent to recommend a style.

Use `template-discovery-guide.md` when the user wants to browse external template websites or needs guidance on what kind of reference to provide.

Use `storyline-coherence-check.md` when the deck feels fragmented, the page order is uncertain, transitions are weak, or an AI-generated draft contains disconnected point-like slides.

Use `speaker-notes-system.md` when the deck must be presented, taught, defended, handed off, or revised for the user's speaking voice.

Use `workplace-language-polish.md` when Chinese business slide copy, speaker notes, titles, transitions, or full-deck previews sound AI-generated, over-polished, slogan-like, or unlike normal workplace language.

Use `preview-review-loop.md` when the user is unsure what the deck should look like, wants to judge as an audience, or needs a low-cost visual preview before final PPTX/HTML production.

Use `studio-hybrid-production-mode.md` when the user wants both visual quality and PowerPoint editability.

Use `content-density-control.md` when visible text volume, speaker notes, appendix split, or page density is unclear.

Use `layout-grammar.md` when page composition, visual balance, grid, spacing, or layout family is uncertain.

Use `visual-qa-rubric.md` to evaluate sample slides, contact sheets, or revised pages.

Use `optional-capability-registry.md` before recommending, installing, or depending on any optional skill, plugin, connector, template site, design tool, PPTX generator, image generator, or source-extraction tool.

## Optional Tool Routing

Optional tools are boosters, not dependencies.

Default route:

1. continue with the built-in director workflow;
2. use original template recipes and built-in QA;
3. mention optional tools only when they materially improve the stated request;
4. explain the fallback if the user does not install or authorize the tool;
5. ask for explicit confirmation before install, upload, connector use, or external-tool handoff.

Do not silently install or call external tools. Do not share private decks, screenshots, templates, or business data with optional connectors unless the user explicitly approves that use.
