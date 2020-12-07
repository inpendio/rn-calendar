import React, { memo, ReactElement, useContext } from 'react';
import {
  Pressable,
  Text,
  // TextProps,
  // GestureResponderEvent,
  PressableProps,
} from 'react-native';
// import invariant from 'ts-invariant';
import { /* getDate, */ isSameDay } from 'date-fns';
import { Day } from '../../utils';
import { SelectedDateCtx } from '../../contexts';

type OwnProps = {
  // date:Date,
  // isSelected?:boolean,
  // textProps?:TextProps,
  // textPropSelected?:TextProps,
  // onPress:((event: GestureResponderEvent) => void) | null | undefined,
  day: Day;
};

type OtherProps = Omit<PressableProps, keyof OwnProps>;

export type DayProps = OwnProps & OtherProps;

function DayView({ day }: DayProps): ReactElement {
  const { selectedDate } = useContext(SelectedDateCtx);
  const isSelected = isSameDay(day.date, selectedDate);
  return (
    <Pressable
      style={[
        { flex: 1 },
        isSelected ? { backgroundColor: 'blue', borderRadius: 50 } : {},
      ]}
      // {...other}
      // onPress={onPress}
    >
      <Text>{day.label}</Text>
    </Pressable>
  );
}

export default memo(DayView);
