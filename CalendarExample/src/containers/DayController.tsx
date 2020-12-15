import React, { memo, ReactElement, useState } from 'react';
import { DayControllerCtx } from '../contexts';

export type DayControllerProps = {
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
};

function DayController({
  children,
  minDate,
  maxDate,
}: DayControllerProps & IBaseProps): ReactElement {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <DayControllerCtx.Provider
      value={{ selectedDate, setSelectedDate, minDate, maxDate }}
    >
      {children}
    </DayControllerCtx.Provider>
  );
}

export default memo(DayController);
