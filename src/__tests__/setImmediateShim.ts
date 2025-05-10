const globalObj = typeof window === 'undefined' ? global : window;
// @ts-expect-error
globalObj.setImmediate = function(fn: () => void) {
  return globalObj.setTimeout(fn, 0);
}