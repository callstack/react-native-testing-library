# Interface: InitializationEntriesOptions

[getInitializationEntries](../functions/getInitializationEntries.md) options.

## Table of contents

### Properties

- [hmr](./InitializationEntriesOptions.md#hmr)
- [initializeCoreLocation](./InitializationEntriesOptions.md#initializecorelocation)

## Properties

### hmr

• `Optional` **hmr**: `boolean`

Whether Hot Module Replacement entry should be enabled. Defaults to `true`.

#### Defined in

[packages/repack/src/webpack/utils/getInitializationEntries.ts:15](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/utils/getInitializationEntries.ts#L15)

___

### initializeCoreLocation

• `Optional` **initializeCoreLocation**: `string`

Absolute location to JS file with initialization logic for React Native.
Useful if you want to built for out-of-tree platforms.

#### Defined in

[packages/repack/src/webpack/utils/getInitializationEntries.ts:11](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/utils/getInitializationEntries.ts#L11)
