# Optional Capability Registry

Use this registry when deciding whether to call, recommend, install, or skip optional presentation-related tools.

The director workflow must remain functional without any optional tools.

## Capability Policy

1. Built-in first: use the core workflow, original template recipes, routing matrix, QA checklist, and licensing policy by default.
2. Enhancement only: optional tools improve a specific stage; they do not replace the director workflow.
3. Confirm before install: never install or authorize a tool without explicit user confirmation.
4. Explain fallback: when an optional tool is missing, state what can still be done.
5. Respect rights: optional design or template tools do not override licensing, privacy, or redistribution boundaries.

## Availability Levels

| Level | Meaning | Behavior |
|---|---|---|
| available | the tool or skill is installed and appropriate | route the relevant subtask to it after stating why |
| unavailable | not installed or not callable | continue with built-in fallback and optionally suggest install |
| unknown | not checked | do not assume; proceed with built-in workflow unless the user asks for that tool |
| blocked | requires login, license, connector, network, or user asset | explain the blocker and ask before proceeding |

## Evidence Levels

Use evidence levels before recommending any tool that was discovered from articles, social posts, roundups, or saved links.

| Level | Meaning | Public Claim Allowed |
|---|---|---|
| verified-local | installed or tested in the current environment | may recommend for matching tasks with stated limits |
| verified-official | confirmed from official docs or primary source, but not locally tested | may mention as candidate with setup caveat |
| article-only | seen in article, video, roundup, or secondary summary only | do not rely on it; list as needs testing |
| external-service-risk | requires upload, login, paid plan, or third-party processing | ask before use and note privacy/license risk |
| inspiration-only | useful idea, not a dependable tool route | extract method, not tool dependency |

Do not use star counts, viral posts, or one-click demo screenshots as proof of production quality.

## Recommended Capability Map

| Need | Optional Capability | Use When | Fallback |
|---|---|---|---|
| Improve AI visual taste | Taste Skill, `frontend-design`, `design-taste-frontend` | visual quality is a major requirement or prior output looked generic | use visual recipes, anti-generic checklist, sample slide gate |
| Generate editable PowerPoint | PPTX library, PowerPoint automation, presentation plugin | final deck must be edited in PowerPoint | produce `slides_source.md/json` and a build prompt package |
| Produce HTML deck | HTML deck skill, `guizang-ppt-skill`, frontend builder | browser playback, animation, or highly visual talk is required | follow `html-presentation-spec.md` |
| Create style tokens | theme system, `theme-factory`, design-system tool | user lacks a style reference or wants several visual directions | choose from original template recipes |
| Create hero visuals | `canvas-design`, image generator | cover, section break, or conceptual keynote page needs visual impact | use semi-editable PPTX layout with simple shapes and controlled assets |
| Annotated visual editing | Figma, Canva, design canvas, screenshot annotation | user wants to mark an exact region or element | use slide ID, element anchors, and bbox comment protocol |
| Inspect reference decks | PPTX/PDF/image analysis tools | user provides a NotebookLM deck, screenshot set, or benchmark deck | classify reference and extract abstract style manually |
| Extract source data | PDF/OCR/table extraction tools | source PDFs, scans, spreadsheets, or screenshots contain evidence | mark confidence, request source checks, avoid unsupported claims |
| Build from article-discovered tools | PPT Master, fast-ppt, DeckEdit, CODIA, OfficeCLI, or similar | only after evidence level and privacy boundary are clear | keep built-in workflow and mark as candidate-needs-test |

## Installation Guidance

Only suggest installation when all are true:

- the user request clearly benefits from the tool;
- the built-in fallback would be materially weaker;
- the tool can be named precisely;
- licensing and privacy implications are acceptable or can be explained;
- the user can choose not to install and still receive a useful result.

Suggested wording:

```text
I can continue with the built-in workflow. For stronger <capability>, you can optionally install/use <tool>. It would help with <specific task>. Without it, I will use <fallback>. Do you want to proceed with the optional tool?
```

## What Not To Do

- Do not make optional tools mandatory.
- Do not silently install dependencies.
- Do not recommend a tool just because it exists.
- Do not send private decks, screenshots, templates, or business data to a connector without user approval.
- Do not promise pixel-perfect reproduction and full editability just because a design tool is available.
- Do not publish third-party template files in this repository.
- Do not present article-only tools as verified capabilities.
- Do not use external upload services for private decks or source files without explicit user approval.

## Lightweight Tool Record

When an optional tool affects production, add a short note to the stage record:

```text
Optional tool:
Capability:
Why used:
User confirmation:
Inputs shared:
Fallback if unavailable:
Output produced:
Licensing/privacy note:
Evidence level:
```

## Article-Derived Tool Triage

When a saved article introduces a PPT skill, plugin, MCP, CLI tool, GitHub project, template site, or commercial AI PPT product, triage it before adding it to a workflow:

```text
Tool:
Source article:
Claimed capability:
Evidence level:
Local availability:
Requires upload/login/payment:
Privacy risk:
License risk:
Best-fit task:
Fallback:
Decision: verified / test later / inspiration only / skip
```
