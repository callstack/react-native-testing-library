# Contributing

## Code of Conduct

We want this community to be friendly and respectful to each other. Please read [the full text](/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## Our Development Process

The core team works directly on GitHub and all work is public.

### Development workflow

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

1. Fork the repo and create your branch from `master` (a guide on [how to fork a repository](https://help.github.com/articles/fork-a-repo/)).
2. Run `yarn` to setup the developement environment.
3. Do the changes you want and test them out in the example app before sending a pull request.

### Commit message convention

We prefix our commit messages with one of the following to signify the kind of change:

- `fix`: bug fixes, e.g. fix incorrect error message.
- `feat`: new features, e.g. add useful API.
- `refactor`: code/structure refactor, e.g. new folder structure.
- `docs`: changes into documentation, e.g. add usage example for `getByText`.
- `test`: adding or updating tests, eg unit, snapshot testing.
- `chore`: tooling changes, e.g. change circle ci config.
- `BREAKING`: for changes that break existing usage, e.g. change API.

Our pre-commit hooks verify that your commit message matches this format when committing.

### Linting and tests

We use `flow` for type checking, `eslint` with `prettier` for linting and formatting the code, and `jest` for testing. Our pre-commit hooks verify that the linter and tests pass when commiting. You can also run the following commands manually:

- `yarn flow`: run flow on all files.
- `yarn lint`: run eslint and prettier.
- `yarn test`: run tests.

### Sending a pull request

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that `flow`, `eslint` and tests are passing.
- Preview the documentation to make sure it looks good.
- Follow the pull request template when opening a pull request.

### Publishing a release

We use [release-it](https://github.com/webpro/release-it) to automate our release. If you have publish access to the NPM package, run the following from the master branch to publish a new release:

```sh
yarn release
```

NOTE: You must have a `GITHUB_TOKEN` environment variable available. You can create a GitHub access token with the "repo" access [here](https://github.com/settings/tokens).

## Reporting issues

You can report issues on our [bug tracker](https://github.com/callstack/react-native-testing-library/issues). Please follow the issue template when opening an issue.

## License

By contributing to `react-native-testing-library`, you agree that your contributions will be licensed under its **MIT** license.
