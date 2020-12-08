import React, { memo, ReactElement, useState, useContext } from 'react';
import { subMonths, addMonths, format, isSameMonth } from 'date-fns';
import { MonthControllerCtx, BaseConfigCtx } from '../contexts';
import { Month } from '../utils';
import { MONTH_ORDER } from '../consts';

const FORMAT = 'MM-yyyy';

export type MonthControllerProps = {
  minMonth?: Date | undefined;
  maxMonth?: Date | undefined;
};

function MonthController({
  children,
  minMonth,
  maxMonth,
}: MonthControllerProps & IBaseProps): ReactElement {
  const { startingDayIndex } = useContext(BaseConfigCtx);
  console.log('$$$', startingDayIndex);
  const [currentMonth, setCurrentMonth] = useState<Month>(
    new Month({
      date: new Date(),
      startingDay: startingDayIndex,
      order: MONTH_ORDER.PRESENT,
    })
  );
  const [previousMonth, setPreviousMonth] = useState<Month | null>(
    new Month({
      date: subMonths(currentMonth.date, 1),
      startingDay: startingDayIndex,
      order: MONTH_ORDER.PAST,
    })
  );
  const [nextMonth, setNextMonth] = useState<Month | null>(
    new Month({
      date: addMonths(currentMonth.date, 1),
      startingDay: startingDayIndex,
      order: MONTH_ORDER.FUTURE,
    })
  );

  const monthForward = (): void => {
    if (!nextMonth) return;
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
    if (!(maxMonth && isSameMonth(newFuture.date, maxMonth))) {
      setNextMonth(newFuture);
    } else setNextMonth(null);
  };
  const monthBack = (): void => {
    if (!previousMonth) return;
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

  const getByOrder = (order: MONTH_ORDER): Month | null => {
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
    past: `__${
      previousMonth ? format(previousMonth.date, FORMAT) : 'no_past___'
    }__`,
    present: `__${format(currentMonth.date, FORMAT)}__`,
    future: `__${nextMonth ? format(nextMonth.date, FORMAT) : 'no_future__'}__`,
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

export default memo(MonthController);
