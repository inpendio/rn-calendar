import React, { memo, ReactElement } from 'react';
import DayController, { DayControllerProps } from './DayController';
import MonthController, { MonthControllerProps } from './MonthController';
import BaseConfig, { BaseConfigProps } from './BaseConfig';
import { parseDay, parseMonth } from '../utils';

export type WrapperProps = BaseConfigProps &
  IBaseProps &
  DayControllerProps &
  MonthControllerProps & {
    minDate?: Date | undefined | string;
    maxDate?: Date | undefined | string;
  };

function Wrapper(props: WrapperProps): ReactElement {
  const {
    startingDay,
    children,
    minDate,
    maxDate,
    minMonth,
    maxMonth,
    pastScrollRange,
    futureScrollRange,
  } = props;
  return (
    <BaseConfig startingDay={startingDay} key="BaseConfig-providerComponents">
      <MonthController
        key="MonthController-providerComponents"
        maxMonth={parseMonth(maxMonth)}
        minMonth={parseMonth(minMonth)}
        pastScrollRange={pastScrollRange}
        futureScrollRange={futureScrollRange}
      >
        <DayController
          key="DayController-providerComponents"
          minDate={parseDay(minDate)}
          maxDate={parseDay(maxDate)}
        >
          {children}
        </DayController>
      </MonthController>
    </BaseConfig>
  );
}

export default memo(Wrapper);

/* 
<CalendarDimensions key="CalendarDimensions-providerComponents">
            <AgendaListWrapper key="AgendaListWrapper-providerComponents">
              {children}
            </AgendaListWrapper>
          </CalendarDimensions>
*/
