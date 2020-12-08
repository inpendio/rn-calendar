import React, { memo, ReactElement, useEffect, useContext } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { getDaysInMonth } from 'date-fns';
import { MonthControllerCtx } from '../contexts';

export type AgendaProps = {};

const Day = ({ day }): ReactElement => (
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
      <Text style={{ fontSize: 20, color: '#888' }}>{day}</Text>
    </View>
    <View />
  </View>
);

function Agenda(): ReactElement {
  const { currentMonth } = useContext(MonthControllerCtx);
  const days = new Array(getDaysInMonth(currentMonth.date))
    .fill(0)
    .map((_, i) => ({ day: i }));
  useEffect(() => {
    console.log('Agenda:First');
  }, []);
  return (
    <FlatList
      style={{ flex: 1 }}
      data={days}
      keyExtractor={({ day }): string => `day_${day}`}
      renderItem={({ item }): ReactElement => <Day day={item.day} />}
      onViewableItemsChanged={(info): void => {
        console.log(info);
      }}
    />
  );
}

export default memo(Agenda);
