# Native Event Propagation

In React Native, some events **bubble** up to parent elements and others are **direct**, meaning only the element that emitted them receives them. `fireEvent` should behave the same way.

Today, `fireEvent` treats only some of the direct events below as direct. The rest still bubble (see [Known gaps](#known-gaps)). The rules live in `isDirectEvent()` in `src/events/propagation.ts`.

## Which events are which

There is no simple rule for which events bubble. Coming from user input doesn't make an event bubble: `scroll` and `refresh` start with a user gesture but are direct. Check the lists below rather than guessing.

**Bubbling:** `press`, `change`, `focus`, `blur`, `submitEditing`, `endEditing`, `keyPress`, and touch and pointer events (`touchStart`, `pointerDown`, etc.).

**Direct:**

| Component        | Direct events                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------- |
| All components   | `layout`, accessibility actions                                                          |
| `ScrollView`     | `scroll`, `scrollBeginDrag`, `scrollEndDrag`, `momentumScrollBegin`, `momentumScrollEnd` |
| `TextInput`      | `scroll`, `selectionChange`, `contentSizeChange`                                         |
| `Text`           | `textLayout`                                                                             |
| `Image`          | `loadStart`, `progress`, `load`, `error`, `loadEnd`                                      |
| `Modal`          | `requestClose`, `show`, `dismiss`, `orientationChange`                                   |
| `RefreshControl` | `refresh`                                                                                |

This is simplified. A few events differ between iOS and Android. Check the sources below for the exact details.

## Known gaps

`fireEvent` treats these events as direct, based on the host element type (see `isDirectEvent()`):

- `layout` on all elements
- `ScrollView`: `scrollBeginDrag`, `scrollEndDrag`, `momentumScrollBegin`, `momentumScrollEnd`, `contentSizeChange`
- `TextInput`: `selectionChange`, `contentSizeChange`
- `Text`: `textLayout`
- `Image`: `loadStart`, `progress`, `load`, `error`, `loadEnd`

A direct event fired on its emitting element only checks that element. Fired on a nested element, it bubbles as usual but stops at the first ancestor that emits it, as React Native never delivers it there from a child. Handlers with the same name elsewhere, like an `onLoad` prop of a custom composite component, still receive bubbled events.

These were chosen because tests rarely fire them on a nested element: `TextInput` and `Image` have no children, `Text` queries usually match the `Text` that owns the handler, and the drag and momentum events are usually fired on the `ScrollView` itself.

The other direct events in the table above still bubble in `fireEvent`: `scroll`, accessibility actions, `Modal` events, and `refresh`. Changing them is a breaking change, as tests fire them on nested elements, e.g. `scroll` on `ScrollView` content. Leave these for a major release.

## Sources

The table is based on `react-native@0.88.0-rc.1`. Re-check it after React Native upgrades. In `node_modules/react-native`:

- Events shared by all components: `Libraries/NativeComponent/BaseViewConfig.{ios,android}.js`
- Component-specific events: each component's `*NativeComponent.js` or `*ViewConfig.js` file
- Newer components: `src/private/components/*/specs/`, where `DirectEventHandler` and `BubblingEventHandler` prop types mark each event
