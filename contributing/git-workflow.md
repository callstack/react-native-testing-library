# Git, Releases, And PR Workflow

Branch from `main`, use Conventional Commit messages, and keep each pull request focused on a single change.

## Commit messages

Start each message with the type of change:

- `feat`: new feature
- `fix`: bug fix
- `refactor`: code change with no behavior change
- `docs`: documentation
- `test`: tests only
- `chore`: tooling, CI, dependencies
- `BREAKING`: change that breaks existing usage

For example: `fix: handle disabled Pressable in userEvent.press`.

## Pull requests

Before opening a PR:

- Run `yarn validate`.
- If you changed docs, run `yarn docs:generate`.
- Fill in the [PR template](../.github/PULL_REQUEST_TEMPLATE.md) with what the change does and how you tested it.

## Releases

Maintainers publish releases with [release-it](https://github.com/release-it/release-it): `yarn release` for stable versions and `yarn release:next` for release candidates.
