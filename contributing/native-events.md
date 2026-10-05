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
- `Text`: `textLayout`
- `TextInput`: `selectionChange`, `contentSizeChange`
- `Image`: `loadStart`, `progress`, `load`, `error`, `loadEnd`
- `ScrollView`: `scrollBeginDrag`, `scrollEndDrag`, `momentumScrollBegin`, `momentumScrollEnd`

A direct event fired on its emitting element only checks that element. Fired on a nested element, it bubbles as usual but stops at the first ancestor that emits it, as React Native never delivers it there from a child. Handlers with the same name elsewhere, like an `onLoad` prop of a custom composite component, still receive bubbled events.

These were chosen because tests rarely fire them on a nested element: `TextInput` and `Image` have no children, `Text` queries usually match the `Text` that owns the handler, and the drag and momentum events are usually fired on the `ScrollView` itself.

The other direct events still bubble for backward compatibility (see `isDeprecatedBubblingEvent()`), as tests fire them on nested elements, e.g. `scroll` on `ScrollView` content:

- `accessibilityAction` on all elements
- `TextInput`: `scroll`
- `ScrollView`: `scroll`, `refresh`, `contentSizeChange`
- `Modal`: `requestClose`, `show`, `dismiss`, `orientationChange`

`fireEvent` logs a warning when one of these events bubbles from a nested element to the handler of an ancestor that emits it, e.g. `scroll` from `ScrollView` content to the `ScrollView`'s `onScroll`. Only the type of the element with the handler is checked, so a handler further up on an element that doesn't emit the event gets no warning, although it will stop receiving the event too. In the next major release, move these events to the direct lists and remove the warning.

`refresh` is emitted by `RefreshControl`, but the Jest `ScrollView` mock doesn't render the `refreshControl` element. `FlatList` and `SectionList` pass `onRefresh` to the host `ScrollView`, so the rule uses `ScrollView` as the emitting element.

`contentSizeChange` is not a native `ScrollView` event, so the table above doesn't list it. The `ScrollView` component calls `onContentSizeChange` from the `onLayout` of its content view and passes `onContentSizeChange: null` to the host element. The Jest `ScrollView` mock passes the prop to the host element instead, so the rule uses `ScrollView` as the emitting element. `FlatList` and `SectionList` always set this handler, and tests fire the event on list items, so it bubbles with a warning instead of being direct.

## Sources

The table is based on `react-native@0.88.0-rc.1`. Re-check it after React Native upgrades. In `node_modules/react-native`:

- Events shared by all components: `Libraries/NativeComponent/BaseViewConfig.{ios,android}.js`
- Component-specific events: each component's `*NativeComponent.js` or `*ViewConfig.js` file
- Newer components: `src/private/components/*/specs/`, where `DirectEventHandler` and `BubblingEventHandler` prop types mark each event
