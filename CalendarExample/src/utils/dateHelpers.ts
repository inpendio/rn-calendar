/* eslint-disable @typescript-eslint/naming-convention */
import { isAfter, isBefore, parse, set } from 'date-fns';
import invariant from 'ts-invariant';
import { DAY_FORMAT, MONTH_FORMAT } from '../consts';

export enum EWEEK_DAYS {
  SUNDAY = 'sunday',
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
}

export type TWeekDayIndexes = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function asWeekDay(day: string): EWEEK_DAYS {
  console.log(day);
  const wdIndex = Object.keys(EWEEK_DAYS).indexOf(day.toUpperCase());
  invariant(wdIndex !== -1, 'asWeekDay:Not a week day');
  const wkv = Object.keys(EWEEK_DAYS)[wdIndex] as EWEEK_DAYS;
  // @ts-ignore
  return EWEEK_DAYS[wkv];
}

export function getIndexForUnknown(day: string | number | undefined): number {
  if ((day || day === 0) && typeof day === 'number' && day < 7 && day >= 0) {
    return day;
  }
  if (
    day &&
    Object.keys(EWEEK_DAYS).indexOf((day as string).toUpperCase()) !== -1
  ) {
    return Object.keys(EWEEK_DAYS).indexOf((day as string).toUpperCase());
  }
  return 0;
}

export function getWeekDaysFromIndex(index: TWeekDayIndexes): Array<string> {
  // const index = Object.values(EWEEK_DAYS).indexOf(asWeekDay(startFrom));
  const before: Array<string> = [];
  const after: Array<string> = [];
  Object.values(EWEEK_DAYS).forEach((day: EWEEK_DAYS, i) => {
    if (i >= index) before.push(day);
    else after.push(day);
  });
  return before.concat(after);
}

export function getWeekDays(
  startFrom: string | EWEEK_DAYS = EWEEK_DAYS.MONDAY
): Array<string> {
  const index = <TWeekDayIndexes>(
    Object.values(EWEEK_DAYS).indexOf(asWeekDay(startFrom))
  );
  return getWeekDaysFromIndex(index);
  //   const before: Array<string> = [];
  //   const after: Array<string> = [];
  //   Object.values(EWEEK_DAYS).forEach((day: EWEEK_DAYS, i) => {
  //     if (i >= index) before.push(day);
  //     else after.push(day);
  //   });
  //   return before.concat(after);
}

export function getShortName(day: string): string {
  return day[0].toUpperCase() + day.substring(1, 3);
}
//
export function getDayIndex(day: string | EWEEK_DAYS): TWeekDayIndexes {
  const wdIndex = Object.keys(EWEEK_DAYS).indexOf(day.toUpperCase());
  console.log(wdIndex < 0 || wdIndex > 6, wdIndex);
  invariant(
    wdIndex >= 0 || wdIndex <= 6,
    `getDayIndex:Not a week day${wdIndex}`
  );
  return wdIndex as TWeekDayIndexes;
}

export function parseAndInvalidateDate(date, format, refDate): Date {
  if (date instanceof Date) return date;
  try {
    return parse(date, format, refDate);
  } catch {
    throw new Error(
      `Possible wrong date format. Accepting: ${MONTH_FORMAT} or ${DAY_FORMAT}`
    );
  }
}

export function parseMonth(date): Date | undefined {
  if (!date) return undefined;
  return parseAndInvalidateDate(
    date,
    MONTH_FORMAT,
    set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
  );
}

export function parseDay(date): Date | undefined {
  if (!date) return undefined;
  return parseAndInvalidateDate(
    date,
    DAY_FORMAT,
    set(new Date(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
  );
}

export function isWithinInterval(date, minDate, maxDate): boolean {
  if (minDate && isBefore(date, minDate)) return false;
  if (maxDate && isAfter(date, maxDate)) return false;
  return true;
}
