# Interface: LoggerPluginConfig

[plugins](../modules/plugins.md).LoggerPluginConfig

[LoggerPlugin](../classes/plugins.LoggerPlugin.md) configuration options.

## Table of contents

### Properties

- [devServerEnabled](./plugins.LoggerPluginConfig.md#devserverenabled)
- [output](./plugins.LoggerPluginConfig.md#output)
- [platform](./plugins.LoggerPluginConfig.md#platform)

## Properties

### devServerEnabled

• `Optional` **devServerEnabled**: `boolean`

Whether development server is running/enabled.

#### Defined in

[packages/repack/src/webpack/plugins/LoggerPlugin.ts:22](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/LoggerPlugin.ts#L22)

___

### output

• `Optional` **output**: `Object`

Logging output config.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `console?` | `boolean` | Whether to log to console. |
| `file?` | `string` | Absolute path to file to log messages to. |
| `listener?` | (`logEntry`: [`LogEntry`](./LogEntry.md)) => `void` | Listener for new messages. |

#### Defined in

[packages/repack/src/webpack/plugins/LoggerPlugin.ts:24](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/LoggerPlugin.ts#L24)

___

### platform

• **platform**: `string`

Target application platform.

#### Defined in

[packages/repack/src/webpack/plugins/LoggerPlugin.ts:20](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/LoggerPlugin.ts#L20)
