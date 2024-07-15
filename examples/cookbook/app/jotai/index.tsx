import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import * as React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useAtom } from 'jotai';
import { newTaskTitleAtom, tasksAtom } from './state';

export default function TaskList() {
  const [tasks, setTasks] = useAtom(tasksAtom);
  const [newTaskTitle, setNewTaskTitle] = useAtom(newTaskTitleAtom);

  const handleAddTask = () => {
    setTasks((tasks) => [
      ...tasks,
      {
        id: nanoid(),
        title: newTaskTitle,
      },
    ]);
    setNewTaskTitle('');
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {tasks.map((task) => (
        <Text key={task.id} testID="task-item">
          {task.title}
        </Text>
      ))}

      {!tasks.length ? <Text>No tasks, start by adding one...</Text> : null}

      <TextInput
        accessibilityLabel="New Task"
        placeholder="New Task..."
        value={newTaskTitle}
        onChangeText={(text) => setNewTaskTitle(text)}
      />

      <Pressable accessibilityRole="button" onPress={handleAddTask}>
        <Text>Add Task</Text>
      </Pressable>
    </View>
  );
}
