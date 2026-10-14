# Publishing Guide

## Updating the existing project

Use this repository and root VERSION; do not create a second repository for the Patrick name. Preserve existing releases and core capabilities. Package the canonical entry, current contracts, retained core and runtime; host adapters delegate to the same entry.

Check the staged file list, imported runtime hashes, links and public-content boundaries. Exclude graph state, private SSOT, actual business decks, raw tests/sessions, backups and local bundles. Version 0.3.7 explicitly publishes `assets/templates/user-collections/patrick-20261014/`: the approved 40 selections, six synthetic native sample PPTX files, HTML sources, previews and public visual references. This is a collection-specific authorization, not permission to publish future uploads. Retain asset provenance and documented editing limits. Publish immutable assets and checksums, then read them back. The initial-publish commands below are historical bootstrap guidance, not instructions to reinitialize, reuse an old tag or force-push.

This guide prepares `ai-ppt-production-director` for public GitHub release.

## Release Readiness

Before publishing, confirm:

- `README.md` explains the purpose, scope, and repository layout.
- `DELIVERY.md` explains delivered scope, files, installation, validation, known boundaries, and maintenance notes.
- `LICENSE` is present.
- `SECURITY.md` explains how to report vulnerabilities or unsafe content.
- `CONTRIBUTING.md` explains contribution rules.
- `OPTIONAL_TOOLS.md` explains optional boosters, fallbacks, and confirmation-before-install behavior.
- `core/style-lookbook.md`, `core/reference-intake-ladder.md`, and `core/template-discovery-guide.md` explain how users can start without a reference deck and safely use external inspiration.
- `core/storyline-coherence-check.md` explains how to detect disconnected pages, weak transitions, and poor slide order.
- `core/content-density-control.md`, `core/layout-grammar.md`, `core/studio-hybrid-production-mode.md`, and `core/visual-qa-rubric.md` define the quality control layer.
- `core/optional-capability-registry.md` is present and does not make external tools hard dependencies.
- `core/licensing-policy.md` states asset and template boundaries.
- No private decks, private screenshots/videos/logos/fonts, internal cases, machine-specific paths, credentials, or session transcripts are present.
- Example files are fictional or sanitized.
- Template folders contain original seeds and explicitly approved, cataloged collections. Confirm selected IDs, material types, source URLs and hashes; do not add the entire research gallery.
- `adapters/codex/SKILL.md` passes the Codex skill validator.
- `scripts/package-codex.ps1` creates a valid installable Codex package.
- `TESTING.md` includes behavior tests for vague idea intake, language handling, output routing, editability, and review gates.
- `TESTING.md` includes optional-tool fallback and install-confirmation behavior tests.
- The delivery manual is updated for the release being published.

## Recommended Repository Settings

Recommended GitHub settings:

- Visibility: public only after the readiness checks pass.
- Description: `Presentation director skill for editable PPTX/HTML workflows, selectable financial and HTML templates, and evidence-based QA.`
- Topics: `ai`, `presentation`, `ppt`, `pptx`, `slides`, `html-slides`, `codex`, `claude`, `cursor`, `agent-workflow`, `presentation-design`, `slide-deck`.
- Features: enable Issues and Discussions if you want community feedback.
- Security: add a security policy and enable secret scanning or push protection when available.

## First Publish Commands

From the parent folder:

```bash
cd ai-ppt-production-director
git init
git add .
git commit -m "Initial public release"
git branch -M main
git remote add origin https://github.com/<owner>/ai-ppt-production-director.git
git push -u origin main
```

Replace `<owner>` with your GitHub username or organization.

## Codex Package

Before publishing a release, generate and validate the Codex package:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\package-codex.ps1
python "<path-to-skill-creator>/scripts/quick_validate.py" ".\dist\codex\ai-ppt-production-director"
```

The generated `dist/` folder is ignored by Git by default. Use it for local install testing or attach it manually to a GitHub Release if you want to distribute a ready-to-copy package.

For the approved collection, add `-IncludeUserTemplates` and a new `-OutDir`. Release v0.3.7 provides `with-templates.zip` (recommended), `standard.zip` (lightweight), a separate Patrick alias, importable `.skill` files and SHA256SUMS. Keep prior local packages and released assets immutable. The `.gitignore` exception is limited to this collection's synthetic `samples/*.pptx`; real deck outputs remain ignored.

## First Release

Recommended first tag:

```bash
git tag v0.1.0-beta
git push origin v0.1.0-beta
```

Then create a GitHub Release from the tag.

Suggested release title:

```text
v0.1.0-beta - Idea-to-deck director public beta
```

Suggested release notes:

```text
Initial public beta of AI PPT Production Director as a multi-agent idea-to-deck workflow.

Includes:
- platform-neutral idea-to-deck workflow;
- capability levels for Thinking, Blueprint, Production, and Studio Mode;
- writer, screenwriter, director, and production crew role model;
- output routing and editability-level guidance;
- storyline coherence checking and slide-order repair;
- quality control for density, layout, hybrid production, and visual QA;
- review gates including sample slide and contact sheet QA;
- Codex, Claude, Cursor, and generic prompt adapters;
- original template recipes;
- HTML presentation specification;
- QA and licensing policies;
- optional capability registry and fallback rules;
- built-in style lookbook and safe template discovery guidance;
- fictional example scenarios.

Does not include:
- private business materials;
- brand templates;
- third-party template files;
- real customer or company examples.
```

## Post-Publish Checks

After publishing:

- open the repository page in a browser;
- confirm README renders correctly;
- confirm `DELIVERY.md` renders correctly and matches the release contents;
- confirm license is detected by GitHub;
- confirm only the six approved synthetic sample PPTX files were uploaded; exclude actual production decks and generated PDF/video outputs;
- confirm examples are fictional;
- confirm the latest release page is visible;
- test installing or copying the Codex adapter into a local skills folder.
- verify latest commit/tag, release attachment downloads and their SHA256 against the tested packages;
- keep known historical chart-edit/refresh limitations in README, release notes and sample QA instead of implying full E3/H3 acceptance.

## References

- GitHub repository quickstart: https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories
- GitHub licensing guide: https://docs.github.com/articles/licensing-a-repository
- GitHub security policy guide: https://docs.github.com/code-security/getting-started/adding-a-security-policy-to-your-repository
- GitHub releases guide: https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository
