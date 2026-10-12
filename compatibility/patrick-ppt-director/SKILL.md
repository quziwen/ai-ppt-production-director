---
name: patrick-ppt-director
description: Compatibility entry for Patrick PPT Director and Patrick's adopted presentation workflow. Delegates to the unified ai-ppt-production-director skill with the Patrick profile; it is not a separate implementation.
---

# Patrick PPT Director compatibility entry

Version: 0.3.6.

Load the installed sibling `../ai-ppt-production-director/SKILL.md`, use its Patrick profile, and follow its current workflow and contracts. In a repository checkout (not an installed skills directory), the canonical file is [../../SKILL.md](../../SKILL.md).

Use the first readable canonical location appropriate to the current installation. Resolve all subsequent relative references and scripts from that canonical directory. Do not use the old v0.3.5 implementation or duplicate its rules here.

If neither location is readable, explain that the main skill must also be installed; do not silently fall back to a stale director. This alias grants no extra source access or external-write permission.
