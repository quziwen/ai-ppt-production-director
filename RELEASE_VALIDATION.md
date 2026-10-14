# Release validation — 0.3.7

2026-10-14 user-template integration and publication on the existing repository. The exact 40 gallery-selected items and independent layout/chart/color preferences were read back and preserved. All 33 selected remote preview/reference images were saved locally; native sample packages and eight HTML sources were included.

Nineteen focused checks passed: catalog integrity, discovery from an unrelated project, budget/HTML selection, six materializations including an alternate financial theme, three portable native sample builds, rejection of existing/unknown targets, preview JavaScript parsing, and PPTX package readback. The rebuilt financial packs contained 9/6/8 pages, with native text/tables and respectively 10/1/7 chart workbooks. Skill entry validators passed with UTF-8. These checks concern template portability and synthetic sample rebuilding; they do not prove PowerPoint data refresh, whole-deck E3/H3 or formal business acceptance.

Local packaging, browser checks and host installation details are recorded in the task's release report after actual execution. Standard packages omit the collection; templates-included packages explicitly include it. The nine existing production adapters are retained byte-for-byte. The nineteen checks are engineering tests, not nineteen independent model-driven deck-making scenarios or a new independent semantic score.

Browser checks covered the 40-item gallery, five groups, an alternate financial palette, HTML preview pagination and all nine locally loaded visual references, with no observed JavaScript error/warning. Gallery preview and actual production editor interaction remain distinct.

Known historical issue: the cash-flow pack's chart-workbook edit/refresh check failed, and a forced Chart.Refresh produced a bar-length mismatch. The cause remains unresolved. Other financial packs have not verified that round trip. Keep these limitations from the included PRIOR_QA.md records; use data-source regeneration followed by visual/data QA instead of declaring full editing acceptance. Public template inclusion does not repair or relabel an earlier failed check.

## Previous release validation — 0.3.6

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
