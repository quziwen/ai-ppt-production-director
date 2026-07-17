# Feishu AI PPT Article Review

This note summarizes PPT-production patterns found from the maintainer's Feishu account search and public project verification. It is safe for a public repository: it does not copy private chats, internal cases, proprietary decks, screenshots, or third-party template files.

## Scope

Sources reviewed:

- Feishu message search for `PPT` and `mp.weixin.qq.com/s` links.
- Feishu Docs/Wiki keyword reads for AI/PPT notes and NotebookLM-related articles.
- Public project pages that can be independently checked.

Local extraction artifacts were used during research but are not part of this repository. Do not commit raw Feishu exports, message search results, local paths, or private extraction files.

## Feishu-Saved Materials

| Material | Read Level | Main Idea | Use For This Skill | Evidence Level |
|---|---|---|---|---|
| `600页AI-PPT实战后，我写了这篇全网最全NotebookLM 制作 PPT教程` | keyword excerpts from Feishu doc | Better results come from preparing a strong source document or talk script before asking NotebookLM to generate slides. | Add source-document-first workflow and user-facing guidance for vague ideas. | Feishu doc excerpt, not independently benchmarked here |
| `3分钟出课件！NotebookLM 自动化 PPT生成流（附指令+模板）` | keyword excerpts from Feishu wiki | A structured instruction formula improves output: theme, audience, narrative style, constraints, page count. | Strengthen intake and prompt handoff templates. | Feishu doc excerpt, not independently benchmarked here |
| `AI制作PPT学习记录` | keyword excerpts from Feishu wiki | The hard part is decomposing a vague PPT need into AI-executable tasks: story, page structure, conclusion titles, visual route. | Confirms the director positioning and page-map-first behavior. | Feishu doc excerpt, owned/accessible note |
| `2026-05-05_guizang-ppt-skill` | keyword excerpts from Feishu doc | Stable output comes from workflow plus aesthetic boundaries, not free-form generation. | Add visual-boundary and layout-library rules. | Feishu doc excerpt plus public project verification |
| `CyberPPT` card | Feishu card summary plus public GitHub page | Uses evidence table, storyline comparison, visual blueprint, strict QA, and staged PPTX generation. | Borrow the staged gates, evidence traceability, and blueprint-before-build principle. | Public GitHub verified |
| `codex-ppt-skill` card/article | public GitHub page | Confirms outline, page points, style direction, sample image, style library, speech notes, and multi-agent generation as useful production controls. | Borrow style sample gate, personal style library concept, speaker-note generation, and staged approvals. | Public GitHub verified |
| `html-ppt-skill` card/article | public GitHub page | Token-driven design system, many themes/layouts, iframe preview isolation, static HTML output. | Borrow design-token and preview-isolation ideas for HTML preview. | Public GitHub verified |
| `guizang-ppt-skill` card/article | public listing plus Feishu note | Two explicit visual systems, locked layouts, keyboard-driven single-file HTML, theme presets. | Borrow visual-system choice, locked layout families, and HTML deck constraints. | Public project page verified |
| `NanoBanana PPT Skills` card/article | public GitHub page | Image-first PPT and video transitions can improve visual quality but reduce editability and require external APIs. | Treat as optional image/video production booster, not default route. | Public GitHub verified |
| `WorkBuddy制作超好看PPT，原来就靠这个skill！` | Feishu card summary only | Suggests PPT quality depends on skill/workflow rather than a magic button. | Supports public positioning, but do not cite as verified capability. | Unverified summary only |
| `25款开源PPT技能实测，Claude Code制作PPT实际效果如何` | Feishu card summary only | Mentions many open-source PPT skills and real testing. | Candidate for future manual review. | Unverified summary only |
| `告别手搓 PPT：6 个 Prompt 让 Claude 帮你几分钟产出一份完整演示文稿` | Feishu card summary only | Decomposes PPT work into topic, structure, page content, notes, style, export. | Reinforces staged prompt chain; do not treat as proof of quality. | Unverified summary only |

## Publicly Verified Projects

- CyberPPT: public GitHub page states a three-stage flow: source analysis, style and blueprint selection, then editable PPT generation. It also documents evidence gates, style gates, editable layer gates, visual semantic gates, and strict QA.
- codex-ppt-skill: public GitHub page states staged confirmation of outline, page points, style direction, sample result, personal style library, multi-agent generation, and automatic speech notes.
- html-ppt-skill: public GitHub page states a token-driven HTML design system, iframe-isolated previews, static HTML/CSS/JS, and Chinese/English font support.
- guizang-ppt-skill: public project page states two visual systems, locked layouts, theme presets, single-file HTML, and keyboard navigation.
- NanoBanana PPT Skills: public GitHub page states document analysis, image-first high-resolution slides, transition video generation, and API requirements.

## Design Principles To Absorb

### 1. Source Document First

For vague ideas, do not jump straight to slides. First produce one of:

- idea brief;
- talk script;
- source document;
- page argument map;
- slide source JSON/Markdown.

This improves both content quality and downstream presentation generation.

### 2. Aesthetic Boundaries Beat Free-Form Design

Do not ask the model to invent a deck from unrestricted style words. Use:

- visual recipes;
- locked layout families;
- density levels;
- design tokens;
- typography scale;
- chart language;
- sample slide gates.

### 3. Style Samples Before Full Production

For visually uncertain work, produce a representative sample before building the full deck. The sample should test a hard page, not only a cover.

### 4. Blueprint Before Build

A visual blueprint or page map should lock:

- slide purpose;
- layout family;
- content density;
- visual hierarchy;
- asset needs;
- editability target;
- notes direction.

### 5. Editability And Visual Fidelity Are Separate Routes

Image-first and HTML-first workflows may look better. Native PPTX workflows may be more editable. A professional director skill must state the route and the tradeoff rather than promising all at once.

### 6. Personal Style Memory Should Live Outside Public Skill Packages

Users may build personal style libraries from their own references. Public repositories should include only original recipes and placeholder assets.

### 7. Speaker Notes Are Part Of Production

Important decks should include notes, transitions, evidence reminders, and Q&A backup. Notes also help reduce visible text density.

### 8. QA Must Include Logic And Rendering

Do not stop at file generation. Check story coherence, density, layout balance, overflow, editability, source traceability, and visual screenshots when possible.

## Not To Absorb

- One-click marketing claims.
- Third-party template files.
- Full-slide screenshots as the default editable PPTX strategy.
- Private decks, internal examples, private brand assets, or copied NotebookLM output.
- Any claim that a tool can always achieve pixel-perfect HTML-to-PPTX conversion.

## Backlog For Future Review

- Open and review the full text of the unverified WeChat articles if they become important.
- Build a benchmark prompt suite comparing this skill with image-first, HTML-first, and native-PPTX-first skills.
- Add an optional style-library mechanism that saves user-approved style cards outside the public repository.
- Add a sample-slide QA script or contact-sheet checker if the build environment supports rendering.
