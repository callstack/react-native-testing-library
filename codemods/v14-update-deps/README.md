# RNTL v14: Update Dependencies

This codemod updates your `package.json` file to prepare for React Native Testing Library v14 migration by:

- ✅ Removing `@types/react-test-renderer` (no longer needed)
- ✅ Removing `react-test-renderer` (replaced by universal-test-renderer)
- ✅ Moving `@testing-library/react-native` from `dependencies` to `devDependencies` if present
- ✅ Adding `@testing-library/react-native@^14.0.0-alpha` to `devDependencies` if not present
- ✅ Updating `@testing-library/react-native` to `^14.0.0-alpha` (latest alpha version)
- ✅ Adding `universal-test-renderer@0.10.1` to `devDependencies` (always added)

## What it does

This codemod automatically updates your `package.json` dependencies to match the requirements for RNTL v14. It:

1. **Removes deprecated packages**: `@types/react-test-renderer` and `react-test-renderer` are removed from all dependency types (dependencies, devDependencies, peerDependencies, optionalDependencies)

2. **Moves RNTL to devDependencies**: If `@testing-library/react-native` is in `dependencies`, it's moved to `devDependencies`

3. **Ensures RNTL is present**: If `@testing-library/react-native` is not present, it's added to `devDependencies` with version `^14.0.0-alpha`

4. **Updates RNTL version**: Updates `@testing-library/react-native` to `^14.0.0-alpha` to get the latest alpha version

5. **Adds universal-test-renderer**: Always adds `universal-test-renderer@0.10.1` to `devDependencies`

## Usage

### Running the codemod

```bash
# Run on your project
npx codemod@latest workflow run -w ./codemods/v14-update-deps/workflow.yaml --target ./path/to/your/project

# Or if published to the registry
npx codemod@latest run @testing-library/react-native-v14-update-deps --target ./path/to/your/project
```

### Example transformations

#### Before:
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

#### After:
```json
{
  "devDependencies": {
    "@testing-library/react-native": "^14.0.0-alpha",
    "universal-test-renderer": "0.10.1"
  }
}
```

#### Moving from dependencies to devDependencies:

**Before:**
```json
{
  "dependencies": {
    "@testing-library/react-native": "^13.0.0"
  }
}
```

**After:**
```json
{
  "devDependencies": {
    "@testing-library/react-native": "^14.0.0-alpha",
    "universal-test-renderer": "0.10.1"
  }
}
```

#### Adding if not present:

**Before:**
```json
{
  "devDependencies": {
    "some-other-package": "^1.0.0"
  }
}
```

**After:**
```json
{
  "devDependencies": {
    "some-other-package": "^1.0.0",
    "@testing-library/react-native": "^14.0.0-alpha",
    "universal-test-renderer": "0.10.1"
  }
}
```

## Important Notes

1. **After running the codemod**, you'll need to run your package manager to install the new dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Version resolution**: The codemod sets `@testing-library/react-native` to `^14.0.0-alpha`, which will resolve to the latest alpha version available. You can manually update this to a specific version if needed.

3. **Always adds packages**: The codemod always ensures both `@testing-library/react-native` and `universal-test-renderer` are present in `devDependencies`, even if they weren't there before.

## Testing

Run the test suite:

```bash
cd codemods/v14-update-deps
npm test
```

## Limitations

1. **Package manager**: The codemod updates `package.json` but doesn't run the package manager install command. You need to run `npm install` / `yarn install` / `pnpm install` manually after the codemod completes.

2. **Version pinning**: If you have a specific alpha version pinned, the codemod will update it to the range `^14.0.0-alpha`. You may want to review and adjust the version after running the codemod.

3. **Workspace projects**: For monorepos with multiple `package.json` files, the codemod will process each one individually.

## Migration Guide

1. **Run this codemod** to update your dependencies
2. **Run your package manager** to install the new dependencies:
   ```bash
   npm install
   ```
3. **Run the render-async codemod** to update your test code:
   ```bash
   npx codemod@latest run @testing-library/react-native-v14-async-functions --target ./path/to/your/tests
   ```
4. **Review and test** your changes
5. **Update your RNTL version** to a specific alpha version if needed

## Contributing

If you find issues or have suggestions for improvements, please open an issue or submit a pull request to the React Native Testing Library repository.
