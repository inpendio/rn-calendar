import { RefObject /* , createRef */ } from 'react';
import {
  //   ViewToken,
  FlatList,
  //   LayoutChangeEvent,
  //   LayoutRectangle,
  // ViewabilityConfig,
  // ViewabilityConfigCallbackPair,
} from 'react-native';
import invariant from 'ts-invariant';
// import { LIST_CONF } from '../consts';
import { LockingAction } from './classHelpers';

// import { Month } from './monthClass';
import { Callback /* , ItemSelectedCallback  */ } from './types';

export class AgendaScrollController implements LockingAction {
  #isDrag: boolean = false;

  #locked: boolean = false;

  #onEndAction: Callback<void> = (): void => {};

  #lockListener: Callback<boolean> = (): void => {};

  #listRef: RefObject<FlatList<any>>;

  constructor(list: RefObject<FlatList<any>>) {
    this.#listRef = list;
  }

  private onEnd = (): void => {
    this.#onEndAction();
  };

  private notifyLockListener = (): void => {
    this.#lockListener(this.#isDrag);
  };

  private onDragStart = (): void => {
    invariant(this.#locked, 'Controller is locked, drag should be disabled');
    this.#isDrag = true;
    this.notifyLockListener();
  };

  private onDragEnd = (): void => {
    invariant(this.#locked, 'Controller is locked, drag should be disabled');
    if (this.#isDrag) this.#isDrag = false;
    this.notifyLockListener();
  };

  // #region overrides

  onLockListener = (cb): void => {
    this.#lockListener = cb;
  };

  lock = (): void => {
    this.#locked = true;
    this.#listRef.current?.setNativeProps({
      scrollEnabled: false,
    });
    console.log(
      '_________________________________ SCROLL LOCKED ______________________________'
    );
  };

  unlock = (): void => {
    this.#locked = false;
    this.#listRef.current?.setNativeProps({
      scrollEnabled: true,
    });
    console.log(
      '_________________________________ SCROLL UNLOCKED ______________________________'
    );
  };

  // #region flatList props

  onScroll = (/* { nativeEvent } */): void => {
    // console.log('@onScroll', nativeEvent);
    if (this.#locked) {
      //   this.debouncedUnlocker(40);
    } else {
      // console.log('@onScroll', nativeEvent);
    }
  };

  onViewableItemsChanged = (): void => {};

  onScrollBeginDrag = ({ nativeEvent }): void => {
    console.log('@onScrollBeginDrag', nativeEvent);
    this.onDragStart();
  };

  onMomentumScrollEnd = ({ nativeEvent }): void => {
    console.log('@onMomentumScrollEnd', { nativeEvent });
    this.onDragEnd();
  };

  onScrollEndDrag = (): void => {};

  onMomentumScrollBegin = (): void => {};
}