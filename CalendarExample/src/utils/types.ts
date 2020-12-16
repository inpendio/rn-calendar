import { ComponentType, ReactElement } from 'react';
import { ViewToken } from 'react-native';
import { Day } from './dayClass';

export type Callback<T> = (data: T) => void;
export type LockCallback = (T: boolean, caller: LockingAction) => void;

export interface LockingAction {
  lock: () => void;
  unlock: () => void;
  // run: (callback: Callback<void>) => void;
  // onEnd: () => void;

  onLockListener: (callback: LockCallback) => void;

  // flatListProps: any;

  onViewableItemsChanged: (any) => void;
  onScroll: (any) => void;
  onScrollBeginDrag: (any) => void;
  onMomentumScrollEnd: (any) => void;
  onScrollEndDrag: (any) => void;
  onMomentumScrollBegin: (any) => void;
}

export interface ViewTokenPrecise<T> extends ViewToken {
  item: T;
  key: string;
  index: number | null;
  isViewable: boolean;
  section?: any;
}

export type RenderFunction = (props: any) => ReactElement;
type RenderComponent = ComponentType<any>;

export type RenderProp = RenderFunction | RenderComponent;

export interface IOnViewItemChangeArgs {
  viewableItems: Array<ViewTokenPrecise<Day>>;
  changed: Array<ViewToken>;
  //   viewabilityConfig: ViewabilityConfig;
}

export type CalendarEvent = {
  title: string;
  startTime: Date;
  endTime?: Date;
  allDay?: boolean;
  data: any;
};
