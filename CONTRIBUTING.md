# Contributing

## Code of Conduct

We want this community to be friendly and respectful to each other. Please read [the full text](/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## Our Development Process

The core team works directly on GitHub and all work is public.

### Development workflow

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github).

1. Fork the repo and create your branch from `main` (a guide on [how to fork a repository](https://help.github.com/articles/fork-a-repo/)).
2. Run `yarn` to setup the development environment.
3. Make your changes, add tests, and try them out in the example app.
4. Run `yarn validate` to type check, test, lint, and check formatting. CI runs the same checks on your pull request.
5. Open a pull request following the [pull request guidelines](contributing/git-workflow.md#pull-requests).

### Contributor guides

Detailed guides live in [`contributing/`](contributing/). They are written for both human contributors and AI coding agents:

- [Architecture and API design](contributing/architecture.md): project goals and API design principles
- [Build, validation, and repo layout](contributing/build-and-validation.md): commands, package docs generation, folder structure
- [TypeScript and code style](contributing/code-style.md): lint and formatting rules
- [Testing conventions](contributing/testing.md): how the library's own tests are organized
- [Native event propagation](contributing/native-events.md): which React Native events bubble and which are direct
- [Example app regeneration](contributing/example-apps.md): upgrading the Expo apps in `examples/`
- [Git, releases, and PR workflow](contributing/git-workflow.md): commit message convention, pull requests, releases

## Reporting issues

You can report issues on our [bug tracker](https://github.com/callstack/react-native-testing-library/issues). Please follow the issue template when opening an issue.

## License

By contributing to `@testing-library/react-native`, you agree that your contributions will be licensed under its **MIT** license.
