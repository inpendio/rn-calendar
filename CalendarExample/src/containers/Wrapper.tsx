import React, { memo, ReactElement } from 'react';
import DayController, { DayControllerProps } from './DayController';
import MonthController, { MonthControllerProps } from './MonthController';
import BaseConfig, { BaseConfigProps } from './BaseConfig';
import CalendarDimensions from './CalendarDimensions';
import { parseDay, parseMonth } from '../utils';

export type WrapperProps = BaseConfigProps &
  IBaseProps &
  DayControllerProps &
  MonthControllerProps & {
    minDate?: Date | undefined | string;
    maxDate?: Date | undefined | string;
  };

function Wrapper(props: WrapperProps): ReactElement {
  console.log(props);
  const { startingDay, children, minDate, maxDate, minMonth, maxMonth } = props;
  return (
    <BaseConfig startingDay={startingDay}>
      <MonthController
        maxMonth={parseMonth(maxMonth)}
        minMonth={parseMonth(minMonth)}
      >
        <CalendarDimensions>
          <DayController
            minDate={parseDay(minDate)}
            maxDate={parseDay(maxDate)}
          >
            {children}
          </DayController>
        </CalendarDimensions>
      </MonthController>
    </BaseConfig>
  );
}

export default memo(Wrapper);
