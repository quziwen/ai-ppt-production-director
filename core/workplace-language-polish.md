# Workplace Language Polish

Use this module when deck copy, speaker notes, slide titles, transitions, or delivery scripts sound AI-generated, over-polished, slogan-like, or unlike normal workplace language.

Primary scope: Simplified Chinese business decks. The same principles can be adapted to other languages, but do not force casual wording into formal legal, academic, regulatory, or official documents.

## Goal

Make the deck sound like a competent colleague, manager, expert, teacher, or project lead would actually write and present it.

Do not remove professionalism. Remove empty polish.

## When To Run

Run this check:

- after storyline and facts are stable;
- before full-deck preview when visible copy is generated;
- after full-deck preview if pages feel AI-written;
- before final delivery for Chinese business decks;
- when the user says the deck sounds too AI, too grand, too fake, too consulting-like, or not like their workplace voice.

If a specialized de-AI writing skill is available, use it as an optional booster after facts and logic are stable. Do not rewrite facts, numbers, decisions, or source-backed claims just to sound more natural.

## Workplace Voice Principles

Good workplace PPT language is:

- specific;
- decision-oriented;
- audience-aware;
- evidence-tied;
- concise but not slogan-like;
- direct about uncertainty and tradeoffs;
- natural enough for a presenter to say aloud.

Bad AI-flavored PPT language often:

- raises the abstraction level without adding information;
- uses grand phrases to hide weak evidence;
- sounds like a policy slogan or vendor brochure;
- overuses symmetric structures;
- uses fashionable business nouns where a simple verb is clearer;
- repeats words like enabling, empowering, reshaping, ecosystem, engine, comprehensive, deep, and high-quality without saying what changed.

## Register Gate

Before rewriting, identify the register. Do not apply the same "humanize" treatment to every deck.

| Register | Typical Decks | Rewrite Direction |
|---|---|---|
| internal workplace | project update, finance review, operating review | direct, specific, meeting-sayable |
| executive / board | decision, risk, investment, transformation | concise, evidence-tied, not casual |
| teaching / lecture | course, training, public explanation | clear, concrete, enough explanation |
| external keynote | conference, public talk | memorable but still grounded |
| legal / compliance / policy | audit, control, regulation | preserve formal wording; only remove empty slogans |
| brand / marketing | launch, campaign, product story | preserve deliberate rhythm; do not flatten style |

If the text already clearly carries a real user's voice, do not over-sanitize it. Convert feedback into a reusable voice rule instead of rewriting everything into neutral business prose.

When uncertain, prefer a conservative polish pass:

- remove obvious empty phrases;
- keep formal terms needed for the audience;
- avoid invented examples, numbers, emotions, or personal anecdotes;
- ask or state the tone assumption before changing the register.

## Red-Flag Patterns In Chinese Business Decks

Avoid or rewrite these unless the source or company language requires them:

| Pattern | Examples | Fix |
|---|---|---|
| Empty elevation | `全面赋能`, `深度融合`, `价值跃迁`, `重塑格局`, `打造新范式` | Say what changed, for whom, and how it is measured. |
| Fake strategy slogan | `以 X 为牵引`, `构建 X 生态`, `形成 X 闭环`, `打造 X 引擎` | Replace with the actual operating mechanism. |
| Over-neat consulting frame | `三位一体`, `双轮驱动`, `四维发力`, `全链路协同` | Use only if the structure is real and useful. |
| Weak filler | `持续优化`, `不断提升`, `进一步加强`, `显著提升` | Add baseline, action, target, owner, or evidence. |
| Noun stacks | `能力建设体系化推进路径`, `数据资产价值释放机制` | Break into normal subject-verb-object phrasing. |
| Vendor brochure tone | `智能化升级助力业务高质量发展` | Say the specific task, user, workflow, and outcome. |
| Over-absolute claims | `彻底解决`, `全面覆盖`, `全方位赋能` | Add scope and limits. |

## Rewrite Principles

### 1. Replace slogan with mechanism

Weak:

```text
构建财务 AI 能力底座，全面赋能业财融合升级。
```

Better:

```text
先把高频取数、解释口径和异常排查做成可复用流程，让财务能更快回答业务问题。
```

### 2. Replace abstract value with audience decision

Weak:

```text
推动数据资产价值释放，打造经营分析新范式。
```

Better:

```text
这套分析先解决两个问题：本月利润为什么偏差，以及下月最该盯哪三个动作。
```

### 3. Keep conclusion titles human and specific

Weak:

```text
AI 赋能财务转型的路径探索
```

Better:

```text
财务 AI 先从高频、低风险、口径稳定的场景切入
```

Weak:

```text
构建闭环管理体系，驱动项目高质量落地
```

Better:

```text
项目延期后，关键是把问题升级从汇报动作变成处理动作
```

### 4. Make speaker notes sayable

Weak:

```text
本页主要阐述 AI 在财务管理领域的多维赋能价值。
```

Better:

```text
这一页我想先把范围说清楚：我们不是讨论所有财务工作怎么被 AI 改造，而是先看哪些工作适合第一批落地。
```

### 5. Preserve real workplace formality

Do not turn serious business decks into casual chat. Board, CFO, client, audit, compliance, and academic decks can stay formal. The goal is not slang. The goal is useful, credible, and sayable language.

### 6. Do not invent humanity

Weak de-AI rewrites sometimes add fake personal details, emotional color, or invented experience. Do not do that.

Allowed:

- make the sentence more concrete using existing facts;
- replace abstract nouns with actual actions;
- shorten inflated phrases;
- make notes easier to speak.

Not allowed:

- invent a team story;
- invent a failure, emotion, or quote;
- invent numbers or impact;
- add "we tried this ourselves" unless the source says so.

## Slide Copy Checklist

For each important slide, ask:

- What register is this slide in: internal workplace, executive, teaching, external keynote, legal/compliance, or brand/marketing?
- Can the title be spoken naturally in a meeting?
- Does the title say a concrete judgment, not only a topic label?
- Does the body copy explain what changed, why it matters, or what to decide?
- Is any phrase impressive but content-free?
- Would a real manager write this sentence in an internal deck?
- If a word like `赋能`, `闭环`, `生态`, `底座`, `抓手`, or `跃迁` appears, is it necessary and grounded?
- Are uncertainty, tradeoffs, and limits stated instead of hidden behind polished language?
- Did the polish preserve the user's intended voice and formality?
- Did the polish avoid inventing details just to sound more human?

## Output Template

Use this when revising a deck for language fit:

```text
Workplace language pass:
Register:
Tone target:
High-risk AI-flavored words:
| Slide | Original | Issue | Revised |
Voice rules to reuse:
- 
Remaining wording risks:
- 
```

## Pass Criteria

The pass is complete when:

- slide titles are specific and sayable;
- visible copy is concise but not slogan-like;
- speaker notes sound like a real presenter;
- empty grand phrases are removed or justified;
- facts and decisions are not changed during polish;
- the register was preserved instead of blindly casualized;
- no fake human detail was invented;
- reusable voice rules are captured for future revisions.
