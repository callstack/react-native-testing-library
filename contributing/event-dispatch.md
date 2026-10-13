# Event Dispatch: `fireEvent` vs `userEvent`

RNTL has two ways to trigger events. Neither goes through React Native's native event system. Both find `on*` props in the rendered tree and call them inside `act()`.

Both are built on the shared event subsystem in `src/events/legacy/`, which also holds `fireEvent` itself. This is the `'legacy'` event system, the default for the `unstable_eventSystem` config option. A `'modern'` event system that follows React Native's event dispatch is in progress.

The files in `src/events/legacy/`:

| File             | Contents                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| `fire-event.ts`  | Public `fireEvent` API                                                                                    |
| `propagation.ts` | Bubbling vs direct events, walking up host and composite elements                                         |
| `is-enabled.ts`  | Whether a device would deliver the event: `pointerEvents`, `editable`, touch responders                   |
| `warnings.ts`    | `eventDiagnostics` warnings for `fireEvent`                                                               |
| `builders/`      | Legacy event objects: `wrapNativeEvent()` (stubs from `baseSyntheticEvent()`), touch and responder events |

Code used by both event systems lives in `src/events/shared/`: `handler.ts` (finding the `on*` handler for an event name in props), `native-state.ts` and `update-native-state.ts` ([native state](native-state.md) and how `fireEvent` updates it), `payloads.ts` (`nativeEvent` payloads matching what React Native sends on a device), `merge.ts` (deep merging custom props into them), `pointer-events.ts` (whether `pointerEvents` lets an element be the target of touches), `warnings.ts` (formatting and logging `eventDiagnostics` warnings, used by legacy `fireEvent` and `userEvent`), and `types.ts`.

In the modern event system, `src/events/modern/pressability.ts` calls the `onPress`, `onPressIn`, `onPressOut` or `onLongPress` callback of the element that becomes the touch responder, reading `Pressable` and `Touchable*` callbacks from Pressability's `testOnly_pressabilityConfig()`. These callbacks aren't native events, so modern `fireEvent` sends the event types in `PRESSABILITY_EVENT_TYPES` (`src/events/modern/event-types.ts`) there instead of to `dispatchEvent()`: `fireEvent.press()`, and `fireEvent()` with `press`, `pressIn`, `pressOut` or `longPress`. `dispatchEvent()` still dispatches the native `press` event, which reaches only host `onPress` props.

Modern `fireEvent` doesn't log `eventDiagnostics` warnings yet. Only legacy `fireEvent` and `userEvent` do.

`src/user-event/` is a separate module on top of the event subsystem. It creates and dispatches native events through the facades `src/events/create-event.ts` and `src/events/dispatch-event.ts`. For a legacy event object, `dispatchEvent()` calls the target's own handler with `invokeEventHandler()` from `src/events/shared/invoke-event-handler.ts`. Other modules are imported directly: legacy touch and responder event builders from `src/events/legacy/builders/common.ts`, and `src/events/modern/` and `src/events/shared/` modules, e.g. `src/user-event/modern/press.ts` (hit testing and responder negotiation from `pressability.ts`, handler lookup from `handler.ts`) and `src/user-event/utils/` (`invokeEventHandler()`, the `SyntheticEvent` type and the warning helpers from `warnings.ts`).

## `fireEvent`

`src/events/legacy/fire-event.ts` is the public API. It calls a single handler for a single event, found with `findEventHandler()` from `src/events/legacy/propagation.ts`. The work is in finding the right handler:

- It starts at the target and moves up the tree until it finds a handler. It also checks props of composite components, not only host elements.
- Direct events (see [Native event propagation](native-events.md)) still bubble, with a warning when they reach an ancestor that emits them. `fireEvent.layout()` only checks the target.
- It mimics cases where a device would not deliver the event, like `pointerEvents`, a non-editable `TextInput`, or a touch responder that declines.

## `userEvent`

`src/user-event/` simulates a whole interaction (press, type, scroll, …) as a realistic sequence of events with delays between them. The sequences are based on how React Native behaves on real devices.

Each step dispatches a native event, created for the configured event system by `createEvent()` (`src/events/create-event.ts`: a legacy event object or a `SyntheticEvent`) and dispatched by `dispatchEvent()` (`src/events/dispatch-event.ts`), or calls a JavaScript callback (`changeText`, `pressIn`, ...) with `invokeEventHandler()`, which only calls the target's own handler. Modern `fireEvent.changeText()` instead calls `onChangeText` from the `change` dispatch, through `dispatchEvent()`'s `afterTargetHandler` option, right after the input's own `onChange`, where `TextInput` calls it. Neither checks whether the element is enabled. Each action does those checks itself, so the rules for an interaction live in one place.

Where the two event systems need different rules, the action picks them by `getConfig().unstable_eventSystem` from `src/user-event/legacy/` or `src/user-event/modern/`, e.g. for `press()` and `longPress()`. Legacy `findPressTarget()` finds the element, then the action calls `onResponderGrant` and `onResponderRelease` of a touch responder, so Pressability runs with its timers, or the `onPress*` props of a host, with stub touch events. Modern `emitPressEvents()` reuses modern `fireEvent`'s hit testing and responder negotiation (`getTouchPath()` and `findResponder()` in `src/events/modern/pressability.ts`), so both press the same element. It keeps the press on a `TextInput`, which claims the touch on a device even without `onPress*` props; the legacy one passes it on to the nearest ancestor that handles it. It then calls the responder's Pressability callbacks itself, in Pressability's order, with `SyntheticEvent`s (`dispatchPressabilityEvent()`): `onPressIn`, `onLongPress` for `longPress()`, `onPressOut`, then `onPress` unless `onLongPress` was called. The action, not the touch duration, decides whether it is a long press, so neither action waits by default: `duration` only holds the touch, for timers in the component. Pressability's timing props (`delayLongPress`, `minPressDuration`, `delayPressIn`, `delayPressOut`) are ignored.

For the `eventDiagnostics` warning, each action tracks itself with an `Interaction` from `src/user-event/utils/interaction.ts`:

- Dispatch native events with `interaction.dispatchEvent(eventType, buildFocusEvent())`, using the `build*Event()` helpers from `src/events/create-event.ts`, and call JavaScript callbacks with `interaction.invokeEventHandler(eventType, ...params)` (or `interaction.dispatchTouchEvent()` for `pressIn`, `pressOut`, `longPress` and `press`, which passes a touch event), so it records whether any handler ran. Events go to `interaction.target`, which is the element the action was called with, unless the action moves it (as `press()` does when an ancestor handles the press). If the action has to call a handler itself, record it with `interaction.recordEvent()` (as `pullToRefresh()` does for `onRefresh` on the `refreshControl` prop).
- Set `hasUpdatedNativeState` when the action writes to `nativeState`.
- Add elements that could handle the action but don't accept it to `skippedTargets`: disabled, blocked by `pointerEvents`, or with a responder that declines the touch. The warning first reports the ones blocked by `pointerEvents`, with the element that blocks them (`getPointerEventsBlocker()`). Otherwise it reports the disabled ones (`computeAriaDisabled()`, which includes non-editable `TextInput`; when all of them are non-editable `TextInput`, the message calls them non-editable, see `formatDisabledTargets()`), and skips the warning if every skipped element has a responder that declines the touch. Text actions (`type()`, `clear()`, `paste()`) add the `TextInput` when it is non-editable or blocked by `pointerEvents`. In the modern event system, `press()` doesn't skip a non-editable `TextInput`: as on iOS, it calls its press callbacks, since `editable={false}` only stops it from focusing. On Android, a non-editable `TextInput` is never the touch target, so the touch goes to its ancestors; RNTL doesn't model this. Legacy `press()` skips it.
- Call `warnAboutUnhandledInteraction()` from `src/user-event/utils/warnings.ts` at the end. It warns only if no handler ran and native state didn't change.

## Guidelines

- To change which handler gets a single event, change `fireEvent`. To make an interaction more realistic, change the `userEvent` action.
- Keep `dispatchEvent()` simple.
- Put event rules that both need, like the `pointerEvents` and `editable` checks, in `src/events/legacy/`. They may build on general helpers from `src/helpers/` (for example `isEditableTextInput`). Code used only by `userEvent`, like delays and scroll steps, stays in `src/user-event/`.
- Event sequences should match a real device. Check on a device before changing one, and keep the code comments explaining the observed behavior.
