import { eachWeekOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';
import { MONTH_ORDER, MONTH_FORMAT } from '../consts';
import { DateComponent, IDateComponent } from './classHelpers';
import { getIndexForUnknown, TWeekDayIndexes } from './dateHelpers';
import { Week } from './weekClass';

export interface IMonthClass extends IDateComponent {
  startingDay: string | number | undefined;
  order: MONTH_ORDER;
}

export class Month extends DateComponent {
  // here date is used to get month

  startingDay: number = 0;

  weeks: Week[] = [];

  order: MONTH_ORDER;

  label: string;

  constructor(data: IMonthClass) {
    super(data);
    this.type = '__month';
    const { startingDay, keyExtender, order } = data;
    this.startingDay = getIndexForUnknown(startingDay);
    this.order = order;
    this.label = format(this.date, MONTH_FORMAT);

    this.key = `${keyExtender || ''}${this.type}_${this.label}`;
    this.keyExtender = `forMonth_${this.label}`;

    this.constructWeeks();
  }

  constructWeeks = (): void => {
    eachWeekOfInterval(
      { start: startOfMonth(this.date), end: endOfMonth(this.date) },
      { weekStartsOn: this.startingDay as TWeekDayIndexes }
    ).forEach((sotm, i): void => {
      this.weeks.push(
        new Week({ date: sotm, keyExtender: `${this.keyExtender}_${i + 1}` })
      );
    });
  };

  get numberOfWeeks(): number {
    return this.weeks.length;
  }
}
