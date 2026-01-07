# RNTL v14: Update Dependencies

This codemod automatically updates your `package.json` to prepare for React Native Testing Library v14 migration.

## What it does

- Removes `@types/react-test-renderer` and `react-test-renderer` (no longer needed)
- Moves `@testing-library/react-native` to `devDependencies` if it's in `dependencies`
- Updates `@testing-library/react-native` to `^14.0.0-alpha.5`
- Adds `test-renderer@0.10.1` to `devDependencies`

## Usage

```bash
# Run the codemod
npx codemod@latest run rntl-v14-update-deps --target ./path/to/your/project
```

## Example

**Before:**

```json
{
  "dependencies": {
    "@testing-library/react-native": "^13.0.0"
  },
  "devDependencies": {
    "@types/react-test-renderer": "^18.0.0",
    "react-test-renderer": "^18.0.0"
  }
}
```

**After:**

```json
{
  "devDependencies": {
    "@testing-library/react-native": "^14.0.0-alpha.5",
    "test-renderer": "0.10.1"
  }
}
```

## Important notes

- **After running the codemod**, you must run your package manager to install dependencies:
  ```bash
  npm install
  # or yarn install / pnpm install
  ```
- The codemod sets the version to `^14.0.0-alpha.5`. You can manually update this if needed.
- For monorepos, the codemod processes each `package.json` file individually.

## Next steps

1. Run this codemod to update dependencies
2. Run `npm install` (or your package manager) to install the new dependencies
3. Run the async-functions codemod to update your test code:
   ```bash
   npx codemod@latest run rntl-v14-async-functions --target ./path/to/your/tests
   ```
4. Review and test your changes
