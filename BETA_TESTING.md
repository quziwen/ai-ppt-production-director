# Beta Testing Guide

Use this guide when inviting external testers to try `ai-ppt-production-director`.

## What To Test

This project is not a one-click PPT generator. Test whether it helps an AI agent think before making slides:

- clarify a vague idea;
- shape a thesis and audience promise;
- design storyline options;
- create a page argument map;
- check slide-to-slide logic;
- choose a visual direction;
- explain PPTX / HTML / editability tradeoffs;
- avoid private files, third-party templates, and unsupported tool claims.

## Quick Test Prompts

### 1. Vague Idea

```text
Use ai-ppt-production-director. I have a rough idea for a 20-minute internal talk about how AI is changing finance work, but I do not yet know the thesis, structure, or page plan. Help me think it through before making slides.
```

Expected: the agent should start with thinking, thesis shaping, and storyline options instead of directly generating a deck.

### 2. Board Update

```text
Use ai-ppt-production-director to plan a 10-slide board update for a delayed transformation project.
```

Expected: the agent should create a board-level page map with delay facts, impact, root causes, recovery plan, risks, and decisions.

### 3. Chinese Workplace Language

```text
用 ai-ppt-production-director 帮我规划一个 10 页董事会项目延期汇报 PPT。请用中文回复，标题不要太 AI 味，要像真实职场汇报。
```

Expected: the agent should reply in Chinese and use direct workplace language instead of grand slogans.

### 4. Visual Quality And Editability

```text
Use ai-ppt-production-director. I want a professional-looking finance deck, but my team must still edit titles, numbers, tables, and speaker notes in PowerPoint. Explain the production route before building.
```

Expected: the agent should discuss editability tradeoffs, Studio Hybrid Mode, sample slide gates, and visual QA before promising output.

### 5. Source Access Boundary

```text
Use ai-ppt-production-director. I uploaded an HTML deck, but if you cannot see a readable attachment, workspace file, explicit path, connector file, or `Files mentioned by the user` entry in this current request, do not use memory or previous sessions to locate it. First report source access status.
```

Expected: the agent should report source access status and not invent access to files.

## Feedback Questions

Please report:

- Which agent/tool did you use? Codex, Claude, Cursor, or generic prompt?
- Which prompt did you test?
- Did it act as a director before generator?
- Did it clarify the thesis, audience, and storyline?
- Did the page map feel useful?
- Did it catch logic jumps or weak transitions?
- Did the wording sound natural for the audience?
- Were visual and editability tradeoffs clear?
- Was the process too heavy, too light, or about right?
- Would you use this in a real PPT task?

## Suggested Rating

Rate each item from 1 to 5:

- idea clarification;
- storyline quality;
- page map usefulness;
- logic coherence;
- workplace wording;
- visual direction;
- editability guidance;
- privacy/source-access behavior;
- overall usefulness.

