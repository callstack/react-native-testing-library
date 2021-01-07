import * as React from 'react';
import { FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removeTodo } from '../actions/todoActions';
import TodoElem from './TodoElem';

export function TodoList(props) {
  const onDeleteTodo = (id) => props.removeTodo(id);

  return (
    <FlatList
      data={props.todos}
      keyExtractor={(todo) => todo.id.toString()}
      renderItem={({ item }) => (
        <TodoElem todo={item} onDelete={onDeleteTodo} />
      )}
    />
  );
}

const mapStateToProps = (state) => ({
  todos: state.todos,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ removeTodo }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
