# QA Checklist

Run this checklist before final delivery.

## Content

- The deck has one clear thesis or point of view.
- The audience promise is explicit.
- A source of truth exists for non-trivial decks: idea brief, talk script, slide source, page argument map, or equivalent.
- The deck has one story spine and the slide order supports it.
- Full-deck preview, HTML preview, complete storyboard, or contact sheet has been checked for slide order and page-to-page logic when available.
- Every slide answers one clear question.
- Every slide has a clear logic role in the deck.
- Every slide connects to the previous slide and prepares the next slide.
- The audience's likely next question is answered by the following slide or by an explicit transition.
- Major section transitions have explicit bridge sentences or speaker-note cues.
- Slide titles are conclusion-style, not vague labels.
- Slide titles and body copy sound like credible workplace language, not generic AI slogans.
- Every slide advances the story instead of merely listing information.
- No slide feels like a disconnected point from a different outline.
- Facts trace back to a source or are clearly marked as assumptions.
- No private or sensitive source material appears without approval.
- No placeholder text remains.
- No repeated filler sentences.
- No empty grand phrases, fake consulting symmetry, or inflated business jargon remains unless explicitly required by source or audience.

## Source Access

- Source access is verified before content claims are made from files.
- User-provided files are classified as actual attachment, current workspace file, explicit local path, mentioned-only file, cloud/link reference, or inaccessible source.
- File analysis uses only the verified source/object/path.
- `Files mentioned by the user` paths are treated as exact user-provided references, not permission to scan sibling folders.
- Memory files, previous session logs, rollout summaries, and remembered paths were not used to locate or substitute the current source file unless the user explicitly requested that lookup.
- If a visible path is forbidden by the user's boundary, the agent asks for a workspace copy or another readable attachment instead of reading it.
- Inaccessible uploads are reported precisely: visible filename/path, missing workspace copy, missing attachment object, or missing connector access.

## Source Extraction

- Source type and extraction route are documented for PDFs, scanned documents, spreadsheets, screenshots, and old decks.
- Cross-page tables are reconstructed and validated before use.
- Extracted numbers preserve source page, unit, period, currency, and sign.
- Low-confidence extraction is marked as assumption or kept out of confident slide claims.
- High-stakes financial or operational tables have been spot-checked against source material.

## Visual

- One visual direction or recipe is consistently applied.
- Aesthetic boundaries are explicit: layout families, density, palette, type scale, chart language, asset role, and avoid list.
- Layout family and grid are defined for non-trivial slides.
- Visual weight, alignment, and spacing feel intentional.
- Content density level matches the slide's audience and purpose.
- Text does not overflow, clip, or overlap.
- Page rhythm is consistent.
- Charts and tables are readable.
- Dense content is split, moved to notes, or placed in appendix.
- Colors and typography follow one selected recipe.
- No random style mixing unless approved.
- Visual QA rubric has been run on sample slides or contact sheet when preview/rendering is available.

## Visual Assets

- Icons, images, screenshots, illustrations, and decorative elements have defined roles.
- No random emoji or mixed icon styles are used as business visuals.
- Image and icon rights are clear or placeholders are used.
- Visual assets support the slide message instead of filling empty space.
- Asset style, crop, color treatment, and density are consistent.

## Review Gates

- Thesis gate passed.
- Storyline gate passed for non-trivial decks.
- Page map gate passed before full build.
- Visual direction gate passed before bulk design.
- Preview budget was selected before high-cost visual generation.
- Sample or preview gate used for high-risk, external, visually uncertain, or untested visual work.
- Representative sample gates include at least one hard page, not only a cover or divider.
- Contact sheet QA used when rendering or screenshots are available.

## Revision Fit

- User voice feedback has been converted into reusable voice rules.
- AI-flavored wording feedback has been converted into workplace language rules, not only one-off sentence edits.
- Visual feedback has been converted into style tokens or recipe changes.
- Marked slide/page comments have been resolved or listed as open.
- Source files were updated before regenerated outputs when applicable.
- Similar issues were checked across the deck, not only on the commented slide.

## PPTX

- Editability level is stated.
- Route disclosure is stated before delivery: native-editable, semi-editable, html-maintainable, image-based, hybrid, or pdf-only.
- Studio Hybrid Mode page-level editability is stated when both visual quality and editability matter.
- Slides are editable where possible.
- Layouts use real text boxes, shapes, charts, and slide masters when available.
- Images are not used as full-slide screenshots unless intentionally required.
- Speaker notes are separated from visible slide text.

## HTML

- One slide is visible at a time.
- Keyboard navigation works.
- Page indicator works.
- Media uses relative paths.
- Video does not autoplay unless requested.
- `slides_source.md` or `slides_source.json` is present when maintainability matters.
- If HTML is only a storyboard preview, it is labeled as a review artifact and not promised as pixel-perfect PPTX source.

## Licensing

- No third-party template files are redistributed.
- External assets have rights cleared or are replaced with placeholders.
- Brand assets are used only with permission.
- Public examples are fictional or sanitized.
- User-provided templates have been classified by rights and confidentiality before use.
- Uploaded user templates, screenshots, and extracted proprietary assets are not included in public packages.

## Template Fit

- If a user template is provided, its use mode is stated: template-build, style-extract, page-pattern-library, or hybrid.
- Extracted style tokens are documented.
- Important page patterns are identified.
- A sample slide gate is used before bulk production.
- Editability impact is stated.

## Reference Benchmark Fit

- Good-looking reference decks are classified by editability: editable-template, rendered-poster-deck, hybrid-deck, inspiration-only, or forbidden.
- Visual world, page patterns, motif, density rules, and diagram rules are documented.
- The target implementation mode is stated before production.
- High visual fidelity is not confused with PowerPoint editability.

## Quality Control

- Storyline coherence check is complete for non-trivial decks.
- Full-deck preview coherence pass is complete when a full preview exists.
- Workplace language pass is complete for Chinese business decks, especially before full preview or final delivery.
- Preview review loop is used when the user needs to judge visible pages or is unsure about style.
- Full HTML preview is justified by user request, risk level, or cost/time tradeoff.
- Content density levels are assigned or implicitly justified.
- Layout grammar is applied to representative pages.
- Studio Hybrid Mode is used when the user wants both strong visual quality and practical editability.
- Sample slides meet the required visual QA threshold before bulk production.
- File generation was not treated as completion without logic, visual, editability, source, licensing, and notes QA.

## Delivery Package

- Final deck file is present.
- Source file is present when applicable.
- Media folder is present when applicable.
- Delivery manual is present and updated when the work is a skill, workflow, or reusable package.
- QA notes or known limitations are documented.
- Next-step edit instructions are short and practical.
