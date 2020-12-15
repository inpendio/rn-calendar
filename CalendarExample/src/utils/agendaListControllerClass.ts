import { RefObject, createRef } from 'react';
import {
  ViewToken,
  FlatList,
  LayoutChangeEvent,
  LayoutRectangle,
  // ViewabilityConfig,
  // ViewabilityConfigCallbackPair,
} from 'react-native';
import { LIST_CONF } from '../consts';
import { AgendaItemController } from './agendaItemControllerClass';
import { AgendaRespondController } from './agendaRespondClass';
import { AgendaScrollController } from './agendaScrollClass';
import { Day } from './dayClass';
// import {  } from './classHelpers';

import { Month } from './monthClass';
import {
  Callback,
  IOnViewItemChangeArgs,
  LockingAction,
  ViewTokenPrecise,
} from './types';
// import { Callback, ItemSelectedCallback } from './types';

// type ScrollToOffsetFunc = () => void;
// type CalculatedScrollToOffsetFunc = () => void;

// type QueueFuncTypes = ScrollToOffsetFunc | CalculatedScrollToOffsetFunc;

// type OnChangeArgs = {
//   date: Date;
//   rawData: IOnViewItemChangeInfo;
// };

// class AgendaListControllerPublicFieldHolder

interface IApiFields {
  onDayChange: Callback<Date>;
  onDaySettled: Callback<Date>;
}

export class AgendaListController /* implements LockingAction */ {
  #itemController: AgendaItemController;

  #scrollController: AgendaScrollController;

  #respondController: AgendaRespondController;

  forMonth: string;

  month: Month;

  #ready: boolean = false;

  #listRef: RefObject<FlatList<any>> = createRef<FlatList<any>>();

  #lockers: Set<LockingAction> = new Set();

  // #lockListener: LockCallback = () => {};

  #locked: boolean = true;

  #timer: number = 0;

  #apiFields: IApiFields = {
    onDayChange: () => {},
    onDaySettled: () => {},
  };

  constructor(month: Month, caller?: string) {
    this.forMonth = month.label;
    this.month = month;
    this.#itemController = new AgendaItemController(
      month.days.length,
      this.onReadyCheck
    );
    this.#scrollController = new AgendaScrollController(this.#listRef);
    this.#respondController = new AgendaRespondController(this.#listRef);
    this.#lockers.add(this.#scrollController);
    this.#lockers.add(this.#respondController);
    // this.#lockers.add(this);
    this.#scrollController.onLockListener(this.lockListener);
    this.#respondController.onLockListener(this.lockListener);
    // this.onLockListener(this.lockListener);
    console.log('~ ~ ~ ~ ~ @CONSTRUCTOR', month.label, caller);
  }

  // private notifyLockListener = (): void => {
  //   this.#lockListener(this.#locked, this);
  // };

  private onReadyCheck = (): void => {
    console.log('@onReadyCheck');
    if (this.#itemController.isReady && this.#listRef.current) {
      this.#ready = true;
      // this.notifyLockListener();
      // this.unlock();
    }
  };

  private lockListener = (isLocked: boolean, caller: LockingAction): void => {
    console.log('@lockListener');
    this.#locked = isLocked;
    this.#lockers.forEach((la) => {
      if (la !== caller && isLocked) la.lock();
      else if (la !== caller && !isLocked) la.unlock();
    });
  };

  /**
   * This is used to repeat action that could not be triggered for some reason immediately
   * @param func
   * @param time
   * @param args
   */
  private tick = (func: Function, time: number, ...args: any[]): void => {
    clearTimeout(this.#timer);
    this.#timer = setTimeout(func, time, ...args);
  };

  scrollToIndex = (index): void => {
    console.log(
      '@scrollToIndex',
      index,
      this.#ready,
      this.#respondController.isLocked
    );
    if (!this.#ready || this.#respondController.isLocked)
      // we still want to call this, after things are unlocked/ready
      this.tick(this.scrollToIndex, 50, index);
    else {
      this.#respondController.scrollToOffset(
        this.#itemController.getOffset(index)
      );
      this.#apiFields.onDaySettled(this.month.days[index].date);
    }
  };

  set onDayChange(cb: Callback<Date>) {
    this.#apiFields.onDayChange = cb;
  }

  set onDaySettled(cb: Callback<Date>) {
    this.#apiFields.onDaySettled = cb;
  }

  onLayoutForIndex = (index): any =>
    this.#itemController.onLayoutForIndex(index);

  get listRef(): RefObject<FlatList<any>> {
    console.log('@listRef/get:: called');
    // this.#listReady = true;
    // this.onReadyCheck();
    return this.#listRef;
  }

  get key(): string {
    return `AgendaList_${this.forMonth}`;
  }

  /**
   * Will call onViewableItemsChanged of child controllers.
   * This action is called on any view change, whether it is triggered by user or we programmatically triggered view changes.
   * If there are visible items, and action was caused by user (drag), it will then call onDayChange callback
   * We need to prevent calling onDayChange if we previously called scrollToIndex ( as scrolling programmatically will also trigger onViewableItemsChanged)
   * @param param0 IOnViewItemChangeArgs
   */
  onViewableItemsChanged = ({
    viewableItems,
    changed,
  }: IOnViewItemChangeArgs): void => {
    console.log('@onViewableItemsChanged', this.#scrollController.isActive, {
      viewableItems,
      changed,
    });

    this.#respondController.onViewableItemsChanged();
    this.#scrollController.onViewableItemsChanged();

    if (viewableItems.length && this.#scrollController.isActive) {
      const { item } = viewableItems[0];
      const { date } = item;
      console.log('@onViewableItemsChanged/onDayChange', date);
      this.#apiFields.onDayChange(date);
    }
  };

  // onScroll = (): void => {};

  // onScrollBeginDrag = (): void => {};

  // onMomentumScrollEnd = (): void => {};

  // onScrollEndDrag = (): void => {};

  // onMomentumScrollBegin = (): void => {};

  get flatListProps(): any {
    return {
      viewabilityConfig: LIST_CONF.VIEWABILITY_CONF,
      key: this.key,
      onViewableItemsChanged: this.onViewableItemsChanged,

      /* onViewableItemsChanged: (info): void => {
        this.onViewableItemsChanged(info);
        // this.#respondController.onViewableItemsChanged();
        // this.#scrollController.onViewableItemsChanged();
      }, */
      onScroll: (): void => {
        this.#respondController.onScroll();
        this.#scrollController.onScroll();
      },
      // called when fingers starts drag
      onScrollBeginDrag: (event): void => {
        this.#respondController.onScrollBeginDrag();
        this.#scrollController.onScrollBeginDrag(event);
      },
      // called when finger drag ends ( finger is lifted)
      onMomentumScrollEnd: (event): void => {
        this.#respondController.onMomentumScrollEnd();
        this.#scrollController.onMomentumScrollEnd(event);
      },
      // finger is lifted, but view is still scrolling
      onScrollEndDrag: (): void => {
        this.#respondController.onScrollEndDrag();
        this.#scrollController.onScrollEndDrag();
      },
      // scrolling stopped
      onMomentumScrollBegin: (): void => {
        this.#respondController.onMomentumScrollBegin();
        this.#scrollController.onMomentumScrollBegin();
      },
    };
  }

  // #endregion
}
