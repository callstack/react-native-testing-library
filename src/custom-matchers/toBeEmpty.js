// @flow

function isEmpty(instance: ReactTestInstance) {
  if (instance.props.children instanceof Array) {
    if (instance.props.children.length === 0) {
      return true;
    }

    return instance.props.children.every(isEmpty);
  }

  if (instance.props.children instanceof Object) {
    return isEmpty(instance.props.children);
  }

  return (
    instance.props.children === '' ||
    instance.props.children === undefined ||
    instance.props.children === null
  );
}

export function toBeEmpty(node: ReactTestInstance) {
  return {
    pass: isEmpty(node),
    message: () => `Expected node ${isEmpty ? 'not ' : ''}to be empty`,
  };
}
