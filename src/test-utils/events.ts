export interface EventEntry {
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

export function getEventsNames(events: EventEntry[]) {
  return events.map((event) => event.name);
}

export function lastEventPayload(events: EventEntry[], name: string) {
  return events.filter((e) => e.name === name).pop()?.payload;
}
