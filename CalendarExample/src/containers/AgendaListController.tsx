import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useContext,
} from 'react';
import { isSameMonth } from 'date-fns';
// import { StyleProp, ViewStyle, ListRenderItem, FlatListProps } from 'react-native';
import { MonthControllerCtx, AgendaControllerCtx, /* AgendaControllerExistingProps,  */AgendaControllerPassedProps, AgendaControllerOmittedFlatListProps } from '../contexts';
import { AgendaListController/* , Day  */ } from '../utils';
// import { Callback } from '../utils/types';




export type AgendaControllerProps = AgendaControllerOmittedFlatListProps & /* AgendaControllerExistingProps<Day> & */ AgendaControllerPassedProps;

function AgendaListWrapper({
  children,
  itemRenderer,
  eventRenderer,
  onDateSelected,
  onDateChange,
  onItemPressed,
  onItemEventPressed,
  ...flatListProps
}: AgendaControllerProps & IBaseProps): ReactElement {
  const { currentMonth } = useContext(MonthControllerCtx);
  const [controller, setController] = useState<AgendaListController | null>(
    null
  );
  // const [props] = useState({
  //   itemRenderer,
  //   eventRenderer,
  //   onDateSelected,
  //   onDateChange,
  //   onItemPressed,
  //   onItemEventPressed,
  //   otherProps: flatListProps
  // });

  useEffect(() => {
    console.groupCollapsed("@AgendaListWrapper--> calling new controller");
    console.log(!controller, controller && !isSameMonth(controller.month.date, currentMonth.date), controller?.month !== currentMonth,);
    console.log({ controller, currentMonth, controllerDate: controller?.month.date, currentMonthDate: currentMonth.date });
    console.groupEnd();
    if (!controller || !isSameMonth(controller?.month.date, currentMonth.date))
      setController(new AgendaListController(currentMonth, 'AgendaListWrapper'));
  }, [currentMonth]);

  return (
    <AgendaControllerCtx.Provider
      value={{
        listController: controller,
        props: {
          itemRenderer,
          eventRenderer,
          onDateSelected,
          onDateChange,
          onItemPressed,
          onItemEventPressed,
          otherProps: flatListProps
        }
      }}
    >
      {children}
    </AgendaControllerCtx.Provider>
  );
}

export default memo(AgendaListWrapper);
