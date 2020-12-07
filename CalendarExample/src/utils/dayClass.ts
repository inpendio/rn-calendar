import { format } from 'date-fns';
import { getDate } from 'date-fns/fp';
import { DateComponent, IDateComponent } from './classHelpers';

const SIMPLE_FORMAT = 'dd-MM-yyyy';

export interface IDayClass extends IDateComponent {}

export class Day extends DateComponent {
  // here date is used as date of the day

  label: string;

  constructor(data: IDayClass) {
    super(data);
    this.type = '__Day';

    this.key = `${data.keyExtender || ''}${this.type}_${format(
      this.date,
      SIMPLE_FORMAT
    )}`;

    this.label = `${getDate(this.date)}`;
  }
}
