# Interface: LoggerPluginConfig

[LoggerPlugin](../classes/LoggerPlugin.md) configuration options.

## Table of contents

### Properties

- [devServerEnabled](./LoggerPluginConfig.md#devserverenabled)
- [output](./LoggerPluginConfig.md#output)
- [platform](./LoggerPluginConfig.md#platform)

## Properties

### devServerEnabled

• `Optional` **devServerEnabled**: `boolean`

Whether development server is running/enabled.

#### Defined in

[packages/repack/src/webpack/plugins/LoggerPlugin.ts:14](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/LoggerPlugin.ts#L14)

___

### output

• `Optional` **output**: `Object`

Logging output config.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `console?` | `boolean` | Whether to log to console. |
| `file?` | `string` | Absolute path to file to log messages to. |
| `listener?` | (`logEntry`: [`LogEntry`](./LogEntry.md)) => `void` | - |

#### Defined in

[packages/repack/src/webpack/plugins/LoggerPlugin.ts:16](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/LoggerPlugin.ts#L16)

___

### platform

• **platform**: `string`

Target application platform.

#### Defined in

[packages/repack/src/webpack/plugins/LoggerPlugin.ts:12](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/LoggerPlugin.ts#L12)
