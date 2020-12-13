/* eslint-disable import/prefer-default-export */

import { Callback } from './types';

export interface IDateComponent {
  date: Date;
  keyExtender?: string;
}
export abstract class DateComponent {
  date: Date = new Date();

  keyExtender: string = '';

  key: string = '';

  type: string = '';

  constructor({ date }: IDateComponent) {
    this.date = date;
  }
}

export interface LockingAction {
  lock: () => void;
  unlock: () => void;
  // run: (callback: Callback<void>) => void;
  // onEnd: () => void;

  onLockListener: (callback: Callback<void>) => void;

  // flatListProps: any;

  onViewableItemsChanged: (any) => void;
  onScroll: (any) => void;
  onScrollBeginDrag: (any) => void;
  onMomentumScrollEnd: (any) => void;
  onScrollEndDrag: (any) => void;
  onMomentumScrollBegin: (any) => void;
}
