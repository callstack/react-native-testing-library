# Interface: URLResolverConfig

[Federated](../modules/Federated.md).URLResolverConfig

Configuration options for [createURLResolver](../functions/Federated.createURLResolver.md) for Module Federation.
Allows to configure how created [URLResolver](../types/Federated.URLResolver.md) will behave.

## Table of contents

### Properties

- [chunks](./Federated.URLResolverConfig.md#chunks)
- [containers](./Federated.URLResolverConfig.md#containers)

## Properties

### chunks

• `Optional` **chunks**: `Record`<`string`, `string`\>

An optional Module Federation container names to URL templates mapping.

The key in the object is a container names and the value is a template
that will be used to resolve a __chunk__ URL for that container.

Specifying this property is useful if:
- containers have custom extension (different from `.container.bundle`)
- chunks have custom extensions (different from `.chunk.bundle`)
- chunks have different URL that containers

When this property is left unspecified, the template URLs are inferred from
`containers` property. The following:
```
{
  containers: {
    app1: 'http://localhost:9000/[name][ext]
    app2: 'http://localhost:9000/[name].js
  },
}
```
is equivalent to:
```ts
{
  containers: {
    app1: 'http://localhost:9000/[name][ext]',
    app2: 'http://localhost:9000/[name].js',
  },
  chunks: {
    app1: 'http://localhost:9000/[name][ext]',
    app2: 'http://localhost:9000/[name].js',
  },
}
```

Accepted template params:
- `[name]` - Container name
- `[ext]` - Chunk extension, eg: `.chunk.bundle`

**`example`**
```ts
{
  containers: {
    app1: 'http://localhost:9000/[name].container.js',
  },
  chunks: {
    app1: 'http://localhost:9000/chunks/[name][ext]',
  }
}
```

#### Defined in

[packages/repack/src/modules/ScriptManager/federated.ts:98](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/federated.ts#L98)

___

### containers

• **containers**: `Record`<`string`, `string`\>

A Module Federation container names to URL templates mapping.

The key in the object is a container name and the value is a template
that will be used to resolve a URL.

Accepted template params:
- `[name]` - Container name
- `[ext]` - Container extension, eg: `.container.bundle`

You can omit `[ext]`, if you're using custom extension, in which case, you should
provide extension explicitly. When using custom extension, it's recommended to
provide a URL template for chunks as well using `chunks` property.

**`example`**
```ts
{
  containers: {
    app1: 'http://localhost:9000/[name][ext]'
  }
}
```

#### Defined in

[packages/repack/src/modules/ScriptManager/federated.ts:45](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/federated.ts#L45)
