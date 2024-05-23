# Variable: SHARED\_REACT\_NATIVE

[Federated](../modules/Federated.md).SHARED_REACT_NATIVE

• `Const` **SHARED\_REACT\_NATIVE**: `Object`

Predefined options for shared `react-native` dependency.

**`example`** Basic example.
```js
import * as React from 'repack';

new Repack.plugins.ModuleFederationPlugin({
  // ...
  shared: {
    'react-native': Repack.Federated.SHARED_REACT,
  }
});
```

**`example`** Example with spread and additional options.
```js
import * as React from 'repack';

new Repack.plugins.ModuleFederationPlugin({
  // ...
  shared: {
    'react-native': {
      ...Repack.Federated.SHARED_REACT_NATIVE,
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

[packages/repack/src/webpack/federated.ts:73](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/federated.ts#L73)
