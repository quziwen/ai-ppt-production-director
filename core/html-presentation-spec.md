# HTML Presentation Spec

HTML decks must behave like real slide decks, not long webpages.

## HTML Preview Boundary

An HTML deck may be either a final deliverable or a review artifact.

When used as `HTML Storyboard Preview`:

- it is meant to review page flow, layout direction, density, and visual style;
- it should be fast enough to support feedback;
- it should avoid unnecessary final polish before the page map and style are approved;
- it should use stable slide and element anchors when comments are expected;
- it should not be treated as a promise that PPTX conversion will be pixel-perfect.

For final editable PPTX workflows, update `slides_source.md` or `slides_source.json` after preview feedback, then build PPTX from the stable source and approved style rules.

## Required Structure

Use one slide per section:

```html
<section class="slide" data-slide-id="s01">
  ...
</section>
```

Only one slide is visible at a time.

Use a 16:9 stage that scales to the browser window without distortion.

Keep `slides_source.md` or `slides_source.json` as the source of truth.

For major edits, update the source first, then regenerate HTML.

For reviewable decks, add stable element anchors:

```html
<h1 data-element-id="s01.title.headline">...</h1>
<div data-element-id="s01.chart.revenue_bridge">...</div>
```

These anchors let users or reviewing tools attach comments to exact elements instead of describing locations in chat. Hide any visible review labels in the final deck unless requested.

## Navigation

Support:

- Right, Down, Space, PageDown: next slide;
- Left, Up, PageUp: previous slide;
- Home: first slide;
- End: last slide.

Show a page indicator such as `3 / 12`.

Optional, when requested:

- mouse wheel navigation;
- touch swipe;
- overview mode;
- presenter notes view.

## Media

Use relative paths only.

Correct:

```html
<video src="demo.mp4" controls></video>
```

Incorrect:

```html
<video src="D:\local\private\demo.mp4" controls></video>
```

Do not autoplay video unless the user explicitly requests it.

Keep media files next to the HTML file or in a local `assets/` or `media/` folder.

## Layout Rules

Use CSS grid or flex for stable layouts.

Avoid:

- clipped text;
- overlapping elements;
- dense manually positioned text blocks;
- absolute local paths;
- visible prompts or speaker notes on slides;
- placeholder text in final output.

If one slide is too dense, split it or move detail to notes or appendix.

## PPTX And HTML Together

If both PPTX and HTML are required, stabilize the page map and PPTX first unless the user explicitly chooses HTML-first.

Use the same confirmed source, page order, titles, and style tokens for both outputs.

## Final HTML QA

Before delivery:

- open the deck locally;
- test keyboard navigation;
- check page indicator;
- check media paths;
- check that only one slide is visible;
- check text overflow and overlap;
- check that the source file matches the deck.
