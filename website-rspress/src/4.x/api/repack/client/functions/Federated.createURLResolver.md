# Function: createURLResolver

[Federated](../modules/Federated.md).createURLResolver

▸ **createURLResolver**(`config`): [`URLResolver`](../types/Federated.URLResolver.md)

Creates URL resolver for Module Federation from provided config.

**`example`**
```ts
import { ScriptManager, Script, Federated } from '@callstack/repack/client';

const resolveURL = Federated.createURLResolver({
  containers: {
    app1: 'http://localhost:9001/[name][ext]',
    app2: 'http://localhost:9002/[name].container.js',
  },
  chunks: {
    app2: 'http://localhost:9002/chunks/[name][ext]',
  },
});

ScriptManager.shared.addResolver(async (scriptId, caller) => {
  let url;
  if (caller === 'main') {
    url = __DEV__
      ? Script.getDevServerURL(scriptId)
      : Script.getRemoteURL(`http://localhost:9000/${scriptId}`);
  } else {
    url = resolveURL(scriptId, caller);
  }

  if (!url) {
    return undefined;
  }

  return {
    url,
    query: {
      platform: Platform.OS,
    },
  };
});
```

`createURLResolver` is a abstraction over [Script.getRemoteURL](../classes/Script.md#getremoteurl),
for example:
```ts
import { ScriptManager, Federated } from '@callstack/repack/client';

ScriptManager.shared.addResolver((scriptId, caller) => {
  const resolveURL = Federated.createURLResolver({
    containers: {
      app1: 'http://localhost:9000/[name][ext]',
    },
  });

  return {
    url: resolveURL(scriptId, caller);
  };
});
```
is equivalent to:
```ts
import { ScriptManager, Script } from '@callstack/repack/client';

ScriptManager.shared.addResolver(async (scriptId, caller) => {
  if (scriptId === 'app1') {
    return {
      url: 'http://localhost:9000/app1.container.bundle',
    };
  }

  if (caller === 'app1') {
    return {
      url: Script.getRemoteURL(`http://localhost:9000/${scriptId}`),
    };
  }
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`URLResolverConfig`](../interfaces/Federated.URLResolverConfig.md) | Configuration for the resolver. |

#### Returns

[`URLResolver`](../types/Federated.URLResolver.md)

A resolver function which will try to resolve URL based on given `scriptId` and `caller`.

#### Defined in

[packages/repack/src/modules/ScriptManager/federated.ts:180](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/federated.ts#L180)
