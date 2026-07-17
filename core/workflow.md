# Core Workflow

Use this workflow as the platform-neutral production process after the idea, thesis, and audience are clear.

If the user starts from a vague idea, work experience, raw notes, or scattered materials, start with `idea-to-deck-workflow.md` before using this production workflow.

For higher-quality, non-one-click PPT work, also use `research-informed-patterns.md`. It turns lessons from verified public PPT skills and Feishu research notes into production rules: source document first, aesthetic boundaries, style sample gates, blueprint-before-build, and route disclosure.

## Language Policy

Use the language that best matches the user's working context.

Priority order:

1. explicit user or project language instruction;
2. known user default language preference;
3. language of the latest substantive user request;
4. English when no preference is available.

Keep file paths, commands, API names, and source terms in their original language.

## 1. Requirement Intake

Capture:

- starting spark, work experience, or raw idea;
- topic;
- audience;
- objective;
- scenario;
- duration;
- target page count;
- source materials;
- output format;
- language;
- confidentiality boundary;
- style constraints;
- user-provided templates or liked reference decks;
- preview preference or cost/time constraint;
- must-include and must-avoid items.

Ask only when missing information changes audience, objective, page count, source use, or template choice. Otherwise, state the assumption and continue.

## 2. Source Inventory

Before inventorying content, run `source-access-gate.md` when the user refers to uploaded files, attachments, local paths, cloud links, `Files mentioned by the user`, or any source material needed for the deck.

Confirm:

- what source references are visible;
- whether each source is an actual attachment, current workspace file, explicit local path, mentioned-only file, cloud/link reference, or inaccessible source;
- whether the file exists and is readable;
- the exact path/object that will be read;
- the boundary: do not scan sibling folders, open memory files, read previous session logs, or use inferred private paths to locate current source files unless the user explicitly asks for a memory/session-based lookup.

If the only visible source is a `Files mentioned by the user` local path, treat that exact path as a user-provided file reference, not as permission to scan the surrounding directory. If the user forbids that path, ask for a workspace copy or another readable attachment.

List all available materials:

- documents;
- old decks;
- images;
- video;
- datasets;
- screenshots;
- reference templates;
- links;
- brand or style guides.

Classify each source as one of:

- reusable;
- reference-only;
- outdated;
- sensitive;
- licensed;
- forbidden.

Never copy private or third-party assets into a public output package unless the user confirms the rights and the target package is allowed to include them.

If a source contains tables, numbers, screenshots, scanned pages, cross-page PDF tables, or other extraction-sensitive material, use `source-extraction-routing.md` before turning it into slide claims or charts.

## 3. Storyline Design

For non-trivial decks, produce 2-3 storyline options before writing slides.

For each option, explain:

- core logic;
- best-fit audience;
- tradeoff;
- risk;
- recommended use case.

Choose one recommended storyline only after explaining the reason.

If the starting idea is still weak, complete a writer pass first: thesis, audience promise, 3-5 core arguments, required evidence, and likely objections.

When the user starts from a vague idea or work experience, stabilize a source of truth before slide writing: `idea_brief.md`, `talk_script.md`, `slides_source.md`, `slides_source.json`, or an approved page argument map. Do not treat a one-sentence idea as enough input for a professional deck unless the user explicitly asks for a quick draft.

## 4. Page Map

Create a page-level map before production.

Each page must include:

- slide number;
- conclusion-style title;
- question answered;
- source material;
- visible content direction;
- visual form;
- speaker notes direction;
- speaker notes depth and note types;
- build risk;
- user confirmation needed.

Do not build a high-risk deck before the page map is approved.

For high-risk decks, treat this as a page argument map: every slide must advance one argument, answer one audience question, and make the desired audience reaction explicit.

## 4A. Storyline Coherence Check

Use `storyline-coherence-check.md` after the page map and before bulk production for non-trivial, high-stakes, or AI-generated drafts.

Check that:

- the deck has one story spine;
- each slide has a logic role;
- each slide follows from the previous slide;
- each slide sets up the next slide;
- the slide order answers the audience's likely next question;
- section transitions are explicit;
- disconnected, repeated, or misplaced slides are merged, moved, rewritten, or removed.

If the coherence check recommends a reorder, update the page map before production.

## 4B. Speaker Notes Planning

Use `speaker-notes-system.md` after the page map and coherence check when the deck must be presented, taught, defended, or handed off.

For each non-trivial slide, decide:

- note depth: `none`, `light`, `standard`, `detailed`, or `scripted`;
- note types: `talk-track`, `transition`, `evidence-note`, `speaker-cue`, `backup-note`, or `edit-note`;
- whether detailed content should move from visible slide text to notes or appendix;
- whether likely objections need Q&A backup.

At minimum, important decks should have transition notes between sections and evidence notes for factual or numerical claims.

## 4B2. Workplace Language Polish

Use `workplace-language-polish.md` after facts, storyline, and page roles are stable, especially for Chinese business decks.

Check slide titles, visible copy, speaker notes, and transitions for:

- AI-flavored grand wording;
- empty strategy slogans;
- fake consulting-style symmetry;
- over-abstract value claims;
- phrases that look impressive but do not say what changed, what to decide, or what evidence supports the claim.

The goal is not to make the deck casual. The goal is to make it sound like a real workplace presenter: specific, credible, sayable, and audience-fit.

If a specialized de-AI writing cleanup capability is available, use it only after source facts and logic are stable. Do not change numbers, decisions, or sourced claims during wording polish.

## 4C. Quality Control Layer

Run the quality control layer before sample slides and bulk production.

Use:

- `content-density-control.md` to set visible-text budgets and decide what moves to notes or appendix;
- `layout-grammar.md` to choose layout families, grid, visual weight, and alignment rules;
- `studio-hybrid-production-mode.md` when the user wants both strong visual quality and PowerPoint editability;
- `visual-qa-rubric.md` on sample slides and contact sheets.

For non-trivial decks, the page map should include:

- density level;
- layout family;
- visual weight;
- editability target;
- sample-slide risk.

Do not bulk-build high-stakes or visually uncertain decks until density, layout, route, and sample slide QA are clear.

For users who want professional, beautiful, or NotebookLM-like output, translate vague style expectations into aesthetic boundaries before visual production: recipe, layout families, density, palette, type scale, chart language, image/icon role, and avoid list.

## 4D. Preview Review Decision

Use `preview-review-loop.md` before full production when the user needs to see pages, is unsure about style, or may struggle to judge an abstract outline.

Default to low-cost preview calibration:

- `thumbnail-storyboard` when the main risk is logic or page flow;
- `representative-samples` when the main risk is visual style, density, or layout;
- `section-preview` for longer decks where section pacing matters;
- `full-html-preview` only when the user explicitly asks, the deck is high-risk, or full visual review is worth the time and token cost.

Do not ask the user to describe abstract design preferences from scratch when they are unsure. Offer 2-3 concrete visual directions and use representative pages to calibrate.

For final editable PPTX workflows, treat HTML previews as review artifacts unless the user chooses HTML as the final format.

When visual quality is a major risk, representative samples must include at least one hard page such as a data, process, framework, recommendation, or transition page. Do not approve a visual direction based only on an easy cover page.

When producing a full-deck preview, full HTML preview, complete storyboard, or contact sheet, run the full-deck coherence pass from `preview-review-loop.md`. Check the whole deck's page order, page-to-page logic, previous/next links, section bridges, and audience question flow before treating the preview as ready for user review or final production.

For Chinese business decks, also run a workplace language pass before asking the user to review a full preview. The preview should not be approved visually if the copy still sounds like generic AI writing.

## 5. Template Recipe Selection

Select one original recipe from `template-recipes.md`.

If the user provides a PPT/PPTX template or a deck they like, use `user-template-intake.md` before selecting or creating a visual recipe.

If the user provides a good-looking reference deck or generated deck as a benchmark, use `reference-deck-reverse-engineering.md` to extract visual system, page patterns, editability class, and a benchmark recipe.

Do not mix recipes unless the user explicitly approves a hybrid direction.

Translate vague style words into explicit rules:

- slide ratio;
- background;
- palette;
- typography;
- title hierarchy;
- body hierarchy;
- grid and spacing;
- chart style;
- image treatment;
- motion and media rules;
- what to avoid.

When a user-provided template is allowed for the private project, prefer extracting slide masters, layouts, style tokens, and page patterns instead of recreating a flat screenshot look.

When the reference deck is a rendered-poster deck, explicitly state that it may look good because slides are full-slide images, and decide whether the target deck should be native-editable, image-based, html-maintainable, or hybrid.

## 6. Page-by-Page Production

Use gated production for high-risk decks:

- external talks;
- board or executive audiences;
- client-facing presentations;
- decks using multiple source files;
- decks with strict templates;
- decks with videos, screenshots, charts, or sensitive facts;
- decks over 20 slides.

For each page:

- confirm page objective;
- confirm source use;
- draft visible copy;
- define layout;
- define chart or visual;
- define notes;
- produce or update the page;
- run local QA.

If the selected preview mode is `page-by-page`, `section-preview`, or `representative-samples`, pause at the agreed checkpoint before bulk production.

If the selected preview mode is `full-html-preview`, complete storyboard, or full-deck contact sheet, run whole-deck coherence QA after the preview is generated and before final output. Update the source of truth first if slide order, transitions, or page-to-page logic need changes.

## 7. Build Routing

Route by output:

- PPTX: use editable layouts and real slide masters when possible.
- HTML: follow `html-presentation-spec.md`.
- Markdown/source-first: use when versioning, multi-format export, or repeated revision matters.
- Prompt-only: produce a copyable prompt with all constraints.
- Visual QA: render or screenshot before final delivery.
- Writing cleanup: run after facts and structure are stable.

State the intended editability level before building: `native-editable`, `semi-editable`, `html-maintainable`, `image-based`, or `pdf-only`.

If the user wants both strong visual quality and PowerPoint editability, use `studio-hybrid-production-mode.md` and classify editability by page, not only by deck.

When the deck risks looking generic, simple, or asset-poor, run `visual-asset-system.md` after the page map and before sample slide production.

Disclose the route before building: `native-editable`, `semi-editable`, `html-maintainable`, `image-based`, `hybrid`, or `pdf-only`. Never promise pixel-perfect visual fidelity and full native editability by default.

## 8. QA Gates

Check:

- content logic;
- page-to-page logic, slide order, and section bridge quality when a full-deck preview exists;
- workplace language fit and AI-flavored wording;
- factual traceability;
- visual hierarchy;
- layout grammar;
- content density;
- visual QA score when preview/rendering is available;
- overflow and overlap;
- licensing;
- editability;
- media paths;
- speaker notes;
- transition and Q&A backup notes when relevant;
- package completeness.

Use `qa-checklist.md` before final delivery.

## 9. Revision Loop

When the user says the deck is not right, use `annotated-revision-loop.md`.

Revision feedback may target:

- user voice;
- wording;
- argument strength;
- page layout;
- color;
- visual style;
- chart or table treatment;
- editability;
- media behavior;
- output format.

Convert vague feedback into a revision table before broad edits. Update the source of truth first when one exists, then regenerate or edit outputs.

## 10. Lightweight Record

After each stage, write a short record:

- current stage;
- decisions made;
- files changed;
- unresolved items;
- next action.

Keep records short. The goal is continuity, not a transcript.
