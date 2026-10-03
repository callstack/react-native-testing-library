# Native Event Propagation

React Native declares, for each native (host) component, which events **bubble** up the tree and which are **direct**, meaning they are delivered only to the element that emitted them. Use this reference when deciding whether an event helper should look for handlers on ancestor elements.

## How to read this

- Native event names use a `top` prefix that maps to the `on*` prop: `topLayout` → `onLayout`. The tables below use the short name (`layout`).
- Every host component inherits the **base view config** events and adds its own component-specific events on top of them.
- `fireEvent` walks up the tree to find a handler, which matches bubbling events. Direct events should go through `fireDirectEvent` in `src/fire-event.ts`, which invokes only the target element's handler. Today only `fireEvent.layout` uses it.
- Snapshot taken from `react-native@0.88.0-rc.1`. See [Sources](#sources) to re-check after RN upgrades.

## Base view config (all host components)

| Kind     | iOS                                                                                                                                                        | Android                                                                                                                                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bubbling | `press`, `click`, `change`, `focus`, `blur`, `submitEditing`, `endEditing`, `keyPress`, `touchStart`, `touchMove`, `touchEnd`, `touchCancel`, `pointer*`\* | `click`, `change`, `select`, `focus`, `blur`, `keyDown`, `keyUp`, `touchStart`, `touchMove`, `touchEnd`, `touchCancel`, `pointer*`\*                                                                                          |
| Direct   | `layout`, `accessibilityAction`, `accessibilityTap`, `magicTap`, `accessibilityEscape`                                                                     | `layout`, `accessibilityAction`, `scroll`, `scrollBeginDrag`, `scrollEndDrag`, `momentumScrollBegin`, `momentumScrollEnd`, `contentSizeChange`, `selectionChange`, `message`, `loadingStart`, `loadingFinish`, `loadingError` |

\* `pointer*` = `pointerDown`, `pointerMove`, `pointerUp`, `pointerCancel`, `pointerEnter`, `pointerLeave`, `pointerOver`, `pointerOut`, `gotPointerCapture`, `lostPointerCapture`.

Both platforms also register `onGestureHandlerEvent` and `onGestureHandlerStateChange` as direct events for React Native Gesture Handler.

## Component-specific events

Events listed here are added on top of the base view config. "Host name" is the native `uiViewClassName` (or codegen component name).

| Component                          | Host name                                                 | Bubbling                                                                                                     | Direct                                                                                                           |
| ---------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `View`, `Pressable`, etc.          | `RCTView`                                                 | —                                                                                                            | —                                                                                                                |
| `Text`                             | `RCTText` (nested: `RCTVirtualText`, no extra events)     | —                                                                                                            | `textLayout`                                                                                                     |
| `TextInput` (iOS)                  | `RCTSinglelineTextInputView`, `RCTMultilineTextInputView` | `blur`, `change`, `endEditing`, `focus`, `keyPress`, `submitEditing`, `touchMove`, `touchEnd`, `touchCancel` | `scroll`, `selectionChange`, `contentSizeChange`, `changeSync`, `keyPressSync`                                   |
| `TextInput` (Android)              | `AndroidTextInput`                                        | `endEditing`, `keyPress`, `submitEditing`                                                                    | `scroll`                                                                                                         |
| `ScrollView`                       | `RCTScrollView`                                           | —                                                                                                            | `scroll`, `scrollBeginDrag`, `scrollEndDrag`, `momentumScrollBegin`, `momentumScrollEnd`; iOS also `scrollToTop` |
| `ScrollView` (horizontal, Android) | `AndroidHorizontalScrollView`                             | —                                                                                                            | — (scroll events come from the Android base config)                                                              |
| `Image`                            | `RCTImageView`                                            | —                                                                                                            | `loadStart`, `progress`, `error`, `load`, `loadEnd`; iOS also `partialLoad`                                      |
| `Switch` (iOS)                     | `Switch`                                                  | `change`                                                                                                     | —                                                                                                                |
| `Switch` (Android)                 | `AndroidSwitch`                                           | `change`                                                                                                     | —                                                                                                                |
| `Modal`                            | `ModalHostView`                                           | —                                                                                                            | `requestClose`, `show`, `dismiss`, `orientationChange`                                                           |
| `RefreshControl` (iOS)             | `PullToRefreshView`                                       | —                                                                                                            | `refresh`                                                                                                        |
| `RefreshControl` (Android)         | `AndroidSwipeRefreshLayout`                               | —                                                                                                            | `refresh`                                                                                                        |
| `DrawerLayoutAndroid`              | `AndroidDrawerLayout`                                     | —                                                                                                            | `drawerSlide`, `drawerStateChanged`, `drawerOpen`, `drawerClose`                                                 |

## Known gaps in RNTL

These events are direct in React Native but still bubble through `fireEvent`. Changing them is a breaking change for users who fire them on a child element:

- Scroll events: `scroll`, `scrollBeginDrag`, `scrollEndDrag`, `momentumScrollBegin`, `momentumScrollEnd`
- `contentSizeChange`, `selectionChange`, `textLayout`
- `Image` load events, `Modal` events, `refresh`

## Sources

All paths are relative to `node_modules/react-native`:

- Base config: `Libraries/NativeComponent/BaseViewConfig.ios.js`, `Libraries/NativeComponent/BaseViewConfig.android.js`
- Static view configs: `Libraries/Text/TextNativeComponent.js`, `Libraries/Image/ImageViewNativeComponent.js`, `Libraries/Components/ScrollView/*NativeComponent.js`, `Libraries/Components/TextInput/RCTTextInputViewConfig.js`, `Libraries/Components/TextInput/AndroidTextInputNativeComponent.js`
- Codegen specs (`DirectEventHandler` vs `BubblingEventHandler` prop types): `src/private/components/*/specs/*NativeComponent.js`
