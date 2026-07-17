# Source Extraction Routing

Use this file when a deck depends on source materials that must be extracted, cleaned, or structured before slide planning.

This is especially important for PDFs, scanned documents, long reports, cross-page tables, spreadsheets, old decks, screenshots, and mixed source packs.

Before extraction, run `source-access-gate.md` if the source came from an upload, attachment, local path, cloud link, `Files mentioned by the user`, or any ambiguous file reference. Do not start extraction until the exact readable source and access boundary are clear.

## Principle

Do not design slides from unreliable extraction.

If the source material contains tables, numbers, or evidence that will drive the storyline, first decide whether the source can be trusted as text/data, needs OCR, needs table reconstruction, or should be treated only as visual reference.

## Source Types

| Source Type | First Check | Preferred Handling |
|---|---|---|
| Native PDF | selectable text, embedded tables, page structure | extract text/tables, preserve page references |
| Scanned PDF | image-only pages, OCR quality | OCR first, then validate samples |
| Cross-page PDF table | repeated headers, split rows, continuation marks | reconstruct into a single table before analysis |
| Spreadsheet | formulas, hidden sheets, merged cells, units | inspect workbook structure and data dictionary |
| Old PPTX | slide masters, notes, charts, embedded media | inventory pages and reusable elements |
| Screenshot | source system, date, privacy, resolution | use as evidence only after permission |
| Web article/link | content availability, paywall, dynamic rendering | extract clean text and cite source |

## Access Boundary

Extraction tools must operate only on the verified source from `source-access-gate.md`.

Allowed:

- exact uploaded attachment object;
- exact current workspace file;
- exact user-provided local path;
- exact path listed under `Files mentioned by the user`;
- confirmed connector/cloud file.

Not allowed by default:

- scanning sibling folders near a mentioned file path;
- searching the whole disk for similar file names;
- opening memory files, previous session logs, rollout summaries, or chat-history archives to locate the current source file;
- substituting a historical file from memory;
- treating an inaccessible upload as if extraction succeeded.

## PDF Table Routing

When the source includes PDF tables, classify first:

- native table;
- scanned table;
- cross-page table;
- irregular table;
- table embedded as image;
- table with merged cells or repeated headers.

Then choose route:

| Situation | Route |
|---|---|
| simple native table | PDF/table extraction tool or script |
| cross-page native table | extract page by page, detect repeated headers, merge rows, validate totals |
| scanned table | OCR + table reconstruction + sample validation |
| high-stakes financial table | manual spot check against source pages before slide use |
| unclear extraction quality | keep as source screenshot/reference and ask for structured data |

## Extraction Record

For every important source, record:

```text
Source:
Type:
Extraction route:
Output artifact:
Confidence:
Validation performed:
Known issues:
Slides affected:
```

## Validation Rules

Before using extracted data in a deck:

- preserve source page references;
- check row and column counts;
- check units, periods, currencies, and signs;
- check totals and subtotals where available;
- sample-check at least 3 rows or all rows for small tables;
- mark assumptions and extraction uncertainty;
- do not convert uncertain extracted values into confident slide claims.

## Impact On Deck Workflow

If extraction confidence is low:

- avoid precise numeric claims;
- use directional language;
- put details in appendix;
- ask the user for clean Excel/CSV/source data;
- flag the slide as high-risk in the page map.

If extraction confidence is high:

- feed structured data into the page map;
- create charts or tables from the structured source;
- keep the extracted artifact with the delivery package when appropriate.

## Tool-Agnostic Rule

This repository does not require a specific extraction library. Agents may use PDF, OCR, spreadsheet, or local scripting capabilities available in their environment.

Do not pretend extraction succeeded. If a tool cannot parse the source reliably, state the limitation and choose a fallback route.
