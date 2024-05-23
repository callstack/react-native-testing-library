# Interface: HMRMessageBody

Represent Hot Module Replacement Update body.
Used by [WebSocketHMRServer](../classes/WebSocketHMRServer.md) and `WebpackHMRClient`.

**`internal`**

## Table of contents

### Properties

- [errors](./HMRMessageBody.md#errors)
- [hash](./HMRMessageBody.md#hash)
- [modules](./HMRMessageBody.md#modules)
- [name](./HMRMessageBody.md#name)
- [time](./HMRMessageBody.md#time)
- [warnings](./HMRMessageBody.md#warnings)

## Properties

### errors

• **errors**: `undefined` \| `StatsError`[]

#### Defined in

[packages/repack/src/types.ts:188](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L188)

___

### hash

• **hash**: `string`

#### Defined in

[packages/repack/src/types.ts:186](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L186)

___

### modules

• **modules**: `Record`<`string`, `string`\>

#### Defined in

[packages/repack/src/types.ts:189](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L189)

___

### name

• **name**: `string`

#### Defined in

[packages/repack/src/types.ts:184](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L184)

___

### time

• **time**: `number`

#### Defined in

[packages/repack/src/types.ts:185](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L185)

___

### warnings

• **warnings**: `undefined` \| `StatsError`[]

#### Defined in

[packages/repack/src/types.ts:187](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L187)
