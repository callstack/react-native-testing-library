# Function: bundle

▸ **bundle**(`_`, `config`, `args`): `Promise`<`void`\>

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

`Promise`<`void`\>

#### Defined in

[packages/repack/src/commands/bundle.ts:23](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/commands/bundle.ts#L23)
