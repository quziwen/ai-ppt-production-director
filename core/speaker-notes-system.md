# Speaker Notes System

Use this module when the deck must be presented, defended, taught, or handed off to someone else.

The goal is to make speaker notes an intentional part of the deck, not a dumping ground for overflow text.

## When To Use

Use speaker notes for:

- board, executive, client, investor, classroom, and public decks;
- decks that explain complex logic, data, or tradeoffs;
- decks built from vague ideas or work experience;
- decks where the user needs to sound like themselves;
- decks with visible slides that must stay concise;
- decks that need Q&A, backup detail, or presenter handoff.

For quick low-risk drafts, use light notes or transition-only notes.

## Note Types

| Type | Purpose | Use When |
|---|---|---|
| talk-track | what the speaker should say | the slide needs a clear spoken explanation |
| transition | bridge from previous or to next slide | storyline coherence matters |
| evidence-note | source, calculation, assumption, or caveat | facts, numbers, or claims need traceability |
| speaker-cue | pacing, emphasis, pause, demo, or audience interaction | live delivery needs control |
| backup-note | answer likely objections or questions | executive, board, sales, audit, or technical decks |
| edit-note | note for future editors, not for delivery | the deck will be revised by a team |

Do not mix all types on every slide. Choose the note types that match the slide role.

## Note Depth Levels

| Level | Meaning | Best For |
|---|---|---|
| none | no notes | self-explanatory appendix or low-risk draft |
| light | 1-2 bullets or one transition line | simple internal slides |
| standard | 3-5 bullets with talk track and bridge | most business decks |
| detailed | structured talk track, evidence, and Q&A | board, executive, client, classroom |
| scripted | near-verbatim presenter script | keynote, training, recorded narration |

Default to `standard` for important business decks and `detailed` for high-risk decision decks unless the user asks for a lighter style.

## Notes By Slide Role

| Slide Role | Recommended Notes |
|---|---|
| opening | audience promise, frame, what the audience should decide or learn |
| context | why the topic matters now, what is in and out of scope |
| evidence | source explanation, caveats, confidence, how to read the visual |
| diagnosis | root-cause logic, what was ruled out, what changed the conclusion |
| recommendation | decision rationale, tradeoffs, why alternatives were rejected |
| roadmap | sequencing logic, dependencies, owners, risks |
| decision | exact ask, decision options, consequences of delay |
| transition | bridge sentence and why the next section follows |
| closing | final takeaway, commitment, next checkpoint |

## Speaker Notes Template

```text
Slide:
Note depth:
Talk track:
- 

Transition:
- From previous:
- To next:

Evidence notes:
- Source:
- Assumption:
- Confidence:

Speaker cues:
- 

Likely questions / backup:
- Q:
  A:
```

## Voice Fit

Speaker notes should match the user or presenter's speaking style.

Before writing detailed notes, infer or ask for:

- language;
- tone: direct, analytical, persuasive, teaching, narrative, formal;
- speaker identity: executive, expert, teacher, project lead, consultant;
- acceptable level of personal story;
- whether the speaker wants full script or talking points.

If the user says the notes do not sound like them, convert the feedback into reusable voice rules and revise notes before changing visible slide text.

For Chinese business decks, also run `workplace-language-polish.md` on detailed notes and transition lines. Notes should sound like a real presenter, not like a generic AI narration.

Avoid note openings such as:

- `本页主要阐述...`
- `通过本页可以看出...`
- `从多个维度来看...`
- `这体现了...的重要价值`

Prefer direct speaking lines:

- `这一页先把范围说清楚...`
- `这里我想提醒一个风险...`
- `这页的重点不是工具本身，而是它能不能稳定回答业务问题...`
- `如果董事会只记住一点，就是...`

## Content Density Link

Use speaker notes to solve density problems:

- visible slide carries the conclusion and key visual;
- speaker notes carry examples, nuance, caveats, and detailed explanation;
- appendix carries source tables and backup material.

Do not hide critical decisions, numbers, or risks only in notes when the audience must see them on the slide.

## Storyline Link

Every major slide should have a transition note when the deck is non-trivial.

Weak:

```text
Next we discuss risks.
```

Stronger:

```text
The recovery plan is only credible if the remaining risks have clear triggers and owners.
```

## Q&A Backup

For decision or high-risk decks, add backup notes for likely objections:

- Why this recommendation?
- What alternatives were considered?
- What happens if we do nothing?
- What is the confidence level?
- What source supports this number?
- What risk would change the recommendation?

Q&A backup can live in speaker notes, appendix, or both.

## QA Questions

- Are notes separated from visible slide text?
- Do notes explain the slide rather than repeat it?
- Does each transition make the next slide feel inevitable?
- Are assumptions, sources, and caveats traceable?
- Are likely objections answered somewhere?
- Would another presenter know how to deliver the deck?
- Does the note style match the user's language and voice?
- For Chinese business decks, do notes avoid AI-flavored grand wording and sound sayable in a real meeting?
