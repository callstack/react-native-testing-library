# Type alias: ScriptLocatorResolver

Ƭ **ScriptLocatorResolver**: (`scriptId`: `string`, `caller?`: `string`) => `Promise`<[`ScriptLocator`](../interfaces/ScriptLocator.md) \| `undefined`\>

#### Type declaration

▸ (`scriptId`, `caller?`): `Promise`<[`ScriptLocator`](../interfaces/ScriptLocator.md) \| `undefined`\>

Defines a function to resolve a script locator used in {@link ScriptManagerConfig}.
It's an async function which should return an object with data on how [ScriptManager](../classes/ScriptManager.md)
should fetch the script. All fields describing the script locator data are listed in [ScriptLocator](../interfaces/ScriptLocator.md).

Return `undefined` if the script should be resolved by other resolvers instead.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `scriptId` | `string` | Id of the script to resolve. |
| `caller?` | `string` | Name of the calling script - it can be for example: name of the bundle, chunk or container. |

##### Returns

`Promise`<[`ScriptLocator`](../interfaces/ScriptLocator.md) \| `undefined`\>

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:135](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L135)
