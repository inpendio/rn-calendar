import React, { memo, ReactElement, useState, useContext } from 'react';
import { subMonths, addMonths, format, isSameMonth } from 'date-fns';
import { MonthControllerCtx, BaseConfigCtx } from '../contexts';
import { Month } from '../utils';
import { MONTH_ORDER, MONTH_FORMAT } from '../consts';

type PassingArgs = {
  startingDayIndex: number;
  order: MONTH_ORDER;
};

function getCalculatedMonth(
  current,
  comparator,
  calcFunc,
  rest: PassingArgs
): Month | null {
  if (
    comparator &&
    (isSameMonth(calcFunc(current, 1), comparator) ||
      isSameMonth(current, comparator))
  )
    return null;
  return new Month({
    date: calcFunc(current, 1),
    startingDay: rest.startingDayIndex,
    order: rest.order,
  });
}

function calculateMinMonth(
  current,
  { pastScrollRange, minMonth }
): Date | undefined {
  let out;
  if (minMonth) out = minMonth;
  if (pastScrollRange || pastScrollRange === 0)
    out = subMonths(current, pastScrollRange);

  return out;
}

function calculateMaxMonth(
  current,
  { futureScrollRange, maxMonth }
): Date | undefined {
  let out;
  if (maxMonth) out = maxMonth;
  if (futureScrollRange || futureScrollRange === 0)
    out = addMonths(current, futureScrollRange);

  return out;
}

export type MonthControllerProps = {
  minMonth?: Date | undefined;
  maxMonth?: Date | undefined;
  pastScrollRange: number;
  futureScrollRange: number;
  initialDate?: Date;
};

function MonthController({
  children,
  minMonth,
  maxMonth,
  futureScrollRange,
  pastScrollRange,
  initialDate = new Date(),
}: MonthControllerProps & IBaseProps): ReactElement {
  const { startingDayIndex } = useContext(BaseConfigCtx);
  const [currentMonth, setCurrentMonth] = useState<Month>(
    new Month({
      date: initialDate,
      startingDay: startingDayIndex,
      order: MONTH_ORDER.PRESENT,
    })
  );

  const [finalMinMonth] = useState(
    calculateMinMonth(currentMonth.date, { pastScrollRange, minMonth })
  );
  const [finalMaxMonth] = useState(
    calculateMaxMonth(currentMonth.date, { futureScrollRange, maxMonth })
  );

  const [previousMonth, setPreviousMonth] = useState<Month | null>(
    getCalculatedMonth(currentMonth.date, finalMinMonth, subMonths, {
      order: MONTH_ORDER.PAST,
      startingDayIndex,
    })
  );
  const [nextMonth, setNextMonth] = useState<Month | null>(
    getCalculatedMonth(currentMonth.date, finalMaxMonth, addMonths, {
      order: MONTH_ORDER.FUTURE,
      startingDayIndex,
    })
  );

  const monthForward = (): void => {
    if (!nextMonth) return;
    const newFuture = getCalculatedMonth(
      nextMonth.date,
      finalMaxMonth,
      addMonths,
      { order: MONTH_ORDER.FUTURE, startingDayIndex }
    );
    if (newFuture === null) return;
    const newCurrent = nextMonth;
    newCurrent.order = MONTH_ORDER.PRESENT;
    const newPast = currentMonth;
    newPast.order = MONTH_ORDER.PAST;

    setPreviousMonth(newPast);
    setCurrentMonth(newCurrent);
    setNextMonth(newFuture);
  };
  const monthBack = (): void => {
    if (!previousMonth) return;
    const newPast = getCalculatedMonth(
      previousMonth.date,
      finalMinMonth,
      subMonths,
      { order: MONTH_ORDER.PAST, startingDayIndex }
    );
    if (newPast === null) return;
    const newCurrent = previousMonth;
    newCurrent.order = MONTH_ORDER.PRESENT;
    const newFuture = currentMonth;
    newFuture.order = MONTH_ORDER.FUTURE;

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
      previousMonth ? format(previousMonth.date, MONTH_FORMAT) : 'no_past___'
    }__`,
    present: `__${format(currentMonth.date, MONTH_FORMAT)}__`,
    future: `__${
      nextMonth ? format(nextMonth.date, MONTH_FORMAT) : 'no_future__'
    }__`,
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
