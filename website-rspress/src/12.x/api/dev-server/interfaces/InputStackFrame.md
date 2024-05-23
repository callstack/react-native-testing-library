# Interface: InputStackFrame

React Native stack frame used as input when processing by {@link Symbolicator}.

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

[plugins/symbolicate/types.ts:6](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/plugins/symbolicate/types.ts#L6)

___

### file

• **file**: `string`

#### Overrides

[ReactNativeStackFrame](./ReactNativeStackFrame.md).[file](./ReactNativeStackFrame.md#file)

#### Defined in

[plugins/symbolicate/types.ts:15](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/plugins/symbolicate/types.ts#L15)

___

### lineNumber

• **lineNumber**: ``null`` \| `number`

#### Inherited from

[ReactNativeStackFrame](./ReactNativeStackFrame.md).[lineNumber](./ReactNativeStackFrame.md#linenumber)

#### Defined in

[plugins/symbolicate/types.ts:5](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/plugins/symbolicate/types.ts#L5)

___

### methodName

• **methodName**: `string`

#### Inherited from

[ReactNativeStackFrame](./ReactNativeStackFrame.md).[methodName](./ReactNativeStackFrame.md#methodname)

#### Defined in

[plugins/symbolicate/types.ts:8](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/plugins/symbolicate/types.ts#L8)
