# Class: Reporter

Class that handles all reporting, logging and compilation progress handling.

## Table of contents

### Constructors

- [constructor](./Reporter.md#constructor)

### Properties

- [isVerbose](./Reporter.md#isverbose)
- [isWorker](./Reporter.md#isworker)

### Methods

- [attachResponse](./Reporter.md#attachresponse)
- [enableFileLogging](./Reporter.md#enablefilelogging)
- [flushFileLogs](./Reporter.md#flushfilelogs)
- [getLogBuffer](./Reporter.md#getlogbuffer)
- [getPrettyProgress](./Reporter.md#getprettyprogress)
- [process](./Reporter.md#process)
- [stop](./Reporter.md#stop)
- [colorizeText](./Reporter.md#colorizetext)
- [getSymbolForType](./Reporter.md#getsymbolfortype)

## Constructors

### constructor

• **new Reporter**(`config?`)

Create new instance of Reporter.
If Reporter is running as a non-worker, it will start outputting to terminal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`ReporterConfig`](../interfaces/ReporterConfig.md) | Reporter configuration. Defaults to empty object. |

#### Defined in

[packages/repack/src/Reporter.ts:107](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/Reporter.ts#L107)

## Properties

### isVerbose

• `Readonly` **isVerbose**: `boolean`

Whether reporter is running in verbose mode.

#### Defined in

[packages/repack/src/Reporter.ts:91](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/Reporter.ts#L91)

___

### isWorker

• `Readonly` **isWorker**: `boolean`

Whether reporter is running as a worker.

#### Defined in

[packages/repack/src/Reporter.ts:89](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/Reporter.ts#L89)

## Methods

### attachResponse

▸ **attachResponse**(`res`, `platform`): `void`

attach bundle request for later use.

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `MultipartResponse` |
| `platform` | `string` |

#### Returns

`void`

#### Defined in

[packages/repack/src/Reporter.ts:118](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/Reporter.ts#L118)

___

### enableFileLogging

▸ **enableFileLogging**(`filename`): `void`

Enable reporting to file alongside reporting to terminal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filename` | `string` | Absolute path to file to which write logs. |

#### Returns

`void`

#### Defined in

[packages/repack/src/Reporter.ts:145](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/Reporter.ts#L145)

___

### flushFileLogs

▸ **flushFileLogs**(): `void`

Flush all buffered logs to a file provided that file
reporting was enabled with [enableFileLogging](./Reporter.md#enablefilelogging).

#### Returns

`void`

#### Defined in

[packages/repack/src/Reporter.ts:153](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/Reporter.ts#L153)

___

### getLogBuffer

▸ **getLogBuffer**(): [`LogEntry`](../interfaces/LogEntry.md)[]

Get buffered server logs.

#### Returns

[`LogEntry`](../interfaces/LogEntry.md)[]

Array of server log entries.

#### Defined in

[packages/repack/src/Reporter.ts:127](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/Reporter.ts#L127)

___

### getPrettyProgress

▸ **getPrettyProgress**(`rawProgress`, `type?`): ``null`` \| `RegExpExecArray`

get done & total from progress message
rawProgress examples: "4/8 entries 47/78 dependencies 8/36 modules"

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `rawProgress` | `string` | `undefined` |
| `type` | ``"entries"`` \| ``"dependencies"`` \| ``"modules"`` | `'modules'` |

#### Returns

``null`` \| `RegExpExecArray`

#### Defined in

[packages/repack/src/Reporter.ts:263](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/Reporter.ts#L263)

___

### process

▸ **process**(`logEntry`): `void`

Process new log entry and report it to terminal and file if file reporting was enabled with
[enableFileLogging](./Reporter.md#enablefilelogging).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `logEntry` | [`LogEntry`](../interfaces/LogEntry.md) | Log entry to process & report. |

#### Returns

`void`

#### Defined in

[packages/repack/src/Reporter.ts:166](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/Reporter.ts#L166)

___

### stop

▸ **stop**(): `void`

Stop reporting and perform cleanup.

#### Returns

`void`

#### Defined in

[packages/repack/src/Reporter.ts:134](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/Reporter.ts#L134)

___

### colorizeText

▸ `Static` **colorizeText**(`logType`, `text`): `string`

Apply ANSI colors to given text.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `logType` | [`LogType`](../types/LogType.md) | Log type for the text, based on which different colors will be applied. |
| `text` | `string` | Text to apply the color onto. |

#### Returns

`string`

Text wrapped in ANSI color sequences.

#### Defined in

[packages/repack/src/Reporter.ts:78](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/Reporter.ts#L78)

___

### getSymbolForType

▸ `Static` **getSymbolForType**(`logType`): `string`

Get message symbol for given log type.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `logType` | [`LogType`](../types/LogType.md) | Log type. |

#### Returns

`string`

String with the symbol.

#### Defined in

[packages/repack/src/Reporter.ts:61](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/Reporter.ts#L61)
