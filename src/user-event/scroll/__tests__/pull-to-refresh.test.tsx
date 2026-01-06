import * as React from 'react';
import { FlatList, RefreshControl, ScrollView, SectionList, Text } from 'react-native';

import { render, screen, userEvent } from '../../..';

describe('pullToRefresh()', () => {
  it('supports ScrollView', async () => {
    const onRefreshMock = jest.fn();
    render(
      <ScrollView
        testID="view"
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefreshMock} />}
      />,
    );
    const user = userEvent.setup();

    await user.pullToRefresh(screen.getByTestId('view'));
    expect(onRefreshMock).toHaveBeenCalled();
  });

  it('supports FlatList', async () => {
    const onRefreshMock = jest.fn();
    render(
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

  it('supports SectionList', async () => {
    const onRefreshMock = jest.fn();
    render(
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

  it('does not throw when RefreshControl is not set', async () => {
    render(<ScrollView testID="view" />);
    const user = userEvent.setup();

    await expect(() => user.pullToRefresh(screen.getByTestId('view'))).not.toThrow();
  });

  it('does not throw when RefreshControl onRefresh is not set', async () => {
    render(<ScrollView testID="view" refreshControl={<RefreshControl refreshing={false} />} />);
    const user = userEvent.setup();

    await expect(() => user.pullToRefresh(screen.getByTestId('view'))).not.toThrow();
  });
});
