export const actions = {
  ADD: '@ADD_TODO',
  REMOVE: '@REMOVE_TODO',
  MODIFY: '@MODIFY_TODO',
  CLEAR: '@CLEAR_TODO',
};

export const addTodo = (todo) => ({
  type: actions.ADD,
  payload: todo,
});

export const removeTodo = (id) => ({
  type: actions.REMOVE,
  payload: { id },
});

export const modifyTodo = (todo) => ({
  type: actions.MODIFY,
  payload: todo,
});

export const clearTodos = () => ({
  type: actions.CLEAR,
});
