import { createContext } from 'react';

export interface ISelectedDateCtx {
  selectedDate: Date;
  setSelectedDate: (newDate: Date) => void;
}
export const SelectedDateCtx = createContext<ISelectedDateCtx>({
  selectedDate: new Date(),
  setSelectedDate: (): void => {},
});
