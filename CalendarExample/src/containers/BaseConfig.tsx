import React, { memo, ReactElement, useState } from 'react';
import { BaseConfigCtx } from '../contexts';
import { TWeekDayIndexes } from '../utils';

export type BaseConfigProps = {
  children: ReactElement | ReactElement[];
  startingDay?: number | string;
};

function BaseConfig({ children }: BaseConfigProps): ReactElement {
  const [startingDayIndex /* , setStartingDayIndex */] = useState(
    0 as TWeekDayIndexes
  );
  return (
    <BaseConfigCtx.Provider value={{ startingDayIndex }}>
      {children}
    </BaseConfigCtx.Provider>
  );
}

export default memo(BaseConfig);
