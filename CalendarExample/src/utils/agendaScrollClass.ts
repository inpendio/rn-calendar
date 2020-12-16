import { RefObject } from 'react';
import { FlatList } from 'react-native';
import invariant from 'ts-invariant';
import { LockingAction, LockCallback } from './types';

export class AgendaScrollController implements LockingAction {
  #isDrag: boolean = false;

  #locked: boolean = false;

  #lockListener: LockCallback = () => {};

  #listRef: RefObject<FlatList<any>>;

  constructor(list: RefObject<FlatList<any>>) {
    this.#listRef = list;
  }

  private notifyLockListener = (): void => {
    this.#lockListener(this.#isDrag, this);
  };

  private onDragStart = (): void => {
    invariant(!this.#locked, 'Controller is locked, drag should be disabled');
    this.#isDrag = true;
    this.notifyLockListener();
  };

  private onDragEnd = (): void => {
    invariant(!this.#locked, 'Controller is locked, drag should be disabled');

    if (this.#isDrag) {
      // because onViewableItemsChanged is called a tick later then onScrollDragEnd/onMomentumScrollEnd
      // we call unlock through timeout
      // this way AgendaController will still think that user is dragging and will call onViewableItemsChanged
      // check AgendaListController/onViewableItemsChanged
      setTimeout(() => {
        this.#isDrag = false;
        this.notifyLockListener();
      }, 50);
    }
  };

  get isActive(): boolean {
    return this.#isDrag;
  }

  // #region overrides

  onLockListener = (cb): void => {
    this.#lockListener = cb;
  };

  lock = (): void => {
    this.#locked = true;
    this.#listRef.current?.setNativeProps({
      scrollEnabled: false,
    });
  };

  unlock = (): void => {
    this.#locked = false;
    this.#listRef.current?.setNativeProps({
      scrollEnabled: true,
    });
  };

  // #region flatList props

  onScroll = (): void => {};

  onViewableItemsChanged = (): void => {};

  onScrollBeginDrag = (): void => {
    this.onDragStart();
  };

  onMomentumScrollEnd = (): void => {
    this.onDragEnd();
  };

  onScrollEndDrag = (): void => {};

  onMomentumScrollBegin = (): void => {};
}
