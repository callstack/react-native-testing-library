import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen, waitFor } from '..';

test('waits for query', async () => {
  function AsyncComponent() {
    const [text, setText] = React.useState('Loading...');

    React.useEffect(() => {
      setTimeout(() => setText('Loaded'), 100);
    }, []);

    return <Text>{text}</Text>;
  }

  await render(<AsyncComponent />);
  await waitFor(() => screen.getByText('Loaded'));
  expect(screen.getByText('Loaded')).toBeOnTheScreen();
});
