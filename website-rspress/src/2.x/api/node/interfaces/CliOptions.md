# Interface: CliOptions

Holds all information used by {@link parseCliOptions}.

**`internal`**

## Table of contents

### Properties

- [arguments](./CliOptions.md#arguments)
- [command](./CliOptions.md#command)
- [config](./CliOptions.md#config)

## Properties

### arguments

• **arguments**: { `bundle`: [`BundleArguments`](./BundleArguments.md)  } \| { `start`: [`StartArguments`](./StartArguments.md)  }

#### Defined in

[packages/repack/src/types.ts:114](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L114)

___

### command

• **command**: ``"bundle"`` \| ``"start"``

#### Defined in

[packages/repack/src/types.ts:113](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L113)

___

### config

• **config**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `reactNativePath` | `string` |
| `root` | `string` |
| `webpackConfigPath` | `string` |

#### Defined in

[packages/repack/src/types.ts:108](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L108)
