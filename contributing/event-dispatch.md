# Event Dispatch: `fireEvent` vs `userEvent`

RNTL has two ways to trigger events. Neither goes through React Native's native event system. Both find `on*` props in the rendered tree and call them inside `act()`.

Both are built on the shared event subsystem in `src/events/`:

| File                                        | Contents                                                                                             |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `handler.ts`                                | Finding the `on*` handler for an event name in props                                                 |
| `propagation.ts`                            | Bubbling vs direct events, walking up host and composite elements                                    |
| `is-enabled.ts`                             | Whether a device would deliver the event: `pointerEvents`, `editable`, touch responders              |
| `dispatch.ts`                               | `dispatchEvent()` (own handler only) and `propagateEvent()` (`fireEvent` rules), both run in `act()` |
| `builders/`                                 | Event payloads, matching what React Native sends on a device                                         |
| `native-state.ts`, `update-native-state.ts` | [Native state](native-state.md) and how `fireEvent` updates it                                       |

`src/user-event/` is a separate module on top of `src/events/` and imports it only through `src/events/index.ts`.

## `fireEvent`

`src/fire-event.ts` is the public API. It calls a single handler for a single event using `propagateEvent()`. The work is in finding the right handler:

- It starts at the target and moves up the tree until it finds a handler. It also checks props of composite components, not only host elements.
- Direct events (see [Native event propagation](native-events.md)) only check the target.
- It mimics cases where a device would not deliver the event, like `pointerEvents`, a non-editable `TextInput`, or a touch responder that declines.

## `userEvent`

`src/user-event/` simulates a whole interaction (press, type, scroll, …) as a realistic sequence of events with delays between them. The sequences are based on how React Native behaves on real devices.

Each step uses `dispatchEvent()`, which only calls the target's own handler. It doesn't bubble or check whether the element is enabled. Each action does those checks itself, so the rules for an interaction live in one place.

## Guidelines

- To change which handler gets a single event, change `fireEvent`. To make an interaction more realistic, change the `userEvent` action.
- Keep `dispatchEvent()` simple.
- Put rules that both need, like `pointerEvents` or `editable`, in `src/events/`. Code used only by `userEvent`, like delays and scroll steps, stays in `src/user-event/`.
- Event sequences should match a real device. Check on a device before changing one, and keep the code comments explaining the observed behavior.
