import * as React from 'react';
import { FlatList, RefreshControl, ScrollView, SectionList, Text, View } from 'react-native';

import { render, screen, userEvent } from '../../..';

describe('pullToRefresh()', () => {
  test('supports ScrollView', async () => {
    const onRefreshMock = jest.fn();
    await render(
      <ScrollView
        testID="view"
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefreshMock} />}
      />,
    );
    const user = userEvent.setup();

    await user.pullToRefresh(screen.getByTestId('view'));
    expect(onRefreshMock).toHaveBeenCalled();
  });

  test('supports FlatList', async () => {
    const onRefreshMock = jest.fn();
    await render(
      <FlatList
        testID="view"
        data={['A', 'B', 'C']}
        renderItem={({ item }) => <Text>{item}</Text>}
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefreshMock} />}
      />,
    );
    const user = userEvent.setup();

    await user.pullToRefresh(screen.getByTestId('view'));
    expect(onRefreshMock).toHaveBeenCalled();
  });

  test('supports SectionList', async () => {
    const onRefreshMock = jest.fn();
    await render(
      <SectionList
        testID="view"
        sections={[
          { title: 'Section 1', data: ['A', 'B', 'C'] },
          { title: 'Section 2', data: ['D', 'E', 'F'] },
        ]}
        renderItem={({ item }) => <Text>{item}</Text>}
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefreshMock} />}
      />,
    );
    const user = userEvent.setup();

    await user.pullToRefresh(screen.getByTestId('view'));
    expect(onRefreshMock).toHaveBeenCalled();
  });

  test('does not throw when RefreshControl is not set', async () => {
    await render(<ScrollView testID="view" />);
    const user = userEvent.setup();

    await expect(user.pullToRefresh(screen.getByTestId('view'))).resolves.toBeUndefined();
  });

  test('does not throw when RefreshControl onRefresh is not set', async () => {
    await render(
      <ScrollView testID="view" refreshControl={<RefreshControl refreshing={false} />} />,
    );
    const user = userEvent.setup();

    await expect(user.pullToRefresh(screen.getByTestId('view'))).resolves.toBeUndefined();
  });

  test('throws when passed a non-ScrollView element', async () => {
    await render(<View testID="view" />);
    const user = userEvent.setup();

    await expect(user.pullToRefresh(screen.getByTestId('view'))).rejects.toThrow(
      /pullToRefresh\(\) works only with host "ScrollView" instances/,
    );
  });
});
