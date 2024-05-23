# Interface: InputStackFrame

React Native stack frame used as input when processing by [Symbolicator](../classes/Symbolicator.md).

## Hierarchy

- [`ReactNativeStackFrame`](./ReactNativeStackFrame.md)

  ↳ **`InputStackFrame`**

  ↳↳ [`StackFrame`](./StackFrame.md)

## Table of contents

### Properties

- [column](./InputStackFrame.md#column)
- [file](./InputStackFrame.md#file)
- [lineNumber](./InputStackFrame.md#linenumber)
- [methodName](./InputStackFrame.md#methodname)

## Properties

### column

• **column**: ``null`` \| `number`

#### Inherited from

[ReactNativeStackFrame](./ReactNativeStackFrame.md).[column](./ReactNativeStackFrame.md#column)

#### Defined in

[packages/repack/src/server/Symbolicator.ts:16](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/Symbolicator.ts#L16)

___

### file

• **file**: `string`

#### Overrides

[ReactNativeStackFrame](./ReactNativeStackFrame.md).[file](./ReactNativeStackFrame.md#file)

#### Defined in

[packages/repack/src/server/Symbolicator.ts:25](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/Symbolicator.ts#L25)

___

### lineNumber

• **lineNumber**: ``null`` \| `number`

#### Inherited from

[ReactNativeStackFrame](./ReactNativeStackFrame.md).[lineNumber](./ReactNativeStackFrame.md#linenumber)

#### Defined in

[packages/repack/src/server/Symbolicator.ts:15](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/Symbolicator.ts#L15)

___

### methodName

• **methodName**: `string`

#### Inherited from

[ReactNativeStackFrame](./ReactNativeStackFrame.md).[methodName](./ReactNativeStackFrame.md#methodname)

#### Defined in

[packages/repack/src/server/Symbolicator.ts:18](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/server/Symbolicator.ts#L18)
