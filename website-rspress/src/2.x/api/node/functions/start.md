# Function: start

▸ **start**(`_`, `config`, `args`): `void`

Start command for React Native CLI.
It runs [DevServerProxy](../classes/DevServerProxy.md) to provide Development Server functionality to React Native apps
in development mode.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `_` | `string`[] | Original, non-parsed arguments that were provided when running this command. |
| `config` | `Config` | React Native CLI configuration object. |
| `args` | [`StartArguments`](../interfaces/StartArguments.md) | Parsed command line arguments. |

#### Returns

`void`

#### Defined in

[packages/repack/src/commands/start.ts:21](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/commands/start.ts#L21)
