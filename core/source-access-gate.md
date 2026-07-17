# Source Access Gate

Use this gate before analyzing, extracting, rewriting, or building from user-provided source materials.

The goal is to avoid a common cross-platform failure: the user believes a file was uploaded, but the agent may only see a filename, a local path, a cloud link, a workspace copy, or no readable object at all.

## When To Run

Run this gate whenever the deck depends on files or source materials, including:

- PPTX, PDF, HTML, Markdown, Word, Excel, CSV, images, screenshots, videos, or old decks;
- `Files mentioned by the user` blocks;
- local paths;
- cloud links;
- connector files;
- user statements such as "I uploaded the file" or "see attached".

Do this before source extraction, page-map claims, visual benchmarking, template intake, or workplace-language review.

## Access Types

Classify each source as one of:

| Access Type | Meaning | Handling |
|---|---|---|
| actual attachment | platform exposes a readable attachment object | inspect metadata, then read only that object |
| current workspace file | file exists in the working directory or its known project tree | read by workspace path |
| explicit local path | user provides a full local path in the current request | read only that exact path if permitted |
| mentioned-only file | platform injects a filename or `Files mentioned by the user` path but no copied workspace file | treat the listed path as user-provided, but do not scan adjacent folders |
| cloud/link reference | URL or connector-backed file | use connector or browser only after access is available and permitted |
| inaccessible source | user says a file exists, but no readable object/path is visible | state what is missing and request a readable source |

## Verification Steps

Before using a source, verify:

```text
Source name:
Access type:
Visible path or object:
Exists/readable:
File type:
File size or page/slide count when available:
Allowed scope:
Not allowed:
Next action:
```

For local or workspace files, use the minimal check available in the agent environment. Examples:

- list the current workspace;
- check the exact user-provided path;
- inspect file size and extension;
- read only enough content to confirm type and structure.

## Scope Rules

Allowed:

- read an actual attachment object exposed by the platform;
- read a file already present in the current workspace;
- read the exact full local path explicitly provided in the latest user request;
- read the exact path listed under `Files mentioned by the user`;
- ask for confirmation when access is ambiguous or the file is sensitive.

Not allowed by default:

- scan sibling folders around a mentioned local path;
- search the whole disk for similarly named files;
- open memory files, previous session logs, rollout summaries, or chat-history archives to locate the current source file;
- infer private paths from memory or previous sessions;
- use a historical file when the user expects the current upload;
- send private files to external tools without explicit confirmation.

## Memory Boundary

During Source Access Gate, memory and previous sessions are not source locators.

Do not read memory files, prior session summaries, rollout logs, previous chat transcripts, or remembered file paths to discover, verify, or substitute the current source file.

Memory may be used only for stable workflow preferences, language preferences, or prior design decisions after the current source access status is resolved from the latest request, current workspace, explicit path, visible attachment object, connector file, or cloud link.

If the user explicitly asks to use memory or a previous session to locate a file, state that this is a memory-derived lookup, report the exact path or session reference before reading anything, and still read only the exact user-approved source.

Important distinction:

`Files mentioned by the user` may expose a local path without copying the file into the current workspace. That path can still be a user-provided file reference. The correct behavior is to say:

```text
I can see a user-provided file path, but I do not see a workspace copy. I will read only this exact path and will not scan adjacent folders, unless you want a workspace-only test.
```

If the user explicitly says "do not read D:\..." and the only visible file path is under that drive, do not read it. Explain that the accessible reference is the forbidden path and ask the user to place a copy in the current workspace or provide another readable attachment.

## User-Facing Status

When source access matters, report it briefly before analysis:

```text
I can see:
- Source: <name>
- Access type: <actual attachment | workspace file | explicit local path | mentioned-only file | cloud link>
- I will read: <exact object/path>
- I will not read: sibling folders, whole-disk search, memory, previous sessions, inferred files, or external services
```

If no readable source is available:

```text
I can see the request, but I cannot access the source file yet. I do not see a workspace file or readable attachment object. Please provide a readable file, a current workspace path, a connector file, or permission to read the exact local path shown.
```

Avoid saying only "I did not receive the file" when the platform shows a filename or path. Be precise: say whether you saw a file name, a path, a workspace copy, or a readable attachment.

## Interaction With Other Modules

- Run this before `source-extraction-routing.md`.
- Run this before `user-template-intake.md` or `reference-deck-reverse-engineering.md`.
- Run this before `workplace-language-polish.md` if the polish depends on an uploaded deck/source file.
- Record access type and scope in the page map or lightweight record when the deck is source-heavy.
