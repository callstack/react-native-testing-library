# Class: Symbolicator

Class for transforming stack traces from React Native application with using Source Map.
Raw stack frames produced by React Native, points to some location from the bundle
eg `index.bundle?platform=ios:567:1234`. By using Source Map for that bundle `Symbolicator`
produces frames that point to source code inside your project eg `Hello.tsx:10:9`.

## Table of contents

### Constructors

- [constructor](./Symbolicator.md#constructor)

### Properties

- [sourceMapConsumerCache](./Symbolicator.md#sourcemapconsumercache)

### Methods

- [process](./Symbolicator.md#process)
- [inferPlatformFromStack](./Symbolicator.md#inferplatformfromstack)

## Constructors

### constructor

• **new Symbolicator**(`projectRoot`, `logger`, `readFileFromWdm`, `readSourceMapFromWdm`)

Constructs new `Symbolicator` instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `projectRoot` | `string` | Absolute path to root directory of the project. |
| `logger` | `FastifyLoggerInstance` | Fastify logger instance. |
| `readFileFromWdm` | (`fileUrl`: `string`) => `Promise`<`string`\> | Function to read arbitrary file from webpack-dev-middleware. |
| `readSourceMapFromWdm` | (`fileUrl`: `string`) => `Promise`<`string`\> | Function to read Source Map file from webpack-dev-middleware. |

#### Defined in

[packages/repack/src/server/Symbolicator.ts:103](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/Symbolicator.ts#L103)

## Properties

### sourceMapConsumerCache

• **sourceMapConsumerCache**: `Record`<`string`, `SourceMapConsumer`\> = `{}`

Cache with initialized `SourceMapConsumer` to improve symbolication performance.

#### Defined in

[packages/repack/src/server/Symbolicator.ts:93](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/Symbolicator.ts#L93)

## Methods

### process

▸ **process**(`stack`): `Promise`<[`SymbolicatorResults`](../interfaces/SymbolicatorResults.md)\>

Process raw React Native stack frames and transform them using Source Maps.
Method will try to symbolicate as much data as possible, but if the Source Maps
are not available, invalid or the original positions/data is not found in Source Maps,
the method will return raw values - the same as supplied with `stack` parameter.
For example out of 10 frames, it's possible that only first 7 will be symbolicated and the
remaining 3 will be unchanged.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stack` | [`ReactNativeStackFrame`](../interfaces/ReactNativeStackFrame.md)[] | Raw stack frames. |

#### Returns

`Promise`<[`SymbolicatorResults`](../interfaces/SymbolicatorResults.md)\>

Symbolicated stack frames.

#### Defined in

[packages/repack/src/server/Symbolicator.ts:121](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/Symbolicator.ts#L121)

___

### inferPlatformFromStack

▸ `Static` **inferPlatformFromStack**(`stack`): `undefined` \| `string`

Infer platform from stack frames.
Usually at least one frame has `file` field with the bundle URL eg:
`http://localhost:8081/index.bundle?platform=ios&...`, which can be used to infer platform.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stack` | [`ReactNativeStackFrame`](../interfaces/ReactNativeStackFrame.md)[] | Array of stack frames. |

#### Returns

`undefined` \| `string`

Inferred platform or `undefined` if cannot infer.

#### Defined in

[packages/repack/src/server/Symbolicator.ts:70](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/Symbolicator.ts#L70)
