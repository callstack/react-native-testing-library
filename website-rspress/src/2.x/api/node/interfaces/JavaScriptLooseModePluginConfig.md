# Interface: JavaScriptLooseModePluginConfig

[JavaScriptLooseModePlugin](../classes/JavaScriptLooseModePlugin.md) configuration options.

## Table of contents

### Properties

- [exclude](./JavaScriptLooseModePluginConfig.md#exclude)
- [include](./JavaScriptLooseModePluginConfig.md#include)
- [test](./JavaScriptLooseModePluginConfig.md#test)

## Properties

### exclude

• **exclude**: [`Rule`](../types/Rule.md) \| [`Rule`](../types/Rule.md)[]

Exclude all modules that mach the rule from being converted to loose mode.

#### Defined in

[packages/repack/src/webpack/plugins/JavaScriptLooseModePlugin.ts:13](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/JavaScriptLooseModePlugin.ts#L13)

___

### include

• **include**: [`Rule`](../types/Rule.md) \| [`Rule`](../types/Rule.md)[]

Convert to loose mode only those modules that match the rule.

#### Defined in

[packages/repack/src/webpack/plugins/JavaScriptLooseModePlugin.ts:11](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/JavaScriptLooseModePlugin.ts#L11)

___

### test

• **test**: [`Rule`](../types/Rule.md) \| [`Rule`](../types/Rule.md)[]

Covert to loose mode all modules that match the rule.

#### Defined in

[packages/repack/src/webpack/plugins/JavaScriptLooseModePlugin.ts:9](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/JavaScriptLooseModePlugin.ts#L9)
