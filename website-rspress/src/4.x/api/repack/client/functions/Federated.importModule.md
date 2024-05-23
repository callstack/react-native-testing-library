# Function: importModule

[Federated](../modules/Federated.md).importModule

▸ **importModule**<`Exports`\>(`containerName`, `module`, `scope?`): `Promise`<`Exports`\>

Dynamically imports module from a Module Federation container. Similar to `import('file')`, but
specific to Module Federation. Calling `importModule` will create an async boundary.

Container will be evaluated only once. If you use `importModule` for the same container twice,
the container will be loaded and evaluated only on the first import.

Under the hood, `importModule` will call `ScriptManager.shared.loadScript(containerName)`.
This means, a resolver must be added with `ScriptManager.shared.addResolver(...)` beforehand and provided proper
resolution logic to resolve URL based on the `containerName`.

**`example`**
```ts
import * as React from 'react';
import { Federated } from '@callstack/repack/client';

const Button = React.lazy(() => Federated.importModule('my-components', './Button.js'));

const myUtil = await Federated.importModule('my-lib', './myUtil.js');
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Exports` | `any` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `containerName` | `string` | `undefined` | Name of the container - should be the same name provided to `webpack.container.ModuleFederationPlugin` in `library.name`. |
| `module` | `string` | `undefined` | Full name with extension of the module to import from the container - only modules exposed in `exposes` in `webpack.container.ModuleFederationPlugin` can be used. |
| `scope` | `string` | `'default'` | Optional, scope for sharing modules between containers. Defaults to `'default'`. |

#### Returns

`Promise`<`Exports`\>

Exports of given `module` from given container.

#### Defined in

[packages/repack/src/modules/ScriptManager/federated.ts:252](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/federated.ts#L252)
