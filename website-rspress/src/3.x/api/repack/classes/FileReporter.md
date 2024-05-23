# Class: FileReporter

## Implements

- [`Reporter`](../interfaces/Reporter.md)

## Table of contents

### Constructors

- [constructor](./FileReporter.md#constructor)

### Properties

- [throttledFlush](./FileReporter.md#throttledflush)

### Methods

- [flush](./FileReporter.md#flush)
- [process](./FileReporter.md#process)
- [stop](./FileReporter.md#stop)

## Constructors

### constructor

• **new FileReporter**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`FileReporterConfig`](../interfaces/FileReporterConfig.md) |

#### Defined in

[packages/repack/src/logging/reporters/FileReporter.ts:13](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/logging/reporters/FileReporter.ts#L13)

## Properties

### throttledFlush

• **throttledFlush**: `DebouncedFunc`<() => `void`\>

#### Defined in

[packages/repack/src/logging/reporters/FileReporter.ts:21](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/logging/reporters/FileReporter.ts#L21)

## Methods

### flush

▸ **flush**(): `void`

#### Returns

`void`

#### Implementation of

[Reporter](../interfaces/Reporter.md).[flush](../interfaces/Reporter.md#flush)

#### Defined in

[packages/repack/src/logging/reporters/FileReporter.ts:30](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/logging/reporters/FileReporter.ts#L30)

___

### process

▸ **process**(`log`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `log` | [`LogEntry`](../interfaces/LogEntry.md) |

#### Returns

`void`

#### Implementation of

[Reporter](../interfaces/Reporter.md).[process](../interfaces/Reporter.md#process)

#### Defined in

[packages/repack/src/logging/reporters/FileReporter.ts:25](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/logging/reporters/FileReporter.ts#L25)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Implementation of

[Reporter](../interfaces/Reporter.md).[stop](../interfaces/Reporter.md#stop)

#### Defined in

[packages/repack/src/logging/reporters/FileReporter.ts:41](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/logging/reporters/FileReporter.ts#L41)
