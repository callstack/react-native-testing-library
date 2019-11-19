export default function cleanup() {
  cleanup.queue.forEach(fn => fn());
  cleanup.queue.clear();
}

cleanup.queue = new Set();
