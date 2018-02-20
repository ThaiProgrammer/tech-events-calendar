# 2. Store event data as Markdown files with YAML front matter

Date: 2018-02-21

## Status

Accepted

## Context

As more events are added:

- README file gets harder to change. Adding events become more cumbersome.
- Format is unnatural. It is supposed to be a simple Markdown file but not it has a lot of weird formatting.
- When adding events, there is a large diff in JSON file due to other events shifted their line position.

Therefore, a new format for storing events is needed.

## Decision

Change the format to Markdown files, one event per file, with extra metadata in the YAML front matter.

- It is familiar to those who uses static site generators, like Jekyll.
- It is human-readable, and easily editable.
- Libraries exists to parse this kind of file.

Files are organized in `data` directory, which is split into folders for each month. Markdown files can then be created inside.

Related GitHub issue: https://github.com/ThaiProgrammer/tech-events-calendar/issues/42

## Consequences

- Events are no longer listed in README.md file.
