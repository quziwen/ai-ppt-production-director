---
name: ai-ppt-production-director
description: Use when Claude or Claude Code needs to turn a vague idea, work experience, rough notes, source materials, or a deck request into a professional presentation plan or deliverable through a structured idea-to-deck workflow.
---

# AI PPT Production Director

Use the platform-neutral files under `../../core/`.

Language policy:

- Follow explicit user or project language instructions first.
- If the user has a known default language preference, use that language even when the trigger phrase is in English.
- Otherwise, reply in the same language as the user's latest substantive request.
- Keep file paths, commands, API names, and source terms in their original language.

This adapter is intentionally lightweight:

- start with `../../core/idea-to-deck-workflow.md` when the user has only a vague idea, work experience, or rough notes;
- use `../../core/research-informed-patterns.md` when the user wants professional, beautiful, non-generic PPT output or compares the workflow with one-click PPT tools;
- use `../../core/capability-levels.md` to choose Thinking, Blueprint, Production, or Studio Mode;
- follow `../../core/workflow.md`;
- use `../../core/source-access-gate.md` before reading, extracting, or relying on uploaded files, current workspace files, explicit local paths, cloud links, connector files, or `Files mentioned by the user` entries;
- use `../../core/storyline-coherence-check.md` when slide order, context flow, transitions, or page-to-page logic may be weak, jumpy, fragmented, or point-like;
- use `../../core/speaker-notes-system.md` when the deck must be presented, taught, defended, handed off, or revised for the user's speaking voice;
- use `../../core/workplace-language-polish.md` when Chinese business slide copy, speaker notes, titles, transitions, or full-deck previews sound AI-generated, over-polished, slogan-like, too consulting-like, too grand, or unlike normal workplace language;
- use `../../core/preview-review-loop.md` when the user is unsure what the deck should look like, wants to judge as an audience, or needs a low-cost visual preview before final PPTX/HTML production;
- use `../../core/content-density-control.md` when text volume, visible copy, speaker notes, appendix split, or density calibration is unclear;
- use `../../core/layout-grammar.md` when slide composition, layout balance, grid, spacing, or visual weight needs control;
- use `../../core/studio-hybrid-production-mode.md` when the user wants both strong visual quality and practical PowerPoint editability;
- use `../../core/visual-qa-rubric.md` when evaluating sample slides, contact sheets, or visual quality before final delivery;
- use `../../core/reference-intake-ladder.md` and `../../core/style-lookbook.md` when the user has no reference deck or only vague visual preferences;
- use `../../core/template-discovery-guide.md` when the user wants external template inspiration or guidance on what reference material to provide;
- use `../../core/optional-capability-registry.md` before recommending, installing, authorizing, or relying on optional tools, plugins, connectors, template sites, visual-design boosters, PPTX generators, image generators, or source-extraction tools;
- use `../../core/output-routing-matrix.md` and `../../core/editability-levels.md` before promising file outputs;
- use `../../core/review-gates.md` for staged approvals;
- use `../../core/template-recipes.md` for visual direction;
- use `../../core/html-presentation-spec.md` for HTML decks;
- use `../../core/qa-checklist.md` before delivery;
- follow `../../core/licensing-policy.md` before using external assets.

When tool access differs from Codex, produce a copyable build prompt or a page map instead of pretending the tool exists.

When a file is referenced, verify access type before analysis: actual attachment, current workspace file, explicit local path, mentioned-only file, cloud/link reference, or inaccessible source. Read only the exact verified object or path; do not scan sibling folders, open memory files, read previous session logs, or use inferred private paths to locate current source files unless the user explicitly asks for a memory/session-based lookup.

When the user is unsure about visual direction, default to representative sample pages or a thumbnail storyboard instead of a full HTML preview unless the user explicitly asks for full preview or the deck risk justifies the cost.

When producing a full-deck preview, full HTML preview, complete storyboard, or contact sheet, run a full-deck coherence pass before final production. Check slide order, page-to-page logic, previous/next links, section bridges, and audience question flow. Fix the source of truth first when the preview exposes weak jumps.

For Chinese business decks, run workplace language polish before full preview and final delivery. Identify the register first, preserve necessary formality, remove empty impressive phrases and fake consulting symmetry, and do not invent personal details or facts just to sound human.

For professional-quality decks, stabilize a source of truth before building, translate vague style words into aesthetic boundaries, and require sample pages that include at least one hard page when visual risk is high.

When the user wants both beautiful output and editable PowerPoint, do not promise pixel-perfect HTML-to-PPTX conversion. State the route and editability tradeoff.

Optional tools are boosters, not dependencies. Continue with built-in fallbacks when they are missing, and ask for explicit user confirmation before install, connector authorization, upload, or external-tool handoff.

For tools discovered from articles, roundups, or social posts, state an evidence level before recommending them. Do not treat star counts, viral screenshots, or one-click claims as verified production capability.
