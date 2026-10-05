# Event Dispatch: `fireEvent` vs `userEvent`

RNTL has two ways to trigger events. Neither goes through React Native's native event system. Both find `on*` props in the rendered tree and call them inside `act()`.

## `fireEvent`

`src/fire-event.ts` calls a single handler for a single event. The work is in finding the right handler:

- It starts at the target and moves up the tree until it finds a handler. It also checks props of composite components, not only host elements.
- Direct events (see [Native event propagation](native-events.md)) only check the target.
- It mimics cases where a device would not deliver the event, like `pointerEvents`, a non-editable `TextInput`, or a touch responder that declines.

## `userEvent`

`src/user-event/` simulates a whole interaction (press, type, scroll, …) as a realistic sequence of events with delays between them. The sequences are based on how React Native behaves on real devices.

Each step uses `dispatchEvent()`, which only calls the target's own handler. It doesn't bubble or check whether the element is enabled. Each action does those checks itself, so the rules for an interaction live in one place.

## Guidelines

- To change which handler gets a single event, change `fireEvent`. To make an interaction more realistic, change the `userEvent` action.
- Keep `dispatchEvent()` simple.
- Put rules that both need, like `pointerEvents` or `editable`, in shared helpers in `src/helpers/`.
- Event sequences should match a real device. Check on a device before changing one, and keep the code comments explaining the observed behavior.
