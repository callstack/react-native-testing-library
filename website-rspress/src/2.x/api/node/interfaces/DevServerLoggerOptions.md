# Interface: DevServerLoggerOptions

Development server logging configuration.
Apart from 'stream' all other fields come from Fastify types.

## Hierarchy

- `FastifyLoggerOptions`

  ↳ **`DevServerLoggerOptions`**

## Table of contents

### Properties

- [level](./DevServerLoggerOptions.md#level)
- [prettyPrint](./DevServerLoggerOptions.md#prettyprint)
- [serializers](./DevServerLoggerOptions.md#serializers)
- [stream](./DevServerLoggerOptions.md#stream)

### Methods

- [genReqId](./DevServerLoggerOptions.md#genreqid)

## Properties

### level

• `Optional` **level**: `string`

#### Inherited from

FastifyLoggerOptions.level

#### Defined in

node_modules/fastify/types/logger.d.ts:143

___

### prettyPrint

• `Optional` **prettyPrint**: `boolean` \| `PrettyOptions`

#### Inherited from

FastifyLoggerOptions.prettyPrint

#### Defined in

node_modules/fastify/types/logger.d.ts:145

___

### serializers

• `Optional` **serializers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `err?` | (`err`: `FastifyError`) => { [key: string]: `unknown`; `message`: `string` ; `stack`: `string` ; `type`: `string`  } |
| `req?` | (`req`: `RawRequest`) => { [key: string]: `unknown`; `hostname?`: `string` ; `method?`: `string` ; `remoteAddress?`: `string` ; `remotePort?`: `number` ; `url?`: `string` ; `version?`: `string`  } |
| `res?` | (`res`: `RawReply`) => { [key: string]: `unknown`; `statusCode`: `string` \| `number`  } |

#### Inherited from

FastifyLoggerOptions.serializers

#### Defined in

node_modules/fastify/types/logger.d.ts:122

___

### stream

• `Optional` **stream**: `Writable`

Stream to write logs to.

#### Defined in

[packages/repack/src/server/types.ts:50](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/types.ts#L50)

## Methods

### genReqId

▸ `Optional` **genReqId**(`req`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `RawRequest` |

#### Returns

`string`

#### Inherited from

FastifyLoggerOptions.genReqId

#### Defined in

node_modules/fastify/types/logger.d.ts:144
