export function baseSyntheticEvent() {
  return {
    currentTarget: {},
    target: {},
    preventDefault: () => {},
    stopPropagation: () => {},
    persist: () => {},
  };
}
