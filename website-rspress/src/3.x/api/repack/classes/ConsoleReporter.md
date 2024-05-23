# Class: ConsoleReporter

## Implements

- [`Reporter`](../interfaces/Reporter.md)

## Table of contents

### Constructors

- [constructor](./ConsoleReporter.md#constructor)

### Methods

- [flush](./ConsoleReporter.md#flush)
- [process](./ConsoleReporter.md#process)
- [stop](./ConsoleReporter.md#stop)

## Constructors

### constructor

• **new ConsoleReporter**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`ConsoleReporterConfig`](../interfaces/ConsoleReporterConfig.md) |

#### Defined in

[packages/repack/src/logging/reporters/ConsoleReporter.ts:15](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/logging/reporters/ConsoleReporter.ts#L15)

## Methods

### flush

▸ **flush**(): `void`

#### Returns

`void`

#### Implementation of

[Reporter](../interfaces/Reporter.md).[flush](../interfaces/Reporter.md#flush)

#### Defined in

[packages/repack/src/logging/reporters/ConsoleReporter.ts:26](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/logging/reporters/ConsoleReporter.ts#L26)

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

[packages/repack/src/logging/reporters/ConsoleReporter.ts:22](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/logging/reporters/ConsoleReporter.ts#L22)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Implementation of

[Reporter](../interfaces/Reporter.md).[stop](../interfaces/Reporter.md#stop)

#### Defined in

[packages/repack/src/logging/reporters/ConsoleReporter.ts:30](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/logging/reporters/ConsoleReporter.ts#L30)
