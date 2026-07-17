# Publishing Guide

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
- No private decks, screenshots, videos, logos, fonts, internal cases, local paths, credentials, or session transcripts are present.
- Example files are fictional or sanitized.
- Template folders contain only original seed templates or placeholders.
- `adapters/codex/SKILL.md` passes the Codex skill validator.
- `scripts/package-codex.ps1` creates a valid installable Codex package.
- `TESTING.md` includes behavior tests for vague idea intake, language handling, output routing, editability, and review gates.
- `TESTING.md` includes optional-tool fallback and install-confirmation behavior tests.
- The delivery manual is updated for the release being published.

## Recommended Repository Settings

Recommended GitHub settings:

- Visibility: public only after the readiness checks pass.
- Description: `Multi-agent idea-to-deck skill for planning, directing, and QA-gating professional AI-assisted presentations.`
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
- confirm no generated PPT/PDF/video files were uploaded;
- confirm examples are fictional;
- confirm the latest release page is visible;
- test installing or copying the Codex adapter into a local skills folder.

## References

- GitHub repository quickstart: https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories
- GitHub licensing guide: https://docs.github.com/articles/licensing-a-repository
- GitHub security policy guide: https://docs.github.com/code-security/getting-started/adding-a-security-policy-to-your-repository
- GitHub releases guide: https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository
