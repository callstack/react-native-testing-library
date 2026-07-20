import 'react-native-get-random-values';

import { nanoid } from 'nanoid';
import * as React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useTaskStore } from './state';

export function TaskList() {
  const tasks = useTaskStore((state) => state.tasks);
  const newTaskTitle = useTaskStore((state) => state.newTaskTitle);
  const setNewTaskTitle = useTaskStore((state) => state.setNewTaskTitle);
  const addTask = useTaskStore((state) => state.addTask);

  const handleAddTask = () => {
    addTask({
      id: nanoid(),
      title: newTaskTitle,
    });
  };

  return (
    <View style={styles.container}>
      {tasks.map((task) => (
        <Text key={task.id} testID="task-item">
          {task.title}
        </Text>
      ))}

      {!tasks.length ? <Text>No tasks, start by adding one...</Text> : null}

      <TextInput
        aria-label="New Task"
        placeholder="New Task..."
        value={newTaskTitle}
        onChangeText={(text) => setNewTaskTitle(text)}
      />

      <Pressable role="button" onPress={handleAddTask}>
        <Text>Add Task</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
