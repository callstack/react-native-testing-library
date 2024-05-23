# Type alias: DestinationMatchRules

[plugins](../modules/plugins.md).DestinationMatchRules

Ƭ **DestinationMatchRules**: `Object`

Matching options to check if given [DestinationConfig](./plugins.DestinationConfig.md) should be used.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `exclude?` | [`Rule`](./Rule.md) \| [`Rule`](./Rule.md)[] | Rule (string or RegExp) that __MUST NOT__ match the chunk name (or id if name is not available), for the whole `DestinationMatchRules` to match. |
| `include?` | [`Rule`](./Rule.md) \| [`Rule`](./Rule.md)[] | Rule (string or RegExp) that must match the chunk name (or id if name is not available), for the whole `DestinationMatchRules` to match. |
| `test?` | [`Rule`](./Rule.md) \| [`Rule`](./Rule.md)[] | Rule (string or RegExp) that must match the chunk name (or id if name is not available), for the whole `DestinationMatchRules` to match. |

#### Defined in

[packages/repack/src/webpack/plugins/OutputPlugin.ts:10](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/OutputPlugin.ts#L10)
