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

[packages/repack/src/types.ts:96](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L96)

___

### command

• **command**: ``"bundle"`` \| ``"start"``

#### Defined in

[packages/repack/src/types.ts:95](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L95)

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

[packages/repack/src/types.ts:90](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L90)
