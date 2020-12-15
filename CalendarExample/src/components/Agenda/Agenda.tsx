import React, {
  memo,
  ReactElement,
  useEffect,
  useContext,
  useState,
  isValidElement,
} from 'react';
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { getDate, isSameMonth } from 'date-fns';
import { Callback } from 'CalendarExample/src/utils/types';
import { DayControllerCtx, AgendaControllerCtx } from '../../contexts';
import Item from './Item';
// import { ItemSelectedCallback } from '../../utils/types';

export type OwnProps = {
  style?: StyleProp<ViewStyle>;
  renderItem?: ListRenderItem<any> | null | undefined;
  onDateSelected?: Callback<Date>;
};

type ExistingProps<ItemT> = {
  data: ReadonlyArray<ItemT> | null | undefined;
  keyExtractor?: (item: ItemT, index: number) => string;
  renderItem: ListRenderItem<ItemT> | null | undefined;
};
type OmitedFlatListProps<ItemT = any> = Omit<
  Omit<FlatListProps<ItemT>, keyof ExistingProps<ItemT>>,
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
  // const [selectedDate, setSelectedDate] = useState(new Date());

  console.log(
    'AGENDA ',
    { FlatList, selectedDate, setSelectedDate, rrv: <View /> },

    isValidElement(FlatList),
    isValidElement(<View />)
  );

  useEffect(() => {
    console.log('AGENDA [selectedDate, listController]');
    if (
      listController &&
      isSameMonth(listController.month.date, selectedDate)
    ) {
      const index = getDate(selectedDate);
      listController.scrollToIndex(index - 1);
    }
  }, [selectedDate, listController]);

  useEffect(() => {
    console.log('AGENDA FIRST');
    if (listController) {
      listController.onDayChange = setSelectedDate;
      listController.onDaySettled = (d): void => {
        console.log('settled on ', d);
      };
      // listController.addOnItemSelected(onDateSelected);
      // listController.addOnItemViewChanged(({ date }): void =>
      //   setSelectedDate(date)
      // );
    }
  }, [listController]);

  if (!listController) return null;

  console.log('RENDER', !!listController.listRef.current, {
    listController,
    selectedDate,
  });

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
      // key={listController.key}
    />
  );
}

export default memo(Agenda);
