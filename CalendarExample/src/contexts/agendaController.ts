import { createContext } from 'react';
import { AgendaListController } from '../utils';

export interface IAgendaControllerCtx {
  listController: AgendaListController | null;
}
export const AgendaControllerCtx = createContext<IAgendaControllerCtx>({
  listController: null,
});
