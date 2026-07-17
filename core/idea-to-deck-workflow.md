# Idea-to-Deck Workflow

Use this workflow when the user starts with a vague idea, a work experience, raw notes, a project memory, or a rough presentation request.

The goal is to produce a presentation that has a point of view, a coherent story, page-level substance, and a controlled production route. Do not treat the first prompt as a slide-generation order unless the user explicitly asks for a low-risk quick draft.

## Role Model

Think like a small production studio:

| Role | Job | Output |
|---|---|---|
| Writer | Turn a spark, experience, or fragment into a defensible point of view | thesis, audience promise, raw material list |
| Screenwriter | Convert the point of view into a narrative arc | storyline options, scene order, tension, payoff |
| Director | Decide what each slide must make the audience see, feel, and conclude | page argument map, visual direction, pacing |
| Production Crew | Build the deck in the right medium and run QA | PPTX, HTML, PDF, prompt package, notes, QA log |

The same agent may play all roles, but it must not skip roles silently on important decks.

## Stage 0. Capability And Mode Check

Before committing to output, identify the working mode.

| Mode | Use When | Expected Output |
|---|---|---|
| Thinking Mode | user has only an idea, experience, theme, or messy notes | clarified thesis, audience, angles, questions |
| Blueprint Mode | user needs structure before making slides | storyline, page map, visual recipe, QA plan |
| Production Mode | user has approved structure and asks for actual files | PPTX/HTML/source files and QA notes |
| Studio Mode | high-stakes deck with multiple materials or agents | staged approvals, preview budget, sample/section preview, final package |

If tool access is limited, produce the strongest blueprint and a copyable build prompt instead of pretending production tools exist.

## Stage 1. Spark Intake

Capture the starting point:

- what happened, what was learned, or what changed;
- why this topic matters now;
- who the audience is and what they already believe;
- what the audience should think, feel, decide, or do after the talk;
- what evidence, examples, data, or stories are available;
- what cannot be disclosed;
- desired tone, formality, length, page count, and output format.

When information is missing, ask the smallest number of questions needed to decide the thesis and audience promise. If a reasonable assumption is safe, state it and continue.

## Stage 2. Writer Pass

Turn the raw idea into substance.

Produce:

- a one-sentence thesis;
- the audience promise: "after this deck, the audience will understand/decide/do...";
- 3-5 core arguments;
- supporting evidence needed for each argument;
- weak spots, missing proof, and possible objections;
- a short list of material that should stay in appendix or speaker notes.

For work-experience decks, extract transferable lessons instead of retelling every event.

## Stage 3. Screenwriter Pass

Create 2-3 storyline options for non-trivial decks.

Each option should include:

- narrative logic;
- opening hook;
- tension or problem;
- turning point;
- resolution or ask;
- best-fit audience;
- tradeoff and risk.

Recommend one storyline and explain why it fits the objective and audience.

## Stage 4. Director Pass

Translate the story into slide-level decisions.

Create a page argument map before production:

- slide number;
- conclusion-style title;
- question answered;
- audience reaction desired;
- visible content direction;
- evidence/source needed;
- visual form;
- speaker notes direction;
- build risk;
- confirmation needed.

For high-risk decks, do not build all slides before the page argument map is approved.

## Stage 5. Visual Direction

Select or propose a visual direction.

For vague or high-stakes decks, provide 2-3 visual directions before choosing one recipe. A direction should define:

- tone;
- palette;
- typography style;
- grid and density;
- chart language;
- image or illustration treatment;
- motion/media rules;
- what to avoid.

Use original recipes from `template-recipes.md`. Third-party templates may be referenced as inspiration or links, but must not be redistributed.

## Stage 6. Preview Review Route

If the user needs to see pages before deciding, is not confident in PPT design, or cannot describe the desired style, choose a preview budget before production:

- thumbnail storyboard for flow and audience reaction;
- 2-3 representative sample pages for style, density, and layout calibration;
- section preview for longer decks;
- full HTML storyboard preview only when the user asks for it or risk justifies the cost.

Prefer representative samples over full-deck preview when style is the main uncertainty.

## Stage 7. Production Route

Choose the build route after structure and visual direction are stable.

Common routes:

- native editable PPTX;
- HTML deck;
- Markdown/Marp-style source;
- PDF-only handout;
- prompt-only package for another tool;
- hybrid route, such as PPTX first then HTML.

If both PPTX and HTML are required, stabilize the source and PPTX first unless the user explicitly chooses HTML-first.

## Stage 8. Review Gates

Use review gates according to risk:

- thesis gate;
- storyline gate;
- page map gate;
- visual direction gate;
- preview budget gate;
- sample or preview gate;
- full build gate;
- final QA gate.

For new tools, new templates, user-uncertain visual styles, or high-stakes decks, build representative samples or a section preview before bulk production.

## Stage 9. Delivery Record

Keep the record short:

- current stage;
- decisions made;
- unresolved questions;
- files created or changed;
- next action.

The record is not a transcript. It exists to keep long production work restartable.
