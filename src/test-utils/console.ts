import { format } from 'util';

export function excludeConsoleMessage(logFn: (...args: unknown[]) => void, excludeMessage: string) {
  return (...args: unknown[]) => {
    const message = format(...args);
    if (message.includes(excludeMessage)) {
      return;
    }

    logFn(...args);
  };
}
