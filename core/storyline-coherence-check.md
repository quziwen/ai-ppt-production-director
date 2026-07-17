# Storyline Coherence Check

Use this check when a deck feels jumpy, fragmented, point-like, or when slide order may not match the audience's reasoning path.

The goal is to make the deck read as one argument, not a collection of isolated pages.

## When To Run

Run this check:

- after storyline selection and page map creation;
- before full slide production;
- after a full-deck preview, full HTML preview, complete storyboard, or contact sheet is generated;
- when combining notes from multiple sources;
- when an AI-generated draft feels like disconnected bullet points;
- when the user says the order, logic, transition, or flow feels wrong;
- before final QA for executive, board, client, classroom, or external decks.

For quick low-risk drafts, run a lightweight version.

When a full-deck preview exists, do not review only visual appearance. Re-run the slide chain, question flow, and transition quality checks on the preview as a complete audience experience.

## Core Principle

Every slide should have a reason to be where it is.

For each slide, answer:

- Why does this slide come after the previous slide?
- What question does it answer that the previous slide raised?
- What does it prepare the audience to understand or decide next?
- What would break if this slide were removed or moved?

## Story Logic Types

Classify the deck's main logic before reordering pages.

| Logic Type | Sequence Pattern | Best For |
|---|---|---|
| problem-solution | context -> problem -> root cause -> solution -> impact -> ask | transformation, issue resolution |
| decision-first | ask -> facts -> options -> recommendation -> next steps | board, steering committee |
| diagnostic | symptom -> evidence -> drivers -> implications -> actions | finance, operations, audit |
| teaching | question -> concept -> example -> practice -> recap | classroom, training |
| narrative | hook -> tension -> discovery -> turning point -> lesson | public talks, experience sharing |
| product-demo | user pain -> workflow -> capability -> proof -> adoption path | product and technical demos |
| research-brief | question -> findings -> framework -> implications -> recommendations | research and thought leadership |

Do not mix several logic types unless the deck is intentionally sectioned.

## Slide Relationship Types

Each slide should connect to nearby slides through one primary relationship:

| Relationship | Meaning |
|---|---|
| setup | gives context needed by the next slide |
| answer | answers the previous slide's question |
| evidence | proves the previous claim |
| cause | explains why the previous state happened |
| consequence | shows the impact of the previous claim |
| contrast | compares options, scenarios, or before/after states |
| bridge | transitions between sections or abstraction levels |
| decision | turns prior analysis into an ask or choice |
| recap | consolidates the section before moving on |

Avoid long runs of slides that have no explicit relationship beyond "also about the topic."

## Presenter Logic

Coherence is not only slide order. The speaker must also know how to bridge the pages.

For non-trivial decks, add one transition note for each major section shift:

- what the audience just learned;
- why that creates the next question;
- why the next slide is the right answer;
- what the speaker should emphasize or avoid.

If a transition cannot be written naturally, the slide order or page role is probably weak.

## Page Map Coherence Fields

Add these fields to the page map for non-trivial decks:

```text
Logic role:
Previous link:
Next setup:
Transition sentence:
Remove/move risk:
```

Example:

```text
Slide 4
Conclusion title: Delay is driven by four controllable root causes
Logic role: cause
Previous link: explains why the timeline on slide 3 slipped
Next setup: prepares the recovery plan on slide 5
Transition sentence: "Now that the delay is quantified, the board needs to know whether the causes are controllable."
Remove/move risk: high; without this slide, the recovery plan feels unsupported
```

## Coherence Audit

Run this audit on the page map or draft deck.

### 1. Story Spine

Write the deck as a single sentence:

```text
Because <context/problem>, the audience should understand <insight>, believe <recommendation>, and decide/do <ask>.
```

If the slides cannot support this sentence, the deck is not coherent yet.

### 2. Slide Chain

Create a slide chain:

```text
S1 -> S2 because...
S2 -> S3 because...
S3 -> S4 because...
```

Flag any weak link:

- no cause/effect;
- repeated point;
- sudden abstraction jump;
- evidence appears before the claim;
- solution appears before problem is understood;
- decision appears before tradeoffs are shown;
- context pages are too long before the point.

### 3. Question Flow

Each slide should answer the next likely audience question.

If the audience would ask a different question, reorder or rewrite.

Example:

```text
S3 says the project is delayed.
Likely audience question: why?
Therefore S4 should explain root causes, not jump to governance model.
```

### 4. Section Flow

Check section sequence:

- opening sets the promise;
- middle develops the argument;
- late section turns analysis into action;
- final section makes decision, commitment, or takeaway explicit.

### 5. Transition Quality

Every major slide or section transition should have a one-sentence bridge.

Weak transition:

```text
Next, let's look at risks.
```

Stronger transition:

```text
The recovery plan is credible only if the remaining risks have clear triggers and owners.
```

### 6. Full-Preview Walkthrough

When the deck has a full preview, walk through it in slide order as an audience member.

For each slide, check:

- what the audience just learned;
- what question they would naturally ask next;
- whether the next slide answers that question;
- whether a transition line is needed;
- whether the preview reveals a missing, duplicated, or misplaced page.

If visual polish hides a weak logical jump, fix the logic first.

## Reordering Rules

When reordering, prefer these rules:

- claim before evidence only when the audience needs the headline first;
- evidence before recommendation when trust must be built;
- current state before root cause;
- root cause before solution;
- solution before investment ask;
- risk before mitigation;
- decision ask before appendix detail;
- section recap before shifting to a new logic type.

## Output Template

```text
Story spine:
Primary logic type:
Coherence score: <1-5>

Weak links:
| From | To | Issue | Fix |

Recommended reorder:
| Old # | New # | Title | Reason |

Transition lines:
| Slide | Transition sentence |

Speaker note gaps:
| Slide | Missing note | Why it matters |

Slides to merge/split/remove:
| Slide | Action | Reason |
```

## Pass Criteria

The deck passes when:

- the deck has one story spine;
- each slide has a clear logic role;
- every slide answers the next likely audience question;
- no major slide feels like a disconnected point;
- transitions are explicit enough for the speaker notes or narration;
- full-deck previews have been checked for page-to-page logic and section bridges;
- reordered page map is approved before bulk production.
