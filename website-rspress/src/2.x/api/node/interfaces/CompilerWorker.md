# Interface: CompilerWorker

Represents a process that runs Webpack compilation and [DevServer](../classes/DevServer.md)
via [DevServerPlugin](../classes/DevServerPlugin.md).

## Table of contents

### Properties

- [port](./CompilerWorker.md#port)
- [process](./CompilerWorker.md#process)

## Properties

### port

• **port**: `number`

Port on which [DevServer](../classes/DevServer.md) is running.

#### Defined in

[packages/repack/src/server/DevServerProxy.ts:36](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/DevServerProxy.ts#L36)

___

### process

• **process**: `ExecaChildProcess`<`string`\>

Spawned process with the Webpack compilation.

#### Defined in

[packages/repack/src/server/DevServerProxy.ts:34](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/DevServerProxy.ts#L34)
