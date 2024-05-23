# Variable: SHARED\_REACT

[Federated](../modules/Federated.md).SHARED_REACT

• `Const` **SHARED\_REACT**: `Object`

Predefined options for shared `react` dependency.

**`example`** Basic example.
```js
import * as Repack from '@callstack/repack';

new Repack.plugins.ModuleFederationPlugin({
  // ...
  shared: {
    react: Repack.Federated.SHARED_REACT,
  }
});
```

**`example`** Example with spread and additional options.
```js
import * as Repack from '@callstack/repack';

new Repack.plugins.ModuleFederationPlugin({
  // ...
  shared: {
    react: {
      ...Repack.Federated.SHARED_REACT,
      // additional options
    }
  }
});
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `eager` | `boolean` |
| `singleton` | `boolean` |

#### Defined in

[packages/repack/src/webpack/federated.ts:38](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/federated.ts#L38)
