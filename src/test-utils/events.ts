interface EventEntry {
  name: string;
  payload: any;
}

export function createEventLogger() {
  const events: EventEntry[] = [];
  const logEvent = (name: string) => {
    return (event: unknown) => {
      const eventEntry: EventEntry = {
        name,
        payload: event,
      };

      events.push(eventEntry);
    };
  };

  return { events, logEvent };
}
