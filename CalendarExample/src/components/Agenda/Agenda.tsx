import React, { memo, ReactElement, useEffect, useContext } from 'react';
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { getDate, isSameMonth } from 'date-fns';
import { DayControllerCtx, AgendaControllerCtx } from '../../contexts';
import Item from './Item';
// import { ItemSelectedCallback } from '../../utils/types';

export type OwnProps = {
  style?: StyleProp<ViewStyle>;
  renderItem?: ListRenderItem<any> | null | undefined;
  onDateSelected?: ItemSelectedCallback;
};
type OmitedFlatListProps<ItemT = any> = Omit<
  FlatListProps<ItemT>,
  keyof OwnProps
>;

export type AgendaProps = OwnProps & OmitedFlatListProps;

function Agenda({
  style,
  renderItem,
  onDateSelected,
  ...other
}: AgendaProps): ReactElement | null {
  const { listController } = useContext(AgendaControllerCtx);
  const { selectedDate, setSelectedDate } = useContext(DayControllerCtx);

  useEffect(() => {
    if (
      listController &&
      isSameMonth(listController.month.date, selectedDate)
    ) {
      const index = getDate(selectedDate);
      listController.scrollToIndex(index - 1);
    }
  }, [selectedDate, listController]);

  useEffect(() => {
    if (listController) {
      listController.addOnItemSelected(onDateSelected);
      // listController.addOnItemSelected((d) => setSelectedDate(d));
      listController.addOnItemViewChanged(({ date }): void =>
        setSelectedDate(date)
      );
    }
  }, [listController]);

  if (!listController) return null;

  return (
    <FlatList
      {...other}
      ref={listController.listRef}
      style={[{ flex: 1, backgroundColor: 'white' }, style]}
      data={listController.month.days}
      keyExtractor={(day): string => `agendaDay_${day.key}`}
      renderItem={(itemProps): ReactElement => (
        <Item {...itemProps} customRenderer={renderItem} />
      )}
      {...listController.flatListProps}
    />
  );
}

export default memo(Agenda);
