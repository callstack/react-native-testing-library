---
id: user-event
title: User Event
---

### Table of contents

- [`userEvent.setup`](#usereventsetup)
  - [Options](#options)


## `userEvent.setup`

```ts
userEvent.setup(options?: {
  delay: number;
  advanceTimers: (delay: number) => Promise<void> | void;
})
```

Example
```ts
const user = userEvent.setup();
```

Creates User Event instances which can be used to trigger events.

### Options
- `delay` - controls the default delay between subsequent events, e.g. keystrokes, etc.
- `advanceTimers` - time advancement utility function that should be used for fake timers. The default setup handles both real and Jest fake timers.
