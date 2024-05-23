# Function: getInitializationEntries

▸ **getInitializationEntries**(`reactNativePath`, `options?`): `string`[]

Get setup and initialization entires for Webpack configuration's `entry` field.
The returned entires should be added before your project entry.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `reactNativePath` | `string` | Absolute path to directory with React Native dependency. |
| `options` | [`InitializationEntriesOptions`](../interfaces/InitializationEntriesOptions.md) | Additional options that can modify returned entires. |

#### Returns

`string`[]

Array of entires.

#### Defined in

[packages/repack/src/webpack/utils/getInitializationEntries.ts:28](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/utils/getInitializationEntries.ts#L28)
