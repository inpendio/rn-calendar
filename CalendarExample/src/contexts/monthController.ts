import { createContext } from 'react';
import { subMonths, addMonths } from 'date-fns';
import { Month } from '../utils';
import { MONTH_ORDER } from '../consts';

export type SetMonthFunction<T> = React.Dispatch<React.SetStateAction<T>>;

export type TopKeysObject = {
  past: string;
  present: string;
  future: string;
};

export interface IMonthControllerCtx {
  currentMonth: Month;
  setCurrentMonth: SetMonthFunction<Month>;
  previousMonth: Month | null;
  setPreviousMonth: SetMonthFunction<Month | null>;
  nextMonth: Month | null;
  setNextMonth: SetMonthFunction<Month | null>;
  monthForward: () => void;
  monthBack: () => void;
  getByOrder: (order: MONTH_ORDER) => Month | null;
  keys: TopKeysObject;
}
export const MonthControllerCtx = createContext<IMonthControllerCtx>({
  currentMonth: new Month({
    date: new Date(),
    startingDay: 0,
    order: MONTH_ORDER.PRESENT,
  }),
  setCurrentMonth: (): void => {},
  previousMonth: new Month({
    date: subMonths(new Date(), 1),
    startingDay: 0,
    order: MONTH_ORDER.PAST,
  }),
  setPreviousMonth: (): void => {},
  nextMonth: new Month({
    date: addMonths(new Date(), 1),
    startingDay: 0,
    order: MONTH_ORDER.FUTURE,
  }),
  setNextMonth: (): void => {},
  monthForward: (): void => {},
  monthBack: (): void => {},
  getByOrder: (): Month =>
    new Month({ date: new Date(), startingDay: 0, order: MONTH_ORDER.PRESENT }),
  keys: {
    past: '',
    present: '',
    future: '',
  },
});
