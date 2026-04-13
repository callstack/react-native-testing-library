# Example App Regeneration

## General workflow

- Regenerate Expo example apps in a temporary directory, then copy the fresh scaffold into place.
- Before replacing an example app, move the current app directory to `/tmp` so repo-specific files can be restored selectively.
- After copying a generated app into `examples/`, remove the generated `.git` directory and `node_modules`, then reinstall from inside the repo workspace.

## `examples/basic`

- Generate from the Expo blank TypeScript template:
  - `yarn create expo-app /tmp/rntl-basic-fresh --template blank-typescript --yes`
- Restore these repo-specific files on top of the fresh scaffold:
  - `App.tsx`
  - `components/`
  - `__tests__/`
  - `theme.ts`
  - `jest.config.js`
  - `jest-setup.ts`
  - `babel.config.js`
  - `eslint.config.mjs`
  - `README.md`
  - `.expo-shared/assets.json` if it existed before
- Keep the fresh Expo entrypoint `index.ts`.
- Update `package.json` and `app.json` to match repo naming and scripts.

## `examples/cookbook`

- Generate from a router-enabled Expo scaffold:
  - `yarn create expo-app /tmp/rntl-cookbook-fresh --example with-router --yes`
- Restore these repo-specific files on top of the fresh scaffold:
  - `app/`
  - tutorial test directories such as `basics-tutorial/` and `basics-tutorial-react-strict-dom/`
  - `theme.ts`
  - `jest.config.js`
  - `jest-setup.ts`
  - `babel.config.js`
  - `.eslintrc`
  - `.eslintignore`
  - `README.md`
  - custom assets not present in the scaffold, such as `assets/gradientRNBanner.png`
  - `.expo-shared/assets.json` if it existed before
- Keep the fresh Expo Router entry setup.
- Reapply the cookbook-specific dependency set in `package.json` and `app.json`.

## Validation after regeneration

- Run these commands from inside the regenerated app directory:
  - `yarn expo install --check`
  - `yarn lint`
  - `yarn typecheck`
  - `yarn test --watchman=false`

## Lockfile guidance

- If the fresh scaffold causes dependency-resolution churn, restore the previous `yarn.lock` first and then run `yarn install` instead of re-resolving the full tree.
