# Basic RNTL setup

This example is shows a basic modern React Native Testing Library setup in a template Expo app.

The app and related tests written in TypeScript, and it uses recommended practices like:

- testing large pieces of application instead of small components
- using `screen`-based queries
- using recommended query types, e.g. `*ByText`, `*ByLabelText`, `*ByPlaceholderText` over `byTestId`

You also use this repository as a reference when having issues in your RNTL configuration, as it contains the recommended Jest setup.
