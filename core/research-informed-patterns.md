# Research-Informed Production Patterns

Use this module when the user expects higher-than-basic PPT quality, starts from vague ideas, compares this skill with one-click PPT tools, or asks why AI-generated decks look generic.

These patterns are distilled from public PPT skill projects and from private Feishu research notes. They are process patterns only. Do not copy third-party templates, screenshots, private decks, or proprietary examples.

## Pattern 1: Source Document First

If the user starts from a vague idea, work experience, meeting memory, or scattered notes, do not immediately build slides.

First stabilize one source of truth:

- `idea_brief.md` for a rough thought;
- `talk_script.md` for a speech-led deck;
- `slides_source.md` for Markdown-first production;
- `slides_source.json` for multi-format production;
- page argument map for executive or high-risk decks.

Use this especially when the user says:

- "I only have an idea";
- "help me expand this experience into a presentation";
- "I do not know what each page should say";
- "previous AI slides looked shallow or jumpy".

## Pattern 2: Aesthetic Boundaries Before Design

Before visual production, lock practical boundaries:

- recipe or visual system;
- 2-5 layout families;
- density level;
- typography scale;
- palette and accent rules;
- chart and diagram language;
- image/icon role;
- what must not appear.

Do not rely on vague style words like "premium", "modern", "McKinsey-like", or "NotebookLM-like" without translating them into rules.

## Pattern 3: Style Sample Gate

When visual risk is high, generate representative samples before the full deck.

The sample set should include at least one hard page:

- complex data page;
- process or framework page;
- key argument page;
- decision or recommendation page;
- section transition page.

The sample gate passes only when the user or QA confirms:

- style direction;
- density;
- layout balance;
- readability;
- editability route;
- obvious audience confusion.

## Pattern 4: Blueprint Before Build

Before production, each page needs a blueprint-level decision:

- page role in the story;
- conclusion title;
- question answered;
- previous slide link;
- next slide setup;
- layout family;
- visual hierarchy;
- content density;
- notes direction;
- asset plan;
- editability target.

For complex visuals, the blueprint may include a wireframe, visual prompt, or element anchor list. The blueprint is not a final background image unless the user explicitly chooses image-based output.

## Pattern 5: Route Disclosure

State the route before building:

- `native-editable`: best for PowerPoint edits, lower visual complexity;
- `semi-editable`: key text and charts editable, decorative or complex visuals may be image/SVG;
- `html-maintainable`: strong web preview and animation, final PPTX may not match pixel-for-pixel;
- `image-based`: strongest visual fidelity, weakest editability;
- `hybrid`: page-level mix of the above.

Never promise pixel-perfect visual quality and full native editability by default. If the user wants both, use Studio Hybrid Mode and disclose which pages are native, semi-editable, or image-based.

## Pattern 6: Personal Style Library

If the user repeatedly likes a specific style, create a style card that can be stored outside the public skill package.

A style card should include:

- name;
- use cases;
- palette;
- type scale;
- layout families;
- density rules;
- chart language;
- motifs;
- avoid list;
- sample-slide notes.

Do not commit user-uploaded templates, screenshots, or extracted proprietary assets to the public repo.

## Pattern 7: Notes As Compression Layer

Use speaker notes to keep visible slides clean while preserving substance.

Move these into notes when the slide is too crowded:

- context explanation;
- evidence detail;
- caveats;
- transition sentences;
- likely objections;
- backup numbers.

## Pattern 8: QA Is Not File Existence

A deck is not done because a file exists. Final QA should check:

- storyline coherence;
- source traceability;
- density;
- visual hierarchy;
- overflow and alignment;
- editability;
- media paths;
- speaker notes;
- licensing;
- delivery instructions.

## Evidence Levels

When citing tools or external workflows, classify evidence:

- `verified-public`: checked against public project/docs;
- `feishu-excerpt`: read from the user's accessible Feishu document excerpt;
- `card-summary`: only a Feishu card/snippet was available;
- `unverified-claim`: not enough evidence to rely on.

Use verified-public and feishu-excerpt patterns for design. Treat card-summary and unverified-claim as backlog only.
