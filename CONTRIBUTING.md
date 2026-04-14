# Contributing

Thanks for helping keep the Live-Rates docs and examples current.

## Fixing the README

Edit `README.md` and open a PR. Keep the ToC in sync if you add or rename a section.

## Adding a client example

1. Create a folder under `examples/streaming/<lang>/` (or `examples/rest/` for a plain HTTP snippet).
2. Keep it to **one source file** plus the smallest possible dependency manifest (`package.json`, `requirements.txt`, `go.mod`, `composer.json`, `Gemfile`, `*.csproj`).
3. Mirror the event flow of the existing clients: connect → optional `instruments` → `emit("key", …)` → log `rates`. Trial key `"trial"` for testing.
4. Add a `README.md` in your folder with:
   - the install command
   - the run command
   - expected first line of output
5. No frameworks, no build systems beyond what the language normally needs, no committed `vendor/` or `node_modules/`.

## Reporting a documentation bug

[Open an issue](https://github.com/Live-Rates/live-rates.com/issues) with the section name and what's wrong. PRs with the fix are even better.
