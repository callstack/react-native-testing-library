# Function: getDirname

▸ **getDirname**(`fileUrl`): `string`

Get absolute directory (without any protocol) from a `file://` URL of a module.
Mostly useful in ESM Webpack configs, where `__dirname` is not available, but `import.meta.url` is.

**`example`** Usage in Webpack config (ESM):
```ts
import * as Repack from '@callstack/repack';

export default (env) => {
  const {
    context = Repack.getDirname(import.meta.url)
  } = env;
};
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileUrl` | `string` | String with absolute `file://` URL of a module. |

#### Returns

`string`

Absolute dirname without `file://` of a module pointed by `fileUrl`.

#### Defined in

[packages/repack/src/webpack/utils/getDirname.ts:24](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/utils/getDirname.ts#L24)
