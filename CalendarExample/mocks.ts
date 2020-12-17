import { addDays, addMinutes, set, subDays } from "date-fns";
import { CalendarEvent } from "./src/utils/types";

type AgendaEvent = {
  title: string;
  duration: number;
};
type EventList = CalendarEvent[];

const morning = set(new Date(), {hours:8, minutes:0, seconds:0,milliseconds:0});
const noon = set(new Date(), {hours:13, minutes:0, seconds:0,milliseconds:0});
const evening =set(new Date(), {hours:19, minutes:0, seconds:0,milliseconds:0});

export default [
  {
    startTime:noon,
    duration: 45,
    title: 'noon 45',
  },{
    startTime:subDays(morning, 4),
    duration: 45,
    title: 'morning 45 -4',
  },{
    startTime:addDays(morning,3),
    duration: 120,
    title: 'morning 120 +3',
  },{
    startTime:addDays(evening,2),
    endTime: addMinutes(addDays(evening,2), 300),
    title: 'evening endTime:+300 +2',
  },{
    startTime:subDays(evening, 12),
    endTime: addMinutes(subDays(evening,2), 300),
    title: 'evening endTime:-2/+300 -12',
  },{
    startTime:subDays(morning,2),
    endTime:addDays(noon, 1),
    title: 'Multiday -2_noon_+1',
  }
];
