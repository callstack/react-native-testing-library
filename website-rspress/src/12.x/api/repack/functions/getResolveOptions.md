# Function: getResolveOptions

▸ **getResolveOptions**(`platform`): `Object`

Get Webpack's resolve options to properly resolve JavaScript files
that contain `<platform>` or `native` (eg `file.ios.js`) suffixes as well as `react-native` field
in dependencies' `package.json`.

**`example`** Usage in Webpack config:
```ts
import * as Repack from '@callstack/repack';

export default (env) => {
  const { platform } = env;

  return {
    resolve: {
      ...Repack.getResolveOptions(platform),
    },
  };
};
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `platform` | `string` | Target application platform. |

#### Returns

`Object`

Webpack's resolve options.

| Name | Type | Description |
| :------ | :------ | :------ |
| `aliasFields` | `string`[] | - |
| `conditionNames` | `string`[] | - |
| `extensions` | `string`[] | - |
| `mainFields` | `string`[] | Match what React Native packager supports. First entry takes precedence. |

#### Defined in

[packages/repack/src/webpack/utils/getResolveOptions.ts:26](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/utils/getResolveOptions.ts#L26)
