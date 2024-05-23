# Interface: SymbolicatorDelegate

Delegate with implementation for symbolication functions.

## Table of contents

### Methods

- [getSource](./SymbolicatorDelegate.md#getsource)
- [getSourceMap](./SymbolicatorDelegate.md#getsourcemap)
- [shouldIncludeFrame](./SymbolicatorDelegate.md#shouldincludeframe)

## Methods

### getSource

▸ **getSource**(`fileUrl`): `Promise`<`string` \| `Buffer`\>

Get source code of file in the URL.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileUrl` | `string` | A full URL pointing to a file. |

#### Returns

`Promise`<`string` \| `Buffer`\>

#### Defined in

[plugins/symbolicate/types.ts:54](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/plugins/symbolicate/types.ts#L54)

___

### getSourceMap

▸ **getSourceMap**(`fileUrl`): `Promise`<`string` \| `Buffer`\>

Get source map for the file in the URL.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileUrl` | `string` | A full (usually `http:`) URL pointing to a compiled file. The URL points to a file for which to return source map, not to the source map file itself, e.g: `http://localhost:8081/index.bundle?platform=ios`. |

#### Returns

`Promise`<`string` \| `Buffer`\>

#### Defined in

[plugins/symbolicate/types.ts:63](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/plugins/symbolicate/types.ts#L63)

___

### shouldIncludeFrame

▸ **shouldIncludeFrame**(`frame`): `boolean`

Check if given stack frame should be included in the new symbolicated stack.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `frame` | [`StackFrame`](./StackFrame.md) | Stack frame to check. |

#### Returns

`boolean`

#### Defined in

[plugins/symbolicate/types.ts:70](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/plugins/symbolicate/types.ts#L70)
