# Function: bundle

▸ **bundle**(`_`, `config`, `args`): `void`

Bundle command for React Native CLI.
It runs Webpack, builds bundle and saves it alongside any other assets and Source Map
to filesystem.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `_` | `string`[] | Original, non-parsed arguments that were provided when running this command. |
| `config` | `Config` | React Native CLI configuration object. |
| `args` | [`BundleArguments`](../interfaces/BundleArguments.md) | Parsed command line arguments. |

#### Returns

`void`

#### Defined in

[packages/repack/src/commands/bundle.ts:19](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/commands/bundle.ts#L19)
