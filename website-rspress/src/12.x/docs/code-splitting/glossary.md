# Glossary of terms

## Bundle

A collection of processed (compiled, transformed) code, packed together into self-contained format
by a _Bundler_ (e.g: Webpack, Rollup, etc). It includes not only the processed source code, but all
the necessary dependencies and usually static assets.

## Main bundle

A special form of a [Bundle](#bundle), which is also self-executable (standalone).
Meaning executing the Main bundle inside a JavaScript Virtual Machine will run your application.

Also known as _Index bundle_.

## Chunk

A lighter version of a [Bundle](#bundle), designed to be pulled in and used together with the
[Main bundle](#main-bundle). A chunk is usually deferred and loaded on demand by the
[Main bundle](#main-bundle) or another chunk. Chunks can usually implicitly share and reuse
dependencies from each other and the [Main bundle](#main-bundle).

## Async chunk

A version of a [Chunk](#chunk), which is loaded in an asynchronous manner.
In context of React Native, all [Chunks](#chunk) are loaded asynchronously, so [Chunk](#chunk)
and Async chunk can be used interchangeably.

In plural form: Async chunks refer to a [Code Splitting approach](./usage#async-chunks).

## Local chunk

A [Chunk](#chunk) stored locally on a filesystem (of a mobile device), contrary to a [Remote chunk](#remote-chunk).

You can learn more about local chunks in the dedicated [Local vs remote chunks guide](./local-vs-remote-chunks).

## Remote chunk

A [Chunk](#chunk) stored remotely on the server, CDN or any other network location, contrary to a [Local chunk](#local-chunk).

You can learn more about remote chunks in the dedicated [Local vs remote chunks guide](./local-vs-remote-chunks).

## Script

Arbitrary file with executable code. Can be a [Bundle](#bundle) created by a _Bundler_ (e.g:
Webpack, Rollup, etc) or manually by hand.

## Container

A special form of [Bundle](#bundle), which is created in
[Module Federation setup](./usage#module-federation) and is used by the [Main bundle](#main-bundle).
Containers can also use other Containers and [Chunks](#chunk).
