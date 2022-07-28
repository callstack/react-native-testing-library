# Basic RNTL setup

This example is shows a basic modern React Native Testing Library setup in a template Expo app.

The app and related tests written in TypeScript, and it uses recommended practices like:

- testing large pieces of application instead of small components
- using `screen`-based queries
- using recommended query types, e.g. `byText`, `byLabelText`, `byPlaceholderText` over `byTestId`
