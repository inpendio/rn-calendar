import React, { memo, ReactElement, useState, useContext } from 'react';
import { subMonths, addMonths, format } from 'date-fns';
import { MonthControllerCtx, BaseConfigCtx } from '../contexts';
import { Month } from '../utils';
import { MONTH_ORDER } from '../consts';

const FORMAT = 'MM-yyyy';

export type CurrentMonthProps = {
  children: ReactElement | ReactElement[];
};

function CurrentMonth({ children }: CurrentMonthProps): ReactElement {
  const { startingDayIndex } = useContext(BaseConfigCtx);
  const [currentMonth, setCurrentMonth] = useState(
    new Month({
      date: new Date(),
      startingDay: startingDayIndex,
      order: MONTH_ORDER.PRESENT,
    })
  );
  const [previousMonth, setPreviousMonth] = useState(
    new Month({
      date: subMonths(currentMonth.date, 1),
      startingDay: startingDayIndex,
      order: MONTH_ORDER.PAST,
    })
  );
  const [nextMonth, setNextMonth] = useState(
    new Month({
      date: addMonths(currentMonth.date, 1),
      startingDay: startingDayIndex,
      order: MONTH_ORDER.FUTURE,
    })
  );

  const monthForward = (): void => {
    const newCurrent = nextMonth;
    newCurrent.order = MONTH_ORDER.PRESENT;
    const newPast = currentMonth;
    newPast.order = MONTH_ORDER.PAST;
    const newFuture = new Month({
      date: addMonths(newCurrent.date, 1),
      startingDay: startingDayIndex,
      order: MONTH_ORDER.FUTURE,
    });
    setPreviousMonth(newPast);
    setCurrentMonth(newCurrent);
    setNextMonth(newFuture);
  };
  const monthBack = (): void => {
    const newCurrent = previousMonth;
    newCurrent.order = MONTH_ORDER.PRESENT;
    const newFuture = currentMonth;
    newFuture.order = MONTH_ORDER.FUTURE;
    const newPast = new Month({
      date: subMonths(newCurrent.date, 1),
      startingDay: startingDayIndex,
      order: MONTH_ORDER.PAST,
    });
    setPreviousMonth(newPast);
    setCurrentMonth(newCurrent);
    setNextMonth(newFuture);
  };

  const getByOrder = (order: MONTH_ORDER): Month => {
    switch (order) {
      case MONTH_ORDER.PAST:
        return previousMonth;
      case MONTH_ORDER.PRESENT:
        return currentMonth;
      case MONTH_ORDER.FUTURE:
        return nextMonth;
      default:
        return currentMonth;
    }
  };

  const keys = {
    past: `__${format(previousMonth.date, FORMAT)}__`,
    present: `__${format(currentMonth.date, FORMAT)}__`,
    future: `__${format(nextMonth.date, FORMAT)}__`,
  };

  return (
    <MonthControllerCtx.Provider
      value={{
        currentMonth,
        setCurrentMonth,
        previousMonth,
        setPreviousMonth,
        nextMonth,
        setNextMonth,
        monthForward,
        monthBack,
        getByOrder,
        keys,
      }}
    >
      {children}
    </MonthControllerCtx.Provider>
  );
}

export default memo(CurrentMonth);
