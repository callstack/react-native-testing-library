# Example App Regeneration

When the Expo SDK is upgraded, the apps in `examples/` are recreated from a fresh Expo template instead of being upgraded in place. You then copy back the files that are specific to this repo.

## Steps

1. Move the current app to `/tmp` so you can restore files from it.
2. Generate a fresh app in `/tmp` (commands below).
3. Copy the fresh app into `examples/`, then delete its `.git` and `node_modules`.
4. Restore the repo-specific files listed below.
5. Update `package.json` and `app.json` with the repo's app name, scripts, and dependencies.
6. Run `yarn install`, then validate (see the end of this page).

Keep the existing image assets unless the new SDK requires different ones.

## `examples/basic`

```sh
yarn create expo-app /tmp/rntl-basic-fresh --template blank-typescript --yes
```

Restore: `App.tsx`, `components/`, `__tests__/`, `theme.ts`, `jest.config.js`, `jest-setup.ts`, `babel.config.js`, `eslint.config.mjs`, `README.md`, `AGENTS.md`, and `assets/`. Keep the new `index.ts`.

## `examples/cookbook`

```sh
yarn create expo-app /tmp/rntl-cookbook-fresh --example with-router --yes
```

Restore: `app/`, the tutorial folders (`basics-tutorial/`, `basics-tutorial-react-strict-dom/`), `theme.ts`, `jest.config.js`, `jest-setup.ts`, `babel.config.js`, `.eslintrc`, `.eslintignore`, `README.md`, `AGENTS.md`, and `assets/`. Keep the new Expo Router setup.

## Validate

Run these from inside the app folder:

```sh
yarn expo install --check
yarn lint
yarn typecheck
yarn test --watchman=false
```

If the new template causes a lot of `yarn.lock` churn, restore the old `yarn.lock` and run `yarn install` again.
