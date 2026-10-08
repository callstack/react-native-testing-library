# Event Dispatch: `fireEvent` vs `userEvent`

RNTL has two ways to trigger events. Neither goes through React Native's native event system. Both find `on*` props in the rendered tree and call them inside `act()`.

Both are built on the shared event subsystem in `src/events/legacy/`, which also holds `fireEvent` itself. This is the `'legacy'` event system, the default for the `eventSystem` config option. A `'modern'` event system that follows React Native's event dispatch is in progress.

The files in `src/events/legacy/`:

| File                                        | Contents                                                                                |
| ------------------------------------------- | --------------------------------------------------------------------------------------- |
| `fire-event.ts`                             | Public `fireEvent` API                                                                  |
| `propagation.ts`                            | Bubbling vs direct events, walking up host and composite elements                       |
| `is-enabled.ts`                             | Whether a device would deliver the event: `pointerEvents`, `editable`, touch responders |
| `dispatch.ts`                               | `dispatchEvent()`: calls the target's own handler in `act()`, used by `userEvent`       |
| `warnings.ts`                               | `eventDiagnostics` warnings for `fireEvent`, and helpers shared with `userEvent`        |
| `builders/`                                 | Event payloads, matching what React Native sends on a device                            |
| `native-state.ts`, `update-native-state.ts` | [Native state](native-state.md) and how `fireEvent` updates it                          |

Code used by both event systems lives in `src/events/shared/`: `handler.ts` (finding the `on*` handler for an event name in props) and `types.ts`.

`src/user-event/` is a separate module on top of `src/events/legacy/` and imports it only through `src/events/legacy/index.ts`, which also re-exports `src/events/shared/handler.ts`.

## `fireEvent`

`src/events/legacy/fire-event.ts` is the public API. It calls a single handler for a single event, found with `findEventHandler()` from `src/events/legacy/propagation.ts`. The work is in finding the right handler:

- It starts at the target and moves up the tree until it finds a handler. It also checks props of composite components, not only host elements.
- Direct events (see [Native event propagation](native-events.md)) still bubble, with a warning when they reach an ancestor that emits them. `fireEvent.layout()` only checks the target.
- It mimics cases where a device would not deliver the event, like `pointerEvents`, a non-editable `TextInput`, or a touch responder that declines.

## `userEvent`

`src/user-event/` simulates a whole interaction (press, type, scroll, …) as a realistic sequence of events with delays between them. The sequences are based on how React Native behaves on real devices.

Each step uses `dispatchEvent()`, which only calls the target's own handler. It doesn't bubble or check whether the element is enabled. Each action does those checks itself, so the rules for an interaction live in one place.

For the `eventDiagnostics` warning, each action tracks itself with an `Interaction` from `src/user-event/utils/interaction.ts`:

- Dispatch events with `interaction.dispatchEvent()`, so it records whether any handler ran. Events go to `interaction.target`, which is the element the action was called with, unless the action moves it (as `press()` does when an ancestor handles the press). If the action has to call a handler itself, record it with `interaction.recordEvent()` (as `pullToRefresh()` does for `onRefresh` on the `refreshControl` prop).
- Set `hasUpdatedNativeState` when the action writes to `nativeState`.
- Add elements that could handle the action but don't accept it to `skippedTargets`: disabled, non-editable `TextInput`, blocked by `pointerEvents`, or with a responder that declines the touch. The warning first reports the ones blocked by `pointerEvents`, with the element that blocks them (`getPointerEventsBlocker()`). Otherwise it reports the disabled ones (`computeAriaDisabled()`, which includes non-editable `TextInput`; when all of them are non-editable `TextInput`, the message calls them non-editable, see `formatDisabledTargets()`), and skips the warning if every skipped element has a responder that declines the touch. Text actions (`type()`, `clear()`, `paste()`) add the `TextInput` when it is non-editable or blocked by `pointerEvents`.
- Call `warnAboutUnhandledInteraction()` from `src/user-event/utils/warnings.ts` at the end. It warns only if no handler ran and native state didn't change.

## Guidelines

- To change which handler gets a single event, change `fireEvent`. To make an interaction more realistic, change the `userEvent` action.
- Keep `dispatchEvent()` simple.
- Put event rules that both need, like the `pointerEvents` and `editable` checks, in `src/events/legacy/`. They may build on general helpers from `src/helpers/` (for example `isEditableTextInput`). Code used only by `userEvent`, like delays and scroll steps, stays in `src/user-event/`.
- Event sequences should match a real device. Check on a device before changing one, and keep the code comments explaining the observed behavior.
