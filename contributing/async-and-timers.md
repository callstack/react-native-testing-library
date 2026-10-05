# Async, `act` and Timers

RNTL's API is async: `render`, `fireEvent`, `userEvent` and `waitFor` all return promises. They need to work with React's `act()` and with both real and fake Jest timers.

## Key concepts

- **`act` environment.** React only checks for `act()` when the global `IS_REACT_ACT_ENVIRONMENT` is true. RNTL wraps every React update in its own `act()` (`src/act.ts`), which also turns this flag on.
- **`wrapAsync`.** Code that waits on time instead of React updates, like `waitFor` and `userEvent`, runs with the flag turned off so React doesn't warn. React updates inside it still use `act()`. See `src/helpers/wrap-async.ts`.
- **Fake timer detection.** `src/helpers/timers.ts` checks whether Jest fake timers (legacy or modern) are on each time it's needed, so tests can switch timers. RNTL saves the real timer functions when it loads and uses them for its own waiting.
- **`waitFor`.** Adapted from DOM Testing Library. With fake timers, it moves fake time forward itself between checks. With real timers, it polls.
- **`userEvent` delays.** Waits between steps go through `wait()` in `src/user-event/utils/wait.ts`. It moves fake timers forward when they're on, so actions like `longPress` work with either kind of timer.
- **Cleanup.** `render` and `waitFor` add themselves to a cleanup queue (`src/cleanup.ts`). The default entry point runs `cleanup()` after each test.

## Guidelines

- Wrap every new React update in RNTL's `act()`. Run code that waits on time through `wrapAsync()`.
- Use the timer functions from `src/helpers/timers.ts`, not the global `setTimeout` and `setImmediate`, which may be faked.
- Test timing changes with real timers, legacy fake timers, and modern fake timers.
- Much of this code comes from React Testing Library and DOM Testing Library. Check how they handle a problem before solving it differently.
