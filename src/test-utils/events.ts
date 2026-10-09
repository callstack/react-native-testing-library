/** A logged handler call. `event-serializer.ts` prints it the same way in both event systems. */
export class EventEntry {
  constructor(
    readonly name: string,
    readonly payload: any,
  ) {}
}

export function createEventLogger() {
  const events: EventEntry[] = [];
  const logEvent = (name: string) => {
    return (event: unknown) => {
      events.push(new EventEntry(name, event));
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
