import React, { memo, ReactElement } from 'react';
import SelectedDate from './SelectedDate';
import MonthController from './MonthController';
import BaseConfig from './BaseConfig';
import CalendarDimensions from './CalendarDimensions';

export type WrapperProps = {
  children: ReactElement | ReactElement[];
};

function Wrapper(props: WrapperProps): ReactElement {
  console.log(props);
  return (
    <BaseConfig>
      <MonthController>
        <CalendarDimensions>
          <SelectedDate>{props.children}</SelectedDate>
        </CalendarDimensions>
      </MonthController>
    </BaseConfig>
  );
}

export default memo(Wrapper);
