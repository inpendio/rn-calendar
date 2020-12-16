import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useContext,
} from 'react';
import { MonthControllerCtx, AgendaControllerCtx } from '../contexts';
import { AgendaListController } from '../utils';

export interface IAgendaControllerProps {}

function AgendaListWrapper({
  children,
}: IAgendaControllerProps & IBaseProps): ReactElement {
  const { currentMonth } = useContext(MonthControllerCtx);
  const [controller, setController] = useState<AgendaListController | null>(
    null
  );

  useEffect(() => {
    setController(new AgendaListController(currentMonth));
  }, [currentMonth]);

  return (
    <AgendaControllerCtx.Provider
      value={{
        listController: controller,
      }}
    >
      {children}
    </AgendaControllerCtx.Provider>
  );
}

export default memo(AgendaListWrapper);
