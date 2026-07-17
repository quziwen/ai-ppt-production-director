# Reference Intake Ladder

Use this ladder to decide how much reference material the user needs to provide.

The product principle is: the user should not need to bring a perfect reference deck before the workflow can start.

## Ladder Levels

| Level | User Has | Agent Behavior |
|---|---|---|
| L0 No Reference | only a topic, idea, or work experience | recommend 2-3 style cards from `style-lookbook.md` |
| L1 Preference Words | words like premium, clean, consulting, NotebookLM-like | translate words into visual tokens and risks |
| L2 Chosen Style Card | user picks one built-in style | use the matching recipe and sample slide gate |
| L3 External Inspiration | user gives website, screenshot, article, or template preview | extract abstract style only; check rights |
| L4 User Template | user uploads PPT/PPTX they can use | classify rights and choose template-build or style-extract |
| L5 Brand System | user provides brand guide, master template, fonts, assets | follow brand constraints and avoid public redistribution |

## Default Behavior

If the user gives no reference:

- do not block;
- do not ask them to search the web first;
- infer likely style needs from audience and scene;
- offer style cards;
- pick a default when the user wants speed.

If the user gives a vague preference:

- turn it into concrete design tokens;
- state what that style should avoid;
- propose sample slides.

If the user provides an external template link:

- treat it as inspiration until rights are clear;
- do not copy template files or preview images;
- ask whether the user has downloaded/licensed it only if actual reuse is required.

If the user uploads a PPTX:

- run `user-template-intake.md`;
- classify rights and confidentiality;
- decide whether it is a real editable template, rendered-poster deck, hybrid deck, or inspiration-only.

## Reference Translation

Translate user language into production rules.

| User Says | Translate To |
|---|---|
| make it high-end | stronger type hierarchy, restrained palette, more white space, fewer low-quality icons |
| like NotebookLM | blueprint-research, diagram-rich, likely hybrid route, sample slide gate |
| like consulting | conclusion titles, issue tree, matrix, roadmap, disciplined accent color |
| not too empty | balanced-explain density, stronger diagrams, avoid slogan-only pages |
| not too crowded | executive-brief density, appendix for detail, stronger hierarchy |
| make it editable | native-editable PPTX route, avoid full-slide image pages except special cases |
| make it exactly like this screenshot | clarify tradeoff: pixel-like fidelity may reduce editability |

## Output Template

```text
Reference level:
What the user has:
What can be inferred:
Recommended style cards:
Rights/confidentiality boundary:
Editability implication:
Next gate:
```

