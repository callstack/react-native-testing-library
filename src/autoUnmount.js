import render from './render';

export default function autoUnmount() {
  let queue;
  beforeEach(() => {
    queue = render.unmountQueue = [];
  });
  afterEach(() => {
    queue.forEach(unmount => unmount());
    render.unmountQueue = null;
  });
}
