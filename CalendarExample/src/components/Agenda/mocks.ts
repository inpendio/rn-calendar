type AgendaEvent = {
  title: string;
  duration: number;
};
type EventList = {
  [index: number]: AgendaEvent[];
};

/* type IR = {
  day: Day;
  events: AgendaEvent[];
}; */

export const data: EventList = {
  1: [
    { title: 'something One', duration: 1 },
    { title: 'something two', duration: 2 },
  ],
  13: [
    { title: 'something One', duration: 1 },
    { title: 'something two', duration: 2 },
    { title: 'something trhee', duration: 4 },
  ],
  16: [
    { title: 'something One', duration: 1 },
    { title: 'something two', duration: 2 },
  ],
  21: [
    { title: 'something One', duration: 1 },
    { title: 'something two', duration: 2 },
  ],
  23: [
    { title: 'something One', duration: 1 },
    { title: 'something two', duration: 2 },
    { title: 'something trhee', duration: 4 },
  ],
  26: [
    { title: 'something One', duration: 1 },
    { title: 'something two', duration: 2 },
  ],
  29: [
    { title: 'something One', duration: 5 },
    { title: 'something two', duration: 2 },
  ],
  30: [
    { title: 'something One', duration: 7 },
    { title: 'something two', duration: 2 },
  ],
};
