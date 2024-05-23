# Interface: Config

[Server](../modules/Server.md).Config

Development server configuration.

## Table of contents

### Properties

- [options](./Server.Config.md#options)

### Methods

- [delegate](./Server.Config.md#delegate)

## Properties

### options

• **options**: [`Options`](./Server.Options.md)

Development server options to configure e.g: `port`, `host` etc.

#### Defined in

[types.ts:21](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/types.ts#L21)

## Methods

### delegate

▸ **delegate**(`context`): [`Delegate`](./Server.Delegate.md)

Function to create a delegate, which implements crucial functionalities.

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`DelegateContext`](./Server.DelegateContext.md) |

#### Returns

[`Delegate`](./Server.Delegate.md)

#### Defined in

[types.ts:24](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/types.ts#L24)
