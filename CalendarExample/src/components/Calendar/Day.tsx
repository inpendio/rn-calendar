import React, { memo, ReactElement, useContext, useState } from 'react';
import { Pressable, Text, PressableProps } from 'react-native';
import { isSameDay } from 'date-fns';
import { Day, isWithinInterval } from '../../utils';
import { DayControllerCtx } from '../../contexts';

type OwnProps = {
  day: Day;
};

type OtherProps = Omit<PressableProps, keyof OwnProps>;

export type DayProps = OwnProps & OtherProps;

function DayView({ day }: DayProps): ReactElement {
  const { selectedDate, minDate, maxDate } = useContext(DayControllerCtx);
  const [isSelectable] = useState(isWithinInterval(day.date, minDate, maxDate));
  const isSelected = isSameDay(day.date, selectedDate);
  console.log(isWithinInterval(day.date, minDate, maxDate));
  return (
    <Pressable
      style={[
        { flex: 1 },
        isSelected ? { backgroundColor: 'blue', borderRadius: 50 } : {},
      ]}
      // {...other}
      // onPress={onPress}
    >
      <Text style={[{ color: '#333' }, isSelectable ? {} : { color: 'red' }]}>
        {day.label}
      </Text>
    </Pressable>
  );
}

export default memo(DayView);
