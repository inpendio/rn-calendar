import React, { memo, ReactElement, useState } from 'react';
import { SelectedDateCtx } from '../contexts';

export type SelectedDateProps = {
  children: ReactElement | ReactElement[];
};

function SelectedDate({ children }: SelectedDateProps): ReactElement {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <SelectedDateCtx.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </SelectedDateCtx.Provider>
  );
}

export default memo(SelectedDate);
