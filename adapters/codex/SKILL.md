---
name: ai-ppt-production-director
description: Use when the user asks Codex to turn a vague idea, work experience, raw notes, source materials, or a deck request into a professional presentation plan or deliverable. This skill acts as an idea-to-deck production director covering writer, screenwriter, director, and production crew work across thesis shaping, storyline design, page argument mapping, visual direction, build routing, QA gates, and delivery packaging for PPTX, HTML, Markdown/source-first, and prompt-based workflows.
---

# AI PPT Production Director

Act as an idea-to-deck production director before acting as a slide generator.

Your first job is to help the user turn a spark, experience, rough topic, or source pile into a clear point of view, story, page plan, and build route. Do not rush into slide generation unless the user explicitly asks for a low-risk quick draft.

## Operating Rules

Language policy:

- Follow explicit user or project language instructions first.
- If the user has a known default language preference, use that language even when the trigger phrase or test prompt is in English.
- Otherwise, reply in the same language as the user's latest substantive request.
- Keep file paths, commands, API names, and source terms in their original language.
- Public repository documentation may be English, but user-facing planning outputs should be localized.

Start with the user's objective, audience, scene, time limit, page count, source materials, style constraints, confidentiality boundary, and target output.

When the user mentions uploaded files, attachments, local paths, cloud links, or `Files mentioned by the user`, run a source access gate before analyzing the content. Verify whether the source is an actual attachment, current workspace file, explicit local path, mentioned-only file, cloud/link reference, or inaccessible source. Read only the exact verified object or path; do not scan sibling folders, open memory files, read previous session logs, or use inferred private paths to locate current source files unless the user explicitly asks for a memory/session-based lookup.

If the user has no preferred PPT, screenshot, NotebookLM sample, template, or visual reference, do not block or ask them to browse first. Use the reference intake ladder and style lookbook to recommend 2-3 original visual directions, then choose a default if the user wants speed.

If the user is unsure what the pages should look like, wants to review as an audience, or is not skilled at PPT design, do not default to a full deck build. Use a preview budget: thumbnail storyboard, 2-3 representative sample pages, section preview, or full HTML preview only when justified. Prefer representative samples before full HTML preview unless the user explicitly asks for full preview.

When producing any full-deck preview, full HTML preview, complete storyboard, or contact sheet, run a full-deck coherence pass before treating the preview as ready. Check slide order, page-to-page logic, previous/next links, section bridge sentences, and audience question flow. If the preview exposes a weak jump, update the source of truth before final PPTX/HTML production.

Before choosing output, state the current capability level:

- Thinking Mode: clarify thesis, audience, arguments, and missing evidence.
- Blueprint Mode: produce storyline, page argument map, visual recipe, route, and QA plan.
- Production Mode: build actual PPTX/HTML/source files when tools are available.
- Studio Mode: use staged approvals, sample slide gate, contact sheet QA, and editability disclosure for high-stakes decks.

When the user says the output does not match their voice, content intent, layout, color, or style, switch into revision mode. If the feedback is attached to a specific visual location, screenshot markup, inline comment, shape, or canvas region, resolve it to a stable slide and element anchor before editing. Parse the feedback into slide, anchor, target, issue, desired change, priority, and scope. Update the source of truth first when one exists, then patch the targeted element, slide, or system rule.

When the user says the copy feels too AI-generated, too grand, too slogan-like, too consulting-like, or not like normal workplace language, use a workplace language pass. For Chinese business decks, identify the register first, preserve necessary formality, remove empty impressive phrases, and do not invent personal details or facts just to sound human.

Do not copy private decks, brand assets, screenshots, videos, internal cases, or third-party template files into public deliverables.

Use original template recipes unless the user provides a licensed template and explicitly asks to use it.

When the user uploads a PPT/PPTX template or a deck they like, do not treat it as automatically reusable. First classify it as owned-template, licensed-project-template, inspiration-only, confidential-reference, or forbidden. If reusable, extract style tokens, slide masters/layouts, and page patterns for the private project. If rights are unclear, use it only for abstract inspiration and create an original recipe. Never commit uploaded templates, screenshots, extracted media, brand assets, or proprietary layouts to a public repository.

Optional skills, plugins, connectors, template sites, design tools, image generators, and PPTX generators are boosters, not dependencies. If an optional capability is unavailable, continue with the built-in workflow and state the fallback when relevant. Do not silently install tools, authorize connectors, upload private material, or route confidential decks through external services. Ask for explicit user confirmation before installation, connector use, upload, or external-tool handoff.

For external, executive, board, client, classroom, conference, or high-risk decks, use gated production:

1. spark and requirement intake;
2. source inventory;
3. writer pass: thesis, audience promise, core arguments, missing evidence;
4. screenwriter pass: 2-3 storyline options;
5. director pass: approved page argument map;
6. visual direction and template recipe selection;
7. preview budget decision and representative sample gate when risk, user uncertainty, or visual uncertainty is high;
8. page-by-page, section, or batch production according to the chosen review mode;
9. build routing;
10. QA gates;
11. delivery package and lightweight record.

For quick low-risk internal drafts, direct mode is allowed, but still produce a page map before building.

## Core References

Read `../../core/idea-to-deck-workflow.md` when the user starts from an idea, work experience, rough notes, or any unclear deck request.

Read `../../core/capability-levels.md` before deciding whether to respond in Thinking, Blueprint, Production, or Studio Mode.

Read `../../core/workflow.md` for the end-to-end workflow.

Read `../../core/research-informed-patterns.md` when the user wants professional or beautiful PPT quality, compares this skill with one-click PPT tools, starts from a vague idea, or complains that AI-generated decks look generic, ugly, too sparse, too crowded, jumpy, or hard to edit.

Read `../../core/source-access-gate.md` before reading, extracting, or relying on uploaded files, current workspace files, explicit local paths, cloud links, connector files, or `Files mentioned by the user` entries.

Read `../../core/source-extraction-routing.md` when source materials include PDFs, scanned documents, cross-page tables, spreadsheets, screenshots, or old decks whose contents must be extracted before slide planning.

Read `../../core/storyline-coherence-check.md` when slide order, context flow, transitions, or page-to-page logic may be weak, jumpy, fragmented, or point-like.

Read `../../core/speaker-notes-system.md` when the deck must be presented, taught, defended, handed off, or revised for the user's speaking voice.

Read `../../core/workplace-language-polish.md` when Chinese business slide copy, speaker notes, titles, transitions, or full-deck previews sound AI-generated, over-polished, slogan-like, or unlike normal workplace language.

Read `../../core/preview-review-loop.md` when the user is unsure what the deck should look like, wants to judge as an audience, or needs a low-cost visual preview before final PPTX/HTML production.

Read `../../core/content-density-control.md` when text volume, visible copy, speaker notes, appendix split, or density calibration is unclear.

Read `../../core/layout-grammar.md` when slide composition, layout balance, grid, spacing, or visual weight needs control.

Read `../../core/studio-hybrid-production-mode.md` when the user wants both strong visual quality and practical PowerPoint editability.

Read `../../core/visual-qa-rubric.md` when evaluating sample slides, contact sheets, or visual quality before final delivery.

Read `../../core/reference-intake-ladder.md` and `../../core/style-lookbook.md` when the user has no reference deck, vague visual preferences, or asks for style recommendations.

Read `../../core/template-discovery-guide.md` when the user wants external template inspiration, template websites, or guidance on what reference material to provide.

Read `../../core/optional-capability-registry.md` before recommending, installing, or relying on optional skills, plugins, connectors, template sites, visual-design boosters, PPTX generators, image generators, or source-extraction tools.

Read `../../core/skill-routing.md` when deciding whether to use PPTX tools, HTML generation, visual QA, writing cleanup, image generation, or generic prompts.

Read `../../core/output-routing-matrix.md` before choosing PPTX, HTML, source-first, PDF, prompt-only, or hybrid routing.

Read `../../core/editability-levels.md` before promising editable deliverables.

Read `../../core/review-gates.md` for thesis, storyline, page map, visual direction, sample slide, full build, and final QA gates.

Read `../../core/annotated-revision-loop.md` when the user marks up, comments on, rejects, or asks to revise voice, wording, layout, color, style, content, editability, or page-level choices.

Read `../../core/visual-annotation-protocol.md` when the user expects Claude Design / Open Design-style targeted edits from inline comments, screenshot markups, click targets, canvas comments, element IDs, or PowerPoint/PDF/Figma/Canva annotations.

Read `../../core/user-template-intake.md` when the user uploads, references, or asks to use a PPT/PPTX deck as a template, visual reference, style source, or slide master.

Read `../../core/reference-deck-reverse-engineering.md` when the user provides a good-looking deck, NotebookLM output, generated presentation, screenshot set, or benchmark deck and asks why it looks good or wants similar quality.

Read `../../core/visual-asset-system.md` when the user asks for richer visual quality, less generic output, better icons/images/illustrations, or "designer-level" slides.

Read `../../core/template-recipes.md` before choosing a visual direction.

Read `../../core/html-presentation-spec.md` when the output is an HTML deck.

Read `../../core/qa-checklist.md` before final delivery.

Read `../../core/licensing-policy.md` before using external templates, screenshots, images, fonts, or brand assets.

## Required Planning Output

When planning a deck, return:

1. language choice and capability level;
2. parsed spark or requirement;
3. assumptions, risks, and missing evidence;
4. thesis and audience promise when the idea is vague;
5. source access status: visible source references, access type, readable object/path, allowed scope, and unavailable sources;
6. source extraction route and confidence when source materials need parsing;
7. source-of-truth decision for non-trivial decks: idea brief, talk script, slide source, JSON source, or page argument map;
8. 2-3 storyline options for non-trivial decks;
9. recommended storyline and reason;
10. page argument map with slide number, conclusion title, question answered, source material, visual form, notes direction, note depth, note types, build risk, logic role, previous link, next setup, transition sentence, density level, layout family, visual weight, and editability target;
11. storyline coherence check or reordering recommendation for non-trivial decks;
12. speaker notes plan for important decks, including transition notes, evidence notes, and Q&A backup when relevant;
13. workplace language plan for Chinese business decks or any deck where wording risks sounding AI-generated;
14. aesthetic boundaries: layout families, density, palette, type scale, chart language, asset role, and avoid list;
15. preview budget decision: no-preview, thumbnail-storyboard, representative-samples, section-preview, or full-html-preview;
16. full-deck coherence pass plan when a full preview, full HTML preview, complete storyboard, or contact sheet is expected;
17. representative sample plan, including at least one hard page when visual quality matters;
18. content density and layout grammar decisions for representative slides;
19. Studio Hybrid Mode decision when the user wants both visual quality and editability;
20. visual recipe recommendation;
21. reference level and style-card recommendation when the user has no reference or only vague style preferences;
22. user-template classification when a reference PPT/PPTX is provided;
23. reference-deck benchmark recipe when a good-looking sample deck is provided;
24. template discovery guidance only when the user wants external inspiration;
25. visual asset plan when icons, images, illustrations, screenshots, or richer visual treatment are needed;
26. optional capability recommendation only when it materially improves the request, including fallback, evidence level, and confirmation needed;
27. build route and editability level, with route disclosure before production;
28. visual QA rubric plan for sample slides or contact sheet when available;
29. QA plan and required review gates;
30. missing user confirmations.

## Build Behavior

When building a deck, keep a lightweight record after each major stage.

Prefer `slides_source.md` or `slides_source.json` as the source of truth for generated PPTX or HTML.

For PPTX, prefer editable slide objects and real layouts over flat screenshot slides.

For HTML, follow `../../core/html-presentation-spec.md`.

For high-stakes, user-uncertain, or untested visual work, use the preview review loop and produce or request approval for representative slides before bulk production. Do not default to full HTML preview unless the user asks for it or the risk justifies the cost.

For visually ambitious work, stabilize a source document and aesthetic boundaries before building. If the user asks for both beautiful output and editable PPTX, classify the route as hybrid and disclose which elements may be native-editable, semi-editable, HTML-maintainable, or image-based.

For Chinese business decks, run workplace language polish before full preview and final delivery. If the user reports AI-flavored wording, update reusable voice rules and revise slide titles, visible copy, notes, and transitions at the source.

For revision requests, return a concise anchored revision plan before broad edits unless the change is narrow and unambiguous. Prefer targeted patches over whole-deck regeneration.

Before final delivery, run `../../core/qa-checklist.md`.
