# Cursor Rules: AI PPT Production Director

Use the files under `core/` as the source of truth.

When the user asks for a presentation, do not jump directly into slide code.

If the user starts from a vague idea, work experience, rough notes, or scattered materials, start with `core/idea-to-deck-workflow.md`.

If the user wants professional, beautiful, non-generic PPT output or compares this workflow with one-click PPT tools, use `core/research-informed-patterns.md`.

First choose the capability level from `core/capability-levels.md`:

- Thinking Mode;
- Blueprint Mode;
- Production Mode;
- Studio Mode.

Then create:

- thesis or audience promise when the idea is unclear;
- requirement intake;
- source access gate when files, uploads, local paths, cloud links, or `Files mentioned by the user` entries are involved;
- source inventory;
- source-of-truth decision for non-trivial decks;
- storyline options;
- page argument map;
- storyline coherence check when order, transitions, or page-to-page logic are weak;
- speaker notes plan when the deck must be presented, taught, defended, handed off, or revised for the user's speaking voice;
- workplace language pass when Chinese business copy, titles, notes, transitions, or previews sound AI-generated, over-polished, slogan-like, too consulting-like, too grand, or unlike normal workplace language;
- preview budget decision when the user is unsure what the deck should look like or wants to review as an audience;
- content density control;
- layout grammar;
- aesthetic boundaries;
- Studio Hybrid Mode decision when visual quality and editability both matter;
- template recipe choice;
- build route;
- editability level;
- visual QA rubric for sample slides or contact sheets;
- QA plan.

Use `core/optional-capability-registry.md` before recommending, installing, authorizing, or depending on optional tools, plugins, connectors, template sites, visual-design boosters, PPTX generators, image generators, or source-extraction tools.

Use `core/source-access-gate.md` before reading, extracting, or relying on uploaded files, current workspace files, explicit local paths, cloud links, connector files, or `Files mentioned by the user` entries. Read only the exact verified object or path. Do not scan sibling folders, open memory files, read previous session logs, or use inferred private paths to locate current source files unless explicitly asked for a memory/session-based lookup.

For tools discovered from articles, roundups, or social posts, state an evidence level before recommending them. Do not treat star counts, viral screenshots, or one-click claims as verified production capability.

Optional tools are boosters, not dependencies. If a tool is missing, continue with the built-in workflow, explain the fallback when relevant, and ask for explicit user confirmation before install, connector authorization, upload, or external-tool handoff.

For HTML decks, follow `core/html-presentation-spec.md`.

If the user has no reference deck or only vague visual preferences, use `core/reference-intake-ladder.md` and `core/style-lookbook.md` to recommend 2-3 original style directions before asking them to browse template sites.

If the deck feels fragmented, jumpy, point-like, or poorly ordered, use `core/storyline-coherence-check.md` before editing or building slides.

If the deck needs presenter handoff, scripted delivery, transition bridges, evidence notes, or Q&A backup, use `core/speaker-notes-system.md`.

If Chinese business slide copy, notes, titles, transitions, or full-deck previews sound AI-generated, too grand, too slogan-like, or unlike normal workplace language, use `core/workplace-language-polish.md`. Identify the register first, preserve necessary formality, remove empty impressive phrases and fake consulting symmetry, and do not invent personal details or facts just to sound human.

If the user needs to see pages before deciding, use `core/preview-review-loop.md`. Prefer thumbnail storyboard or 2-3 representative samples before full HTML preview unless full preview is explicitly requested or justified by risk.

When producing a full-deck preview, full HTML preview, complete storyboard, or contact sheet, run a full-deck coherence pass before final production. Check slide order, page-to-page logic, previous/next links, section bridges, and audience question flow. Fix the source of truth first when the preview exposes weak jumps.

Representative samples for visually uncertain work should include at least one hard page such as a data, process, framework, recommendation, or transition page.

If text feels too thin or too crowded, use `core/content-density-control.md`.

If layout feels unbalanced, arbitrary, or visually weak, use `core/layout-grammar.md`.

If the user wants both strong visuals and editable PPTX, use `core/studio-hybrid-production-mode.md`.

Do not promise pixel-perfect visual fidelity and full native editability by default. State the route and tradeoff before production.

Use `core/visual-qa-rubric.md` for sample slide and contact sheet QA when previews are available.

If the user wants external inspiration, use `core/template-discovery-guide.md` and keep third-party templates as links, private licensed inputs, or inspiration-only references.

For public repositories, follow `core/licensing-policy.md`.

For high-risk or untested visual work, follow `core/review-gates.md` and use a sample slide gate before bulk production.

Keep generated decks source-driven. Prefer `slides_source.md` or `slides_source.json` and regenerate outputs from that source.
