# Interface: NormalizedScriptLocator

Internal representation of script locator data.

**`internal`**

## Table of contents

### Properties

- [absolute](./NormalizedScriptLocator.md#absolute)
- [body](./NormalizedScriptLocator.md#body)
- [fetch](./NormalizedScriptLocator.md#fetch)
- [headers](./NormalizedScriptLocator.md#headers)
- [method](./NormalizedScriptLocator.md#method)
- [query](./NormalizedScriptLocator.md#query)
- [timeout](./NormalizedScriptLocator.md#timeout)
- [url](./NormalizedScriptLocator.md#url)
- [verifyScriptSignature](./NormalizedScriptLocator.md#verifyscriptsignature)

## Properties

### absolute

• **absolute**: `boolean`

Whether script's URL is an absolute FileSystem URL on a target device.

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:172](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L172)

___

### body

• `Optional` **body**: `string`

Request body.

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:181](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L181)

___

### fetch

• **fetch**: `boolean`

Whether to fetch script from the network or use cached one.

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:166](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L166)

___

### headers

• `Optional` **headers**: `Record`<`string`, `string`\>

Request headers.

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:178](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L178)

___

### method

• **method**: ``"GET"`` \| ``"POST"``

HTTP method.

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:160](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L160)

___

### query

• `Optional` **query**: `string`

Query params.

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:175](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L175)

___

### timeout

• **timeout**: `number`

Custom timeout for script fetch requests.

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:169](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L169)

___

### url

• **url**: `string`

Path-only URL to a script's location.

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:163](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L163)

___

### verifyScriptSignature

• `Optional` **verifyScriptSignature**: ``"strict"`` \| ``"lax"`` \| ``"off"``

Whether script's signature should be verified or not

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:184](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L184)
