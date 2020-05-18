---
id: migration20
title: Migration to 2.0
---

This guides describes major steps involved in migrating your testing code from using React Native Testing Library version `1.x` to version `2.0`.

## Removed global `debug` function

Global debug function has been removed in favor of `debug()` method returned from `render()` function.

## Some `byTestId` queries behavior changes
