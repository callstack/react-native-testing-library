import { actions } from '../actions/todoActions.js';

export default function todoReducer(state = [], action) {
  switch (action.type) {
    case actions.ADD:
      return state.concat(action.payload);

    case actions.REMOVE:
      return state.filter((todo) => todo.id !== action.payload.id);

    case actions.MODIFY:
      return state.map((todo) => {
        if (todo.id === action.payload.id) {
          return {
            ...todo,
            ...action.payload,
          };
        }
      });

    case actions.CLEAR:
      return [];

    default:
      return state;
  }
}
