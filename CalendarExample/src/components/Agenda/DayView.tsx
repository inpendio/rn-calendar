import { differenceInMinutes } from 'date-fns';
import React, { memo, ReactElement, ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import invariant from 'ts-invariant';
import { renderCustom } from '../../utils/renderHelpers';
import { Day } from '../../utils';
import { CalendarEvent, RenderProp } from '../../utils/types';

export type DayViewProps = {
  day: Day;
  events?: CalendarEvent[];
  renderer?: RenderProp;
  eventRenderer?: RenderProp;
};

const renderEvent = (
  event: CalendarEvent,
  renderer?: RenderProp
): ReactNode => {
  const { allDay, startTime, endTime, title } = event;

  let duration = 0; // in minutes
  if (allDay) duration = 24 * 60;
  else {
    invariant(endTime, "If event is not 'allDay', endTime should be provided");
    differenceInMinutes(startTime, endTime);
  }
  if (renderer) return renderCustom(renderer, { ...event, duration });
  return (
    <Pressable
      style={{
        height: 3 * duration,
        paddingHorizontal: 5,
        backgroundColor: 'blue',
        marginHorizontal: 1,
        borderRadius: 8,
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{title}</Text>
    </Pressable>
  );
};

function DayView({
  day,
  events = [],
  renderer = undefined,
  eventRenderer = undefined,
}: DayViewProps): ReactElement | null {
  if (renderer)
    return renderCustom(renderer, { ...day, events, eventRenderer });
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderBottomColor: '#666',
        borderBottomWidth: StyleSheet.hairlineWidth,
      }}
    >
      <View>
        <Text style={{ fontSize: 20, color: '#888' }}>{day.label}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        {events && events.map((event) => renderEvent(event, eventRenderer))}
      </View>
    </View>
  );
}

export default memo(DayView);
