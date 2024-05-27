# State Management

The basic idea about testing state management solution is to include them in your test. Instead of mocking you state management, you rather want your high level components (screens, flows) use the same state management as used during running your app in production.

There are a few basic concepts with state management:

1. Use your real state management, do not mock it (at least the local part).
2. Have ability to set it to different initial values.
