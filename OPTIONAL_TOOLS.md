# Optional Tools

`ai-ppt-production-director` is designed to work without third-party skills, plugins, or template files.

Optional tools can improve visual design, editable PPTX production, HTML decks, reference analysis, or annotation workflows, but they are not hard dependencies.

Tools discovered from articles, social posts, saved links, or roundup posts are not automatically trusted. Classify them by evidence level before recommending or using them.

## Product Rule

Default behavior:

- run the built-in director workflow first;
- use original template recipes and built-in QA rules when no optional tools are available;
- do not block the user because a booster tool is missing;
- never install tools, plugins, skills, templates, fonts, or assets silently;
- ask for user confirmation before any install, upload, connector authorization, or external-tool workflow.

## When To Mention Optional Tools

Do not mention optional tools for ordinary planning or low-risk internal drafts.

Mention them only when they materially improve the user's stated goal, such as:

- the user asks for designer-level visual quality;
- the user wants a NotebookLM-like or highly visual deck;
- the deck must be editable in PowerPoint;
- the deck needs Figma, Canva, or design-canvas style annotation;
- the user asks to use an external template website;
- the requested output depends on a tool that is not currently available.

## Confirmation Pattern

When a useful optional tool is missing, use this pattern:

```text
This deck can continue with the built-in workflow.

Optional enhancement:
- Tool: <tool or skill name>
- Why it helps: <specific benefit>
- Tradeoff: <install/auth/license/privacy cost>
- Fallback: <what I can do without it>

Do you want to use or install it?
```

Do not ask the user to install a tool unless the benefit is concrete.

## Evidence Levels For Article-Discovered Tools

| Level | Meaning | Recommended Action |
|---|---|---|
| verified-local | installed or tested in the current environment | can use with stated limits |
| verified-official | confirmed from official docs or primary source | can mention as a setup candidate |
| article-only | seen only in article, video, or roundup | do not rely on it; test first |
| external-service-risk | requires upload, login, payment, or third-party processing | ask before use and explain privacy/license risk |
| inspiration-only | useful method or design idea, not a tool dependency | extract the method, skip dependency |

Do not use star counts, viral posts, demo screenshots, or "one-click" claims as proof that a tool is reliable for production decks.

## Capability Categories

| Capability | Optional Tools | Best Use | Built-In Fallback |
|---|---|---|---|
| Anti-generic visual taste | Taste Skill, frontend-design, design-taste-frontend | stronger art direction and anti-AI-slop checks | visual recipes, sample slide gate, contact sheet QA |
| Editable PPTX production | PowerPoint automation, PPTX libraries, presentation plugins | real text boxes, charts, tables, notes, slide masters | source-first plan and prompt package |
| HTML deck production | guizang-ppt-skill, frontend HTML tools | browser-playable visual decks | `html-presentation-spec.md` and original HTML rules |
| Theme and style systems | theme-factory, design-system tools | palettes, typography, visual tokens | original template recipes |
| Visual concept pages | canvas-design, image generation tools | covers, section breaks, keynote visuals | semi-editable layouts and asset briefs |
| Design canvas and annotation | Figma, Canva, Claude Design-like workflows | element-level comments, visual review, design handoff | `visual-annotation-protocol.md` with slide IDs, element anchors, and bbox comments |
| Source extraction | PDF/table/OCR tools | scanned PDFs, cross-page tables, old decks | source extraction routing and confidence flags |

## External Template Websites

Template websites can be recommended as inspiration sources, but this repository must not redistribute their files.

Allowed:

- link to template websites;
- ask the user to choose a style direction;
- use the user's licensed template in a private project after rights are classified;
- extract abstract style tokens and page-pattern ideas when allowed.

Not allowed:

- include downloaded template files in this repository;
- commit template screenshots or previews;
- clone a commercial template into a public seed template;
- imply that a third-party template license automatically permits redistribution.

## Recommended User Flow

If the user has no visual reference, offer 2-3 built-in style directions first.

If the user wants stronger inspiration, suggest looking at external template sites and returning with:

- a link;
- a screenshot;
- a downloaded template they have rights to use;
- or a short description of what they like.

Then classify the reference as:

- owned-template;
- licensed-project-template;
- inspiration-only;
- confidential-reference;
- forbidden.

## Public Repository Boundary

Public repository content may include:

- optional tool registry;
- install guidance;
- links to third-party tools;
- abstract benchmark recipes;
- fictional examples;
- original seed templates.

Public repository content must not include:

- third-party template files;
- copied preview images;
- user-uploaded decks;
- proprietary fonts, icons, images, or brand systems;
- private examples or local machine paths.
