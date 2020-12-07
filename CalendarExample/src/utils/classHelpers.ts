/* eslint-disable import/prefer-default-export */

export interface IDateComponent {
  date: Date;
  keyExtender?: string;
}
export abstract class DateComponent {
  date: Date = new Date();

  keyExtender: string = '';

  key: string = '';

  type: string = '';

  constructor({ date }: IDateComponent) {
    this.date = date;
  }
}
