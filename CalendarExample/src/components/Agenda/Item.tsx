import { AgendaControllerCtx } from 'CalendarExample/src/contexts';
import { Day } from 'CalendarExample/src/utils';
import React, { ReactElement, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Event = {
  title: string;
  duration: number;
};
type EventList = {
  [index: number]: Event[];
};

type IR = {
  day: Day;
  events?: Event[];
};

const renderEvent = (event: Event): ReactElement => (
  <View
    style={{
      height: 50 * event.duration,
      paddingHorizontal: 5,
      backgroundColor: 'blue',
      marginHorizontal: 1,
      borderRadius: 8,
    }}
  >
    <Text style={{ color: 'white', fontWeight: 'bold' }}>{event.title}</Text>
  </View>
);

const DayRender = ({ day, events }: IR): ReactElement => (
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
      {events && events.map((event) => renderEvent(event))}
    </View>
  </View>
);

export default function ({ item, index, customRenderer }): ReactElement {
  const { listController } = useContext(AgendaControllerCtx);

  return (
    <View onLayout={listController.onLayoutForIndex(index)}>
      <DayRender
        day={item}
        // events={data[index]}
      />
    </View>
  );
}
