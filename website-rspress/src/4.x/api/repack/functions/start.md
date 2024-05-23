# Function: start

▸ **start**(`_`, `config`, `args`): `Promise`<{ `stop`: () => `Promise`<`void`\>  }\>

Start command for React Native CLI.
It runs `@callstack/repack-dev-server` to provide Development Server functionality to React Native apps
in development mode.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `_` | `string`[] | Original, non-parsed arguments that were provided when running this command. |
| `config` | `Config` | React Native CLI configuration object. |
| `args` | [`StartArguments`](../interfaces/StartArguments.md) | Parsed command line arguments. |

#### Returns

`Promise`<{ `stop`: () => `Promise`<`void`\>  }\>

#### Defined in

[packages/repack/src/commands/start.ts:31](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/commands/start.ts#L31)
