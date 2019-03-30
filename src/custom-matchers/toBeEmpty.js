// @flow

export function toBeEmpty(node: ReactTestInstance) {
  const isEmpty = node.props.children === undefined;

  return {
    pass: isEmpty,
    message: () => `Expected node ${isEmpty ? "not " : ""}to be empty`
  };
}
