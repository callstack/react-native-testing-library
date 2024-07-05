import * as React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { atom, useAtom } from 'jotai';

export type TodoItem = {
  id: string;
  text: string;
};

export const todosAtom = atom<TodoItem[]>([]);

export function TodoList() {
  const [todos, setTodos] = useAtom(todosAtom);

  const handleAddTodo = () =>
    setTodos((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2, 11),
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
          <Text key={item.id} accessibilityLabel={'todo-item'}>
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
