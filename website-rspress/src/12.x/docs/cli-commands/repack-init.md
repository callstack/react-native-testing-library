# repack-init

`@callstack/repack-init` is a command-line tool that helps you to set up Re.Pack in your React Native project. It installs all required dependencies and configures your project to use Re.Pack.

## Usage

In the root of an existing React Native project, run this command in your terminal of choice:

```bash
npx @callstack/repack-init [options]
```

## Options

### --custom-version, -c

- Type: `string`
- Default: `latest`

Use a custom version of Re.Pack.

### --entry, -e

- Type: `string`
- Default: `index.js`

Path to the entry file of your `react-native` application.

### --format, -f

- Type: `mjs` | `cjs`
- Default: `mjs`

Format of the Webpack config file. Available choices `mjs`, `cjs`.

### --verbose, -v

- Type: `boolean`
- Default: `false`

Enable verbose output.

### --version

Show version number.
