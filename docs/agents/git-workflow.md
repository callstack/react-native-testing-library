# Git, Releases, And PR Workflow

## Commits and releases

- Use Conventional Commits such as `fix:`, `feat:`, and `chore:`.
- Releases are managed with `release-it`.

## PR draft workflow

- Maintain `PR.txt` at the repository root using the structure from `.github/pull_request_template.md`.
- Keep `PR.txt` aligned with the current branch diff relative to `origin/main`.
- Include tests actually run and any known validation gaps in `PR.txt`.
- Do not commit `PR.txt`.
