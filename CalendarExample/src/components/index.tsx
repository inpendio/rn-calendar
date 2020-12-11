import React, { ReactElement, memo } from 'react';
import NakedCalendar from './Calendar/Calendar';
import WeekWrapper from './Calendar/WeekWrapper';
import MonthWrapper from './Calendar/MonthWrapper';

import NakedAgenda from './Agenda/Agenda';
import AgendaItem from './Agenda/Item';

import DimensionWrapper from '../containers/CalendarDimensions';
import AgendaController from '../containers/AgendaListController';

function CalendarWithDimension(): ReactElement {
  return (
    <DimensionWrapper key="prepack_calendar_dimension_provider">
      <NakedCalendar />
    </DimensionWrapper>
  );
}
function AgendaWithController(): ReactElement {
  return (
    <AgendaController key="prepack_agenda_controller_provider">
      <NakedAgenda />
    </AgendaController>
  );
}

const Calendar = memo(CalendarWithDimension);
const Agenda = memo(AgendaWithController);

export { Calendar, WeekWrapper, MonthWrapper, Agenda, AgendaItem, NakedAgenda };
