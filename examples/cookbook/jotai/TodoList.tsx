import * as React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useAtom } from 'jotai';
import { generateRandomId } from './utils';
import { todosAtom } from './state';
import { TodoItem } from './types';

export function TodoList() {
  const [todos, setTodos] = useAtom(todosAtom);

  const handleAddTodo = () =>
    setTodos((prev) => [
      ...prev,
      {
        id: generateRandomId(),
        text: 'Buy almond milk',
      },
    ]);

  if (!todos.length) {
    return <Text>No todos, start by adding one...</Text>;
  }

  return (
    <View>
      <FlatList
        data={todos}
        renderItem={({ item }: { item: TodoItem }) => (
          <Text key={item.id} testID={'todo-item'}>
            {item.text}
          </Text>
        )}
      />
      <Pressable accessibilityRole="button" onPress={handleAddTodo}>
        <Text>Add a random to-do</Text>
      </Pressable>
    </View>
  );
}
