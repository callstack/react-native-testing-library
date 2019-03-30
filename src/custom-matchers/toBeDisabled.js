// @flow

export function toBeDisabled(node: ReactTestInstance) {
  const isDisabled = node.props.disabled === true;

  return {
    pass: isDisabled,
    message: () => `Expected node ${isDisabled ? "not " : ""}to be disabled`
  };
}
