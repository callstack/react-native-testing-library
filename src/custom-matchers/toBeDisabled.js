// @flow

export function toBeDisabled(
  node: ReactTestInstance
): { message: () => string, pass: boolean } {
  const isDisabled = node.props.disabled === true;

  return {
    pass: isDisabled,
    message: () => `Expected node ${isDisabled ? 'not ' : ''}to be disabled`,
  };
}
