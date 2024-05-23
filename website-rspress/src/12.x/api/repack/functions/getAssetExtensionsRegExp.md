# Function: getAssetExtensionsRegExp

▸ **getAssetExtensionsRegExp**(`extensions`): `RegExp`

Creates RegExp from array of asset extensions.

**`example`** Usage in Webpack config:
```ts
import React from '@callstack/repack';

export default () => {
  return {
    module: {
      rules: [{
        test: React.getAssetExtensionsRegExp(
          Repack.ASSET_EXTENSIONS.filter((ext) => ext !== 'svg')
        ),
        use: {
          loader: '@callstack/repack/assets-loader',
        }
      }],
    },
  };
};
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `extensions` | `string`[] | Extensions array. |

#### Returns

`RegExp`

RegExp with extensions.

#### Defined in

[packages/repack/src/webpack/utils/assetExtensions.ts:71](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/utils/assetExtensions.ts#L71)
