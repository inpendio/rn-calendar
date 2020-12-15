import React, {
  memo,
  ReactElement,
  useState,
  useContext,
  Children,
  isValidElement,
} from 'react';
import { BaseConfigCtx } from '../contexts';
import { TWeekDayIndexes } from '../utils';

export type BaseConfigProps = {
  startingDay?: number | string | TWeekDayIndexes;
};

function BaseConfig({
  children,
  startingDay,
}: BaseConfigProps & IBaseProps): ReactElement {
  console.log('@BaseConfig', {
    children,
    React,
    charr: Children.toArray(children),
  });
  const [startingDayIndex /* , setStartingDayIndex */] = useState(
    (startingDay || 0) as TWeekDayIndexes
  );
  return (
    <BaseConfigCtx.Provider value={{ startingDayIndex }}>
      {children}
    </BaseConfigCtx.Provider>
  );
}

export default memo(BaseConfig);
