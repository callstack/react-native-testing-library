# Function: getPublicPath

▸ **getPublicPath**(`options?`): `string`

Get Webpack's public path.

**`example`** Usage in Webpack config:
```ts
import * as Repack from '@callstack/repack';

export default (env) => {
  const {
    platform,
    devServer = undefined,
  } = env;

  return {
    output: {
      publicPath: Repack.getPublicPath({ platform, devServer }),
    },
  };
};
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`GetPublicPathOptions`](../interfaces/GetPublicPathOptions.md) | Options object. |

#### Returns

`string`

Value for Webpack's `output.publicPath` option.

#### Defined in

[packages/repack/src/webpack/utils/getPublicPath.ts:38](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/utils/getPublicPath.ts#L38)
