# Interface: Reporter

## Implemented by

- [`ConsoleReporter`](../classes/ConsoleReporter.md)
- [`FileReporter`](../classes/FileReporter.md)

## Table of contents

### Methods

- [flush](./Reporter.md#flush)
- [process](./Reporter.md#process)
- [stop](./Reporter.md#stop)

## Methods

### flush

▸ **flush**(): `void`

#### Returns

`void`

#### Defined in

[packages/repack/src/logging/types.ts:3](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/logging/types.ts#L3)

___

### process

▸ **process**(`log`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `log` | [`LogEntry`](./LogEntry.md) |

#### Returns

`void`

#### Defined in

[packages/repack/src/logging/types.ts:2](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/logging/types.ts#L2)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[packages/repack/src/logging/types.ts:4](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/logging/types.ts#L4)
