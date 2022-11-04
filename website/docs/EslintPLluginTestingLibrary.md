---
id: eslint-plugin-testing-library
title: ESLint Plugin Testing Library Compatibility
---

Most of the rules of the [eslint-plugin-testing-library](https://github.com/testing-library/eslint-plugin-testing-library) are compatible with this library except the following:

- [prefer-user-event](https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/prefer-user-event.md): `userEvent` requires a DOM environment so it is not compatible with this library

Also, some rules have become useless, unless maybe you're using an old version of the library:

- [prefer-wait-for](https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/prefer-wait-for.md): the wait utility is no longer available

- [no-wait-for-empty-callback](https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/no-wait-for-empty-callback.md): waitFor callback param is no longer optional

To get the rule [consistent-data-testid](https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/consistent-data-testid.md) to work, you need to configure it to check the testID attribute by adding the following in your eslint config file, the `testIdPattern` being whichever pattern you want to enforce:

```javascript
{
  "testing-library/consistent-data-testid": [
    2,
    {
      "testIdAttribute": ["testID"],
      "testIdPattern": "^TestId(__[A-Z]*)?$"
    }
  ]
}
```
