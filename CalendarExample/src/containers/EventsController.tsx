import { addDays, differenceInCalendarDays, differenceInMinutes, isSameDay, startOfDay } from 'date-fns';
import React, { useCallback, useState, useEffect, ReactElement } from 'react';
import invariant from 'ts-invariant';
import { EventsControllerCtx } from '../contexts';
import { CalendarEvent, Callback, ParsedCalendarEvent } from '../utils/types';


export type EventsControllerProps = {
    events: CalendarEvent[],
};

async function parseEvents(events: CalendarEvent[], cb: Callback<Map<number, ParsedCalendarEvent[]>>): Promise<void> {
    const out = new Map<number, ParsedCalendarEvent[]>();
    events.forEach((event): void => {
        const { duration: predefinedDuration, startTime, endTime, allDay, title } = event;
        console.groupCollapsed(title);
        console.log(startTime);
        let duration = predefinedDuration || 0; // in minutes
        // parse duration if one is not provided
        if (!duration) {
            if (allDay) duration = 24 * 60;
            else {
                invariant(endTime, "If event is not 'allDay', endTime or duration should be provided");
                differenceInMinutes(startTime, endTime);
            }
        }
        console.log('duration', duration);

        // check multiday
        let multiday = false;
        if (endTime && !isSameDay(startTime, endTime)) {
            multiday = true;
            console.log(multiday, isSameDay(startTime, endTime), event);
        }


        let keys = [startOfDay(startTime).getTime()];

        if (endTime) {
            console.log(differenceInCalendarDays(endTime, startTime), endTime, startTime);
            keys = new Array(differenceInCalendarDays(endTime, startTime) + 1).fill(0).map((_, i) => {
                // if(i===0)return startOfDay(startTime);
                return startOfDay(addDays(startTime, i)).getTime();
            });
        }


        const finalEvent: ParsedCalendarEvent = { ...event, duration, multiday, key: `${title}_${startTime.getTime()}_${duration}` };
        keys.forEach(key => {
            console.log({ key, exist: out.get(key) });
            if (!out.get(key)) out.set(key, []);
            out.get(key)?.push(finalEvent);
        });

        console.groupEnd();
    });
    cb(out);
};


export function EventsController({ events, children }: EventsControllerProps & IBaseProps): ReactElement {
    const [mappedEvents, setMappedEvents] = useState<Map<number, ParsedCalendarEvent[]>>(new Map());

    useEffect(() => {
        invariant(Array.isArray(events), `Props events should be an array, got: ${typeof events}`);
        parseEvents(events, setMappedEvents);
    }, [events]);

    const getEventsForDate = useCallback((date: Date): ParsedCalendarEvent[] => {
        if (mappedEvents.size === 0) return [];
        const key = startOfDay(date).getTime();
        return mappedEvents.get(key) || [];
    }, [mappedEvents]);

    console.groupCollapsed("EventsController");
    console.log(mappedEvents);
    console.log(events);
    console.log(mappedEvents);
    console.groupEnd();


    return <EventsControllerCtx.Provider value={{ getEventsForDate }}>
        {children}
    </EventsControllerCtx.Provider>;
}
