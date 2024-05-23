# Class: LoggerPlugin

[plugins](../modules/plugins.md).LoggerPlugin

Logger plugin that handles all logging coming from the Webpack ecosystem, including compilation
progress as well as debug logs from other plugins and resolvers.

## Implements

- [`WebpackPlugin`](../interfaces/WebpackPlugin.md)

## Table of contents

### Constructors

- [constructor](./plugins.LoggerPlugin.md#constructor)

### Properties

- [reporter](./plugins.LoggerPlugin.md#reporter)

### Methods

- [apply](./plugins.LoggerPlugin.md#apply)
- [createEntry](./plugins.LoggerPlugin.md#createentry)
- [processEntry](./plugins.LoggerPlugin.md#processentry)

## Constructors

### constructor

• **new LoggerPlugin**(`config`)

Constructs new `LoggerPlugin`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`LoggerPluginConfig`](../interfaces/plugins.LoggerPluginConfig.md) | Plugin configuration options. |

#### Defined in

[packages/repack/src/webpack/plugins/LoggerPlugin.ts:51](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/LoggerPlugin.ts#L51)

## Properties

### reporter

• `Readonly` **reporter**: [`Reporter`](../interfaces/Reporter.md)

[Reporter](../interfaces/Reporter.md) instance used to actually writing logs to terminal/file.

#### Defined in

[packages/repack/src/webpack/plugins/LoggerPlugin.ts:44](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/LoggerPlugin.ts#L44)

## Methods

### apply

▸ **apply**(`compiler`): `void`

Apply the plugin.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `compiler` | `Compiler` | Webpack compiler instance. |

#### Returns

`void`

#### Implementation of

[WebpackPlugin](../interfaces/WebpackPlugin.md).[apply](../interfaces/WebpackPlugin.md#apply)

#### Defined in

[packages/repack/src/webpack/plugins/LoggerPlugin.ts:126](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/LoggerPlugin.ts#L126)

___

### createEntry

▸ **createEntry**(`issuer`, `type`, `args`, `timestamp?`): `undefined` \| [`LogEntry`](../interfaces/LogEntry.md)

Create log entry from Webpack log message from [WebpackLogger](../types/WebpackLogger.md).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `issuer` | `string` | Issuer of the message. |
| `type` | `string` | Type of the message. |
| `args` | `any`[] | The body of the message. |
| `timestamp?` | `number` | Timestamp when the message was recorder. |

#### Returns

`undefined` \| [`LogEntry`](../interfaces/LogEntry.md)

Log entry object or undefined when if message is invalid.

#### Defined in

[packages/repack/src/webpack/plugins/LoggerPlugin.ts:80](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/LoggerPlugin.ts#L80)

___

### processEntry

▸ **processEntry**(`entry`): `void`

Process log entry and pass it to [reporter](./plugins.LoggerPlugin.md#reporter) instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `entry` | [`LogEntry`](../interfaces/LogEntry.md) | Log entry to process |

#### Returns

`void`

#### Defined in

[packages/repack/src/webpack/plugins/LoggerPlugin.ts:105](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/LoggerPlugin.ts#L105)
