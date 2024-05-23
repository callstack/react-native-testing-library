# Function: getInitializationEntries

▸ **getInitializationEntries**(`reactNativePath`, `options?`): `string`[]

Get setup and initialization entires for Webpack configuration's `entry` field.
The returned entires should be added before your project entry.

**`example`** Usage in Webpack config:
```ts
import * as Repack from '@callstack/repack';

export default (env) => {
  const {
    devServer,
    reactNativePath = new URL('./node_modules/react-native', import.meta.url)
      .pathname,
  } = env;

  return {
    entry: [
      ...Repack.getInitializationEntries(reactNativePath, {
        hmr: devServer && devServer.hmr,
      }),
      entry,
    ],
  };
};
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `reactNativePath` | `string` | Absolute path to directory with React Native dependency. |
| `options` | [`InitializationEntriesOptions`](../interfaces/InitializationEntriesOptions.md) | Additional options that can modify returned entires. |

#### Returns

`string`[]

Array of entires.

#### Defined in

[packages/repack/src/webpack/utils/getInitializationEntries.ts:50](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/utils/getInitializationEntries.ts#L50)
