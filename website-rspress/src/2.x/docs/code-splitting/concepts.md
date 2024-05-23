# Concepts

Code Splitting is a technique that splits the code into multiple files, which can be loaded on
demand and in parallel.

It can be used to:

- Optimize the initial size of the application and to improve the startup performance by deferring
the parsing (only with JSC) and execution (JSC and Hermes) of the non-critical code.
- Dynamically deliver content and features to the users based on runtime factors: user's role,
subscription plan, preferences etc.
- __For developers and companies__: split and isolate pieces of the product to improve scalability
and reduce coupling.

Code Splitting is one of the most important features in Re.Pack, and it's based on Webpack's
infrastructure as well as the native module
that allows to execute the additional code on the same JavaScript context (same React Native
instance).

:::info

For dynamic feature delivery, Code Splitting should be used as a mean to optimize the user
experience by deferring the features or deliver a existing features only to a subset of users.

:::

Code Splitting with Re.Pack is not designed to add new features dynamically without doing the
regular App Store or Play store release. It can be used to deliver fixes or tweaks to additional
(split) code, similarly to Code Push, but you should not add new features with it.

:::caution

Using Code Splitting to deliver new features without a regular App Store release is likely
going to violate Apple's App Store Terms and your application might be rejected or banned.

:::

:::tip

You should provide access to all the features for the App Store review process. 

Also, it might be beneficial to highlight that all split features are closely integrated with
application and cannot work in isolation - you don't want to introduce confusion that your
application might compete with Apple's App Store.

On that note, you might want to avoid using terms like _mini-app_ or _mini-app store_ in favour of
_modules_, _components_, _plugins_ or simply _features_.

:::
