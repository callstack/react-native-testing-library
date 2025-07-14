import * as React from 'react';
import { html } from 'react-strict-dom';
import { render, screen } from '@testing-library/react-native';

test('showcase query variants', () => {
  render(
    <html.div>
      <html.span>Item 1</html.span>
      <html.span>Item 2</html.span>
    </html.div>,
  );

  // Use getBy* queries to find a single element matching given predicate
  expect(screen.getByText('Item 1')).toBeOnTheScreen();

  // Use getAllBy* queries to find all elements matching given predicate (note the use of a regex)
  expect(screen.getAllByText(/Item/)).toHaveLength(2);

  // Use queryBy* to look for an element that you expect does not exist
  expect(screen.queryByText('Item 3')).not.toBeOnTheScreen();
});

function LazyText({ content }: { content: string }) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Simulate async loading operation
  React.useEffect(() => {
    sleep(100);
    setIsLoaded(true);
  }, []);

  return <html.span>{isLoaded ? content : 'Loading...'}</html.span>;
}

test('showcase async query variants', async () => {
  render(
    <html.div>
      <LazyText content="Lazy Item 1" />
      <LazyText content="Lazy Item 2" />
    </html.div>,
  );

  // Use findBy* to wait for an element to appear
  expect(await screen.findByText('Lazy Item 1')).toBeOnTheScreen();
});

// Simulate async operation
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
