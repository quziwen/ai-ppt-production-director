# Release validation — 0.3.6

Public-beta and Patrick v0.3.5 release consolidation, checked on Windows on 2026-10-12.

## Completed checks

- All 34 original core modules retained with unchanged normalized content.
- All nine production adapters byte-identical to the local v0.3.5 baseline; JavaScript syntax checks passed.
- Package UTF-8 and relative Markdown links checked. Existing-output packaging refusal verified without changing the existing package.
- Synthetic one-page source exported to HTML and PPTX. PPTX ZIP integrity, native text, native table, native chart, signed decimal values and embedded chart workbook were read back.
- Export over an existing file was rejected with the original hash unchanged; negative geometry was rejected without producing a PPTX.
- skill-test 0.4.2: three independent instruction executions (general financial-report Storyline, Patrick missing-authority fallback, consultation-only editability question), followed by a separate reviewer: eight output assertions passed, zero failed/unverified. Report integrity verification passed.
- The instruction tests used explicitly supplied target packages, not natural host auto-discovery. Source access/permission enforcement and hard process timeouts were not independently certified by that semantic score.
- Graphify release-entry scope: llm-semantic, four documents, 31 nodes and 45 edges; no dangling endpoints, duplicate edges or self-loops. This is not a full runtime/deck graph.

The final package differs from the frozen test package only in this completed-results document. The canonical entry, contracts, runtime and host routing are unchanged.

## Boundaries

- Retain original core modules and host entries.
- Nine runtime adapter sources are unchanged from local v0.3.5.
- Exclude private SSOT, actual presentations, raw traces and machine-specific paths.
- Static checks, adapter execution, instruction tests and native discovery are distinct.
- No new whole-deck E3/H3, cross-Office, user visual acceptance or full DSH/Claude/Hermes production acceptance is claimed.
- Earlier v0.3.5 nine-case execution lacked independent semantic grading. This release does not relabel it as passed.
