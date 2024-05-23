# Function: getResolveOptions

▸ **getResolveOptions**(`platform`): `Object`

Get Webpack's resolve options to properly resolve JavaScript files
that contain `<platform>` or `native` (eg `file.ios.js`) suffixes as well as `react-native` field
in dependencies' `package.json`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `platform` | `string` | Target application platform. |

#### Returns

`Object`

Webpack's resolve options.

| Name | Type |
| :------ | :------ |
| `aliasFields` | `string`[] |
| `extensions` | `string`[] |
| `mainFields` | `string`[] |

#### Defined in

[packages/repack/src/webpack/utils/getResolveOptions.ts:11](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/utils/getResolveOptions.ts#L11)
