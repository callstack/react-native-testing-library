# Interface: ReactNativeMessage

Message representation used by [WebSocketMessageServer](../classes/WebSocketMessageServer.md).

## Table of contents

### Properties

- [error](./ReactNativeMessage.md#error)
- [id](./ReactNativeMessage.md#id)
- [method](./ReactNativeMessage.md#method)
- [params](./ReactNativeMessage.md#params)
- [result](./ReactNativeMessage.md#result)
- [target](./ReactNativeMessage.md#target)
- [version](./ReactNativeMessage.md#version)

## Properties

### error

• `Optional` **error**: `Error`

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:24](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L24)

___

### id

• `Optional` **id**: [`ReactNativeIdObject`](./ReactNativeIdObject.md)

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:20](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L20)

___

### method

• `Optional` **method**: `string`

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:21](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L21)

___

### params

• `Optional` **params**: `Record`<`string`, `any`\>

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:25](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L25)

___

### result

• `Optional` **result**: `any`

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:23](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L23)

___

### target

• **target**: `string`

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:22](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L22)

___

### version

• `Optional` **version**: `string`

#### Defined in

[packages/repack/src/server/ws/WebSocketMessageServer.ts:19](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/ws/WebSocketMessageServer.ts#L19)
