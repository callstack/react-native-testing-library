/// <reference path="./extend-expect.d.ts" />

import { toBeOnTheScreen } from './to-be-on-the-screen';

expect.extend({
  toBeOnTheScreen,
});
