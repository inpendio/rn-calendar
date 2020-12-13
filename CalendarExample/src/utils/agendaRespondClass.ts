import { RefObject /* , createRef  */ } from 'react';
import {
  //   ViewToken,
  FlatList,
  //   LayoutChangeEvent,
  //   LayoutRectangle,
  // ViewabilityConfig,
  // ViewabilityConfigCallbackPair,
} from 'react-native';
// import invariant from 'ts-invariant';
// import { LIST_CONF } from '../consts';
import { LockingAction } from './classHelpers';

// import { Month } from './monthClass';
import { Callback /* , ItemSelectedCallback */ } from './types';

export class AgendaRespondController implements LockingAction {
  // flatListProps:any = {};

  #locked: boolean = false;

  #isRunning: boolean = false;

  //   #onEndAction: Callback<void> = () => {};

  #lockListener: Callback<boolean> = () => {};

  #listRef: RefObject<FlatList<any>>;

  #unlockTimer: number = 0;

  constructor(list: RefObject<FlatList<any>>) {
    this.#listRef = list;
  }

  private notifyLockListener = (): void => {
    this.#lockListener(this.#isRunning);
  };

  private debouncedUnlocker = (time = 40): void => {
    clearTimeout(this.#unlockTimer);
    // @ts-ignore
    this.#unlockTimer = setTimeout(this.endRun, time);
  };

  private startRun = (): void => {
    this.#isRunning = true;
    this.notifyLockListener();
  };

  private endRun = (): void => {
    this.#isRunning = false;
    this.notifyLockListener();
  };

  scrollToOffset = (offset: number): void => {
    if (this.isLocked) return;
    this.startRun();
    this.#listRef.current?.scrollToOffset({ offset });
    this.debouncedUnlocker();
  };

  get isLocked(): boolean {
    return this.#locked;
  }

  // #region overrides
  lock = (): void => {
    this.#locked = true;
    console.log(
      '_________________________________ RESPONDER LOCKED ______________________________'
    );
  };

  unlock = (): void => {
    this.#locked = false;
    console.log(
      '_________________________________ RESPONDER UNLOCKED ______________________________'
    );
  };

  onLockListener = (cb): void => {
    this.#lockListener = cb;
  };

  // #region flatList props
  onViewableItemsChanged = (): void => {
    if (!this.#isRunning || this.#locked) return;
    this.debouncedUnlocker();
  };

  onScroll = (): void => {};

  onScrollBeginDrag = (): void => {};

  onMomentumScrollEnd = (): void => {};

  onScrollEndDrag = (): void => {};

  onMomentumScrollBegin = (): void => {};
  // #endregion
  // #endregion
}
