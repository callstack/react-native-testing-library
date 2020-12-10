import * as React from 'react';
import { Button, StyleSheet, Text, View, TextInput } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addTodo } from '../actions/todoActions';

export function AddTodo(props) {
  const [text, setText] = React.useState('');

  const submitForm = () => {
    const todo = {
      id: props.todoLength + 1,
      text,
      date: new Date(),
    };

    props.addTodo(todo);
    setText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter a text below to add a new todo</Text>
      <TextInput
        autoFocus
        value={text}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={submitForm}
        onChangeText={(t) => setText(t)}
        placeholder="Enter the name of the repository here"
      />

      <Button onPress={submitForm} title="Submit form" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 156,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 2,
    marginBottom: 16,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderColor: '#DDDDDD',
    borderWidth: 1,
    paddingVertical: 8,
    width: '100%',
    textAlign: 'center',
    borderRadius: 4,
  },
});

const mapStateToProps = ({ todos }) => ({
  todoLength: todos.length,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ addTodo }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AddTodo);
