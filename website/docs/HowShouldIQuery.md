---
id: how-should-i-query
title: How Should I Query?
---

## Priority

Whatever you do, try to make your tests resemble real use cases. You'll only be confident with your tests if they work the way your users do. With that in mind, we recommend this order of priority:

1. **Queries Users Can Interact With**
   - [`getByLabelText`](api-queries#bya11ylabel-byaccessibilitylabel-bylabeltext): Your disabled users are counting on you, so this should likely be everywhere for their sake 😉 use it often, and if you aren't, maybe ask yourself why.
   - [`getByHintText`](api-queries#bya11yhint-byaccessibilityhint-byhinttext): You should probably have an accessibility label that you can select by, but if for some reason you set this instead, it's safe to use.
   - [`getByPlaceholderText`](api-queries#byplaceholdertext): Great for targeting a `TextInput` element to verify its content.
   - [`getByText`](api-queries#bytext): Great for finding a `Text`, `Button`, or `Touchable` node. You'll probably use this one a lot.
   - [`getByDisplayValue`](api-queries#bydisplayvalue): This is good because a user can see the value they type into a `TextInput` or whether a `Switch` is on or off.
2. **Queries Users Can Infer**
   - [`getByRole`](api-queries#bya11yrole-byaccessibilityrole-byrole): If your app screens have good hierarchy, this may be a decent option for finding your elements.
3. **Queries Users Don't Even Know About**
   - [`getByTestId`](api-queries#bytestid): The user cannot see (or hear) these, so this is only recommended for cases where you can't match by text or it doesn't make sense
