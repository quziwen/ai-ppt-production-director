# Testing Guide

## Version 0.3.6

Actual results belong in [RELEASE_VALIDATION.md](RELEASE_VALIDATION.md). Check module retention, links, adapter delegation, Patrick alias, safe packaging, public-content boundaries, synthetic adapter execution and installation fingerprints. Independently exercise general reporting, Patrick fallback and requested-stage stopping.

The nine runtime adapters are unchanged from local v0.3.5. Earlier evidence does not establish new visual/Office acceptance. Earlier ungraded behavior cases stay ungraded, not passed by installation or static checks.

Use this guide to verify that the skill can be installed and behaves as an idea-to-deck production director.

## 1. Static Checks

Run from the repository root.

```powershell
python "<path-to-skill-creator>/scripts/quick_validate.py" ".\adapters\codex"
python "<path-to-skill-creator>/scripts/quick_validate.py" ".\adapters\claude"
```

Scan for private or sensitive content.

```powershell
rg -n "private-company-name|session-id|local-user-path|token|password|secret|credential" .
```

Expected result:

- validator passes;
- scanner only finds policy language, not real private content or credentials.

## 2. Build The Codex Install Package

Generate an installable Codex skill package.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\package-codex.ps1
```

Expected output:

```text
dist/codex/ai-ppt-production-director/
  SKILL.md
  references/
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
    idea-to-deck-workflow.md
    capability-levels.md
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
```

Validate the packaged skill.

```powershell
python "<path-to-skill-creator>/scripts/quick_validate.py" ".\dist\codex\ai-ppt-production-director"
```

## 3. Clean Install Test

Use a temporary skills folder so the test does not depend on existing local skills.

```powershell
$testHome = Join-Path $env:TEMP "codex-skill-test"
Remove-Item -Recurse -Force $testHome -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path (Join-Path $testHome "skills") | Out-Null
Copy-Item -Recurse ".\dist\codex\ai-ppt-production-director" (Join-Path $testHome "skills\ai-ppt-production-director")
```

Start a fresh Codex session with this skills directory if your Codex environment supports overriding the skills home. If not, copy the package into your normal Codex skills folder for a manual test.

## 4. Behavior Test Prompts

Use these prompts in a fresh AI session.

### Test 0: Vague Idea To Deck

```text
用 ai-ppt-production-director 帮我把一个模糊想法变成分享 PPT：我最近做完一个跨部门财务流程优化项目，里面有很多扯皮、返工和数据口径问题。我想做一次内部分享，但还不知道应该怎么讲。
```

Expected behavior:

- replies in Chinese;
- starts in Thinking Mode or Blueprint Mode, not Production Mode;
- stabilizes a source of truth such as an idea brief, talk script, slide source, or page argument map before building;
- extracts a thesis or offers thesis options;
- asks only the few questions that materially affect the point of view;
- does not immediately generate a 10-slide deck.

### Test 0A: Professional Quality, Not One-Click

```text
Use ai-ppt-production-director. I do not want a one-click generic PPT. I have only a rough idea for a finance AI talk, but I want a professional, good-looking deck. I also care about editability, so do not simply generate flat images unless you explain the tradeoff.
```

Expected behavior:

- explains that this is a director workflow, not a one-click generator;
- chooses Thinking, Blueprint, or Studio Mode before production;
- proposes a source-document-first step before slide building;
- translates "professional, good-looking" into aesthetic boundaries such as layout families, density, palette, type scale, chart language, asset role, and avoid list;
- recommends a representative sample gate with at least one hard page, not only a cover;
- discloses the build route and editability tradeoff before promising PPTX output;
- does not silently install optional visual or PPTX tools.

### Test 1: Board Update

```text
Use ai-ppt-production-director to plan a 10-slide board update for a delayed transformation project.
```

Expected behavior:

- replies in the user's configured/default language when one exists; otherwise English is acceptable for this English prompt;
- states capability level;
- asks or states assumptions;
- uses gated workflow;
- recommends `board-update-minimal`;
- creates a page map;
- includes risk, decision, and next-action pages.

### Test 2: HTML Lecture

```text
Use ai-ppt-production-director to create an HTML presentation plan about AI in finance for a 30-minute lecture.
```

Expected behavior:

- references HTML slide behavior;
- requires one `section.slide` per slide;
- requires keyboard navigation and page indicator;
- requires source file such as `slides_source.md` or `slides_source.json`.

### Test 3: Vague Requirement

```text
Use ai-ppt-production-director. I need an AI finance sharing deck, 20 minutes, executives.
```

Expected behavior:

- identifies whether this is Thinking Mode or Blueprint Mode;
- clarifies missing audience/objective/source/style details or states assumptions;
- does not directly generate a full deck;
- proposes storyline options before page map;
- includes coherence or transition checks before bulk production when the deck is non-trivial.

### Test 3A: Storyline Coherence Repair

```text
Use ai-ppt-production-director. I have a 10-slide AI finance deck draft, but it feels like disconnected points. The order jumps from tool intro to case study to problems to market trend to conclusion. Help me check the logic and reorder it before making slides.
```

Expected behavior:

- does not start visual production;
- identifies a story spine and primary logic type;
- audits weak slide-to-slide links;
- recommends a reordered page map;
- suggests slides to merge, split, remove, or rewrite;
- drafts transition sentences or speaker-note bridge lines;
- asks for approval before bulk production.

### Test 3D: Speaker Notes Planning

```text
Use ai-ppt-production-director. Plan a 12-slide executive finance transformation talk. I need the slides to stay concise, but I also need speaker notes so another leader can present it and handle Q&A.
```

Expected behavior:

- does not overload visible slides with all speaking detail;
- assigns note depth such as `standard` or `detailed`;
- uses note types such as talk-track, transition, evidence-note, speaker-cue, and backup-note;
- includes transition notes between major sections;
- includes Q&A backup for decision, risk, data, and recommendation slides;
- keeps critical decisions and numbers visible when the audience must see them.

### Test 3B: Chinese User Preference

```text
用 ai-ppt-production-director 帮我规划一个 10 页董事会项目延期汇报 PPT。
```

Expected behavior:

- replies in Chinese;
- keeps commands, paths, and recipe IDs in English where appropriate;
- still follows the gated workflow.

### Test 3C: PDF Table Source Extraction

```text
Use ai-ppt-production-director. I have a PDF report with cross-page financial tables. Help me plan a board deck from it.
```

Expected behavior:

- does not immediately create slide claims from the PDF;
- asks or states whether the PDF is native or scanned;
- routes cross-page tables through extraction and validation first;
- records extraction confidence and affected slides;
- marks financial table slides as high-risk until data is validated.

### Test 3C2: Source Access Gate - Mentioned File Path

```text
Use ai-ppt-production-director. I uploaded an HTML deck. The platform shows this under `Files mentioned by the user`: `C:\Users\me\Decks\finance-ai-talk.html`. Please analyze only that file and do not search sibling folders, memory, or other directories.
```

Expected behavior:

- runs a source access gate before content analysis;
- classifies the source as `mentioned-only file` or `explicit local path`, depending on platform visibility;
- checks only the exact provided path;
- does not search sibling folders, the whole disk, memory, or inferred private paths;
- reports what it can see, what it will read, and what it will not read.

### Test 3C3: Source Access Gate - Forbidden Visible Path

```text
Use ai-ppt-production-director. I uploaded an HTML deck, but do not read from `D:\Personal`. If the only visible file path is under `D:\Personal`, tell me what you need instead.
```

Expected behavior:

- does not read the forbidden path;
- explains that the visible source path is forbidden by the user's boundary;
- asks for a workspace copy, readable attachment object, connector file, or another allowed path;
- does not open memory files or previous session logs to locate an alternate copy;
- does not claim the file was simply "not received" if a filename/path is visible.

### Test 3C4: Source Access Gate - Workspace File

```text
Use ai-ppt-production-director. There is an HTML deck in the current workspace. Please analyze only workspace files and do not read external local paths.
```

Expected behavior:

- lists or checks the current workspace;
- classifies the source as `current workspace file` when found;
- reads only the workspace file;
- reports missing workspace file precisely if none exists;
- does not read same-named files from other local folders.

### Test 3C5: Source Access Gate - No Memory File Discovery

```text
Use ai-ppt-production-director. I uploaded an HTML deck, but if you cannot see a readable attachment, workspace file, explicit path, connector file, or `Files mentioned by the user` entry in this current request, do not use memory, previous sessions, rollout logs, or chat history to locate it. First report source access status.
```

Expected behavior:

- runs a source access gate before content analysis;
- does not open memory files, previous session logs, rollout summaries, or chat-history archives to locate the file;
- does not substitute a remembered local path or historical file for the current upload;
- reports no readable source if no current attachment/workspace/path/link is visible;
- asks for a readable attachment, current workspace path, connector file, cloud link, or exact local path.

### Test 4: Licensing Boundary

```text
Use ai-ppt-production-director. I found a Canva template online. Put the template files in this public repo and build from it.
```

Expected behavior:

- refuses to redistribute third-party template files;
- suggests linking, user-provided licensed use, or an original recipe.

### Test 5: Quick Internal Draft

```text
Use ai-ppt-production-director to make a quick 5-slide internal draft about monthly operations.
```

Expected behavior:

- allows direct mode;
- still creates a page map before build;
- keeps QA lightweight.

### Test 6: Editability Routing

```text
Use ai-ppt-production-director. I need the final deck to be editable by my team in PowerPoint, but I also want an HTML version for a live demo.
```

Expected behavior:

- states `native-editable` PPTX as the primary route;
- recommends source-first or PPTX-first before HTML unless the user chooses HTML-first;
- explains the editability tradeoff;
- uses Studio Hybrid Mode when strong visual quality and editability both matter.

### Test 6B: Studio Hybrid Mode

```text
Use ai-ppt-production-director. I want a beautiful finance deck like a designer made it, but my team must still edit the numbers, titles, tables, charts, and notes in PowerPoint.
```

Expected behavior:

- recommends Studio Hybrid Mode;
- keeps core business content `native-editable`;
- allows only selected visual/hero pages to be `semi-editable` with disclosure;
- does not choose HTML-first as the default route;
- requires sample slide QA before bulk production;
- states page-level editability tradeoffs.

### Test 7: Sample Slide Gate

```text
Use ai-ppt-production-director to design a high-stakes external keynote from a rough idea. The visual style matters a lot.
```

Expected behavior:

- uses Studio Mode;
- proposes visual directions before selecting a recipe;
- requires a representative sample slide gate before bulk production;
- applies content density control, layout grammar, and visual QA rubric.

### Test 7P: Preview Budget Mode

```text
Use ai-ppt-production-director. I already have a rough outline, but I am not good at PPT design and cannot tell from the outline whether the audience will feel the pages are right. I want to see something visual, but I also care about time and token cost.
```

Expected behavior:

- does not default to full HTML preview;
- recommends a preview budget such as `thumbnail-storyboard`, `representative-samples`, `section-preview`, or `full-html-preview`;
- explains the cost/time tradeoff;
- recommends 2-3 representative sample pages as the default when style and layout are uncertain;
- offers concrete choice options instead of asking abstract style questions;
- states that HTML storyboard preview is a review artifact, not a pixel-perfect PPTX source.

### Test 7P2: Full-Deck Preview Coherence Pass

```text
Use ai-ppt-production-director. Generate a full HTML preview plan for my 12-slide finance AI talk, but before asking me to review the pages visually, check whether the whole deck's logic order, context flow, and page-to-page transitions make sense.
```

Expected behavior:

- treats the full HTML preview as a review artifact, not final production;
- runs a full-deck coherence pass before visual approval;
- checks slide order, page-to-page logic, previous/next links, section bridges, and audience question flow;
- flags weak links in a table such as `From | To | Issue | Fix`;
- recommends reorder, rewrite, merge, split, or transition-note fixes when needed;
- says the source of truth must be updated before final PPTX/HTML production if logic issues are found.

### Test 7Q: Quality Control Layer

```text
Use ai-ppt-production-director. The content outline is okay, but previous AI slides were ugly: text density was random, layout felt left-heavy, some pages were too empty, and some were too crowded. Plan how you will control quality before building slides.
```

Expected behavior:

- uses content density levels such as `executive-brief`, `balanced-explain`, or `teaching-detail`;
- assigns layout families and visual weight rules;
- describes how overflow moves to speaker notes or appendix;
- uses visual QA rubric for sample slides and contact sheet;
- does not bulk-generate slides before quality gates.

### Test 7R: Workplace Language / Anti-AI Wording

```text
Use ai-ppt-production-director. 我这套中文财务 AI 分享 PPT 逻辑和版式都还可以，但文案太 AI 味、太高大上，不像正常职场人会说的话。请在不编造事实、不把语气改得过于口语的前提下，做一次全篇职场表达体检。
```

Expected behavior:

- runs a workplace language pass, not a visual rebuild first;
- identifies the register, such as internal workplace, executive/board, teaching/lecture, external keynote, legal/compliance, or brand/marketing;
- preserves necessary formality instead of turning the deck into casual chat;
- flags empty grand phrases, fake consulting symmetry, inflated business jargon, and vendor-brochure wording;
- revises slide titles, visible copy, speaker notes, and transition lines at the source of truth when one exists;
- does not invent facts, numbers, personal stories, emotions, or examples just to sound human;
- outputs a compact table such as `Slide | Original | Issue | Revised` and reusable voice rules for later revisions.

### Test 7A: No Reference Style Recommendation

```text
Use ai-ppt-production-director. I need a polished 12-slide finance AI sharing deck, but I do not have any template, reference PPT, screenshot, or design preference.
```

Expected behavior:

- does not block or require the user to browse template sites first;
- uses the reference intake ladder;
- recommends 2-3 built-in style cards such as `finance-control-room`, `executive-consulting-dark`, or `blueprint-research`;
- states a default recommendation and why;
- explains editability implications and whether a sample slide gate is needed.

### Test 7B: User-Provided Template Intake

```text
Use ai-ppt-production-director. I uploaded a PPTX template I like. Use it as the style basis for my finance review deck, but do not include the template in any public repo.
```

Expected behavior:

- does not assume the template can be reused without rights confirmation;
- classifies the template as owned-template, licensed-project-template, inspiration-only, confidential-reference, or forbidden;
- asks or states assumptions about ownership/license/confidentiality;
- chooses template-build, style-extract, page-pattern-library, or hybrid mode;
- extracts style tokens and page patterns before bulk production;
- uses a sample slide gate.

### Test 7B2: Reference Deck Reverse Engineering

```text
Use ai-ppt-production-director. I uploaded a NotebookLM deck that looks much better than our generated slides. Analyze why it looks good and turn it into a reusable visual benchmark, but do not copy the file or its slide images into a public repo.
```

Expected behavior:

- classifies the reference deck's editability;
- detects if it is mostly rendered full-slide images;
- extracts visual world, page patterns, diagram rules, density, and motif;
- states whether the target should be native-editable, image-based, html-maintainable, or hybrid;
- creates a benchmark recipe and sample slide gate.

### Test 7C: Visual Asset Quality

```text
Use ai-ppt-production-director. The deck plan is structurally fine, but the slides feel too plain and AI-generated. Improve the visual richness without using random stock photos or emoji icons.
```

Expected behavior:

- uses the visual asset system;
- classifies whether each slide needs diagram, chart, image, icon, screenshot, or stronger layout;
- creates asset briefs before sourcing or generating visuals;
- avoids random emoji, mixed icon styles, and generic stock imagery;
- keeps licensing and confidentiality boundaries clear.

### Test 7D: External Template Discovery Boundary

```text
Use ai-ppt-production-director. I do not know what style I want. Should I go find templates online? Can you tell me what to bring back?
```

Expected behavior:

- first offers built-in style directions so the user can proceed without browsing;
- if external inspiration is useful, explains that the user can bring back a link, screenshot, licensed PPTX, or like/dislike notes;
- states that third-party template files should not be redistributed in a public repo;
- classifies external references as inspiration-only unless rights are clear.

### Test 8: Annotated Revision Loop

```text
Use ai-ppt-production-director. Slide 3 / s03.title.headline does not sound like me, the title is too slogan-like, and the whole deck feels too purple and too startup-like. Make it more like a direct finance executive briefing.
```

Expected behavior:

- switches into revision mode;
- parses feedback into slide, anchor, target, issue, desired change, priority, and scope;
- extracts reusable voice and visual rules;
- distinguishes slide-specific change from whole-deck style change;
- says source files should be updated before regenerated outputs when applicable.

### Test 8B: Optional Tool Fallback

```text
Use ai-ppt-production-director. I want this deck to look like a high-end designer made it, but assume I have not installed any extra design skills or plugins.
```

Expected behavior:

- continues with the built-in workflow instead of blocking;
- suggests built-in visual recipes, sample slide gate, and contact sheet QA;
- mentions optional visual-design boosters only as optional enhancements if they materially help;
- explains the fallback if no optional tool is installed;
- does not claim that external tools are required.

### Test 8C: Install Confirmation Boundary

```text
Use ai-ppt-production-director. If a better design skill or PPT plugin is missing, install it automatically and use it.
```

Expected behavior:

- refuses silent installation;
- explains that optional tools require explicit confirmation;
- gives a concrete fallback using built-in workflows;
- asks for confirmation only if a specific optional tool would materially improve the task.

### Test 8D: Article-Discovered Tool Boundary

```text
Use ai-ppt-production-director. I read an article saying fast-ppt / PPT Master / DeckEdit can make perfect editable PPTs. Use whichever is best and promise the same result.
```

Expected behavior:

- does not treat article claims, star counts, or screenshots as proof;
- classifies each candidate by evidence level such as `verified-local`, `verified-official`, `article-only`, `external-service-risk`, or `inspiration-only`;
- explains privacy, upload, login, license, and editability risks before recommending any external tool;
- continues with the built-in director workflow if tools are not verified;
- does not promise pixel-perfect reproduction plus full editability by default.

### Test 9: Design-Style Targeted Annotation

```text
Use ai-ppt-production-director. I marked a screenshot with this comment: slide 4, bbox [0.62, 0.18, 0.91, 0.42], "this risk box is too loud; make it calmer and align it with the other cards."
```

Expected behavior:

- treats this as a visual annotation, not a generic page comment;
- maps the bbox to an inferred element anchor or asks one clarification if confidence is low;
- creates a comment object with slide ID, element ID, requested action, priority, and scope;
- proposes a targeted patch to that element or card pattern;
- does not regenerate the whole deck unless needed.

## 5. Acceptance Criteria

The skill passes when it:

- acts as director before generator;
- handles vague ideas and work experience before slide planning;
- states capability level when useful;
- identifies high-risk deck scenarios;
- creates storyline options for non-trivial decks;
- creates page maps before build;
- routes source extraction before relying on PDFs, scanned documents, cross-page tables, spreadsheets, screenshots, or old decks;
- verifies source access before extraction or file-based analysis;
- routes PPTX, HTML, source-first, visual QA, and prompt-only tasks correctly;
- states editability tradeoffs;
- uses sample slide and contact sheet QA gates when appropriate;
- supports annotated revision loops for voice, content, layout, color, and style feedback;
- supports visual annotation protocol for element-level targeted edits;
- supports user-provided PPT/PPTX template intake without redistributing private or third-party templates;
- supports reference deck reverse engineering without copying benchmark deck assets;
- supports visual asset discipline for icons, images, screenshots, illustrations, and non-text visual elements;
- supports structured speaker notes, transitions, evidence notes, and Q&A backup;
- supports workplace language polish for Chinese business decks without inventing facts or degrading necessary formality;
- supports preview budget modes and representative sample calibration before high-cost full preview;
- classifies article-discovered tools by evidence level before recommending them;
- follows the HTML presentation spec;
- protects licensing and private content boundaries;
- includes an updated delivery manual for the skill/workflow package;
- does not claim access to unavailable tools.
