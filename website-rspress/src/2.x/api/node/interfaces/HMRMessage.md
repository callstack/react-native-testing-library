# Interface: HMRMessage

Represent Hot Module Replacement Update message.
Used by [WebSocketHMRServer](../classes/WebSocketHMRServer.md) and `WebpackHMRClient`.

**`internal`**

## Table of contents

### Properties

- [action](./HMRMessage.md#action)
- [body](./HMRMessage.md#body)

## Properties

### action

• **action**: ``"building"`` \| ``"built"`` \| ``"sync"``

#### Defined in

[packages/repack/src/types.ts:199](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L199)

___

### body

• **body**: ``null`` \| [`HMRMessageBody`](./HMRMessageBody.md)

#### Defined in

[packages/repack/src/types.ts:200](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L200)
