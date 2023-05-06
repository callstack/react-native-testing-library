interface EventEntry {
  name: string;
  payload: any;
}

export function createEventToolkit() {
  const events: EventEntry[] = [];
  const handleEvent = (name: string) => {
    return (event: unknown) => {
      const eventEntry: EventEntry = {
        name,
        payload: event,
      };

      events.push(eventEntry);
    };
  };

  return { events, handleEvent };
}
