import { RefObject, createRef } from 'react';
import { FlatList } from 'react-native';
import { LIST_CONF } from '../consts';
import { AgendaItemController } from './agendaItemControllerClass';
import { AgendaRespondController } from './agendaRespondClass';
import { AgendaScrollController } from './agendaScrollClass';

import { Month } from './monthClass';
import { Callback, IOnViewItemChangeArgs, LockingAction } from './types';

interface IApiFields {
  onDayChange: Callback<Date>;
  onDaySettled: Callback<Date>;
}

export class AgendaListController {
  #itemController: AgendaItemController;

  #scrollController: AgendaScrollController;

  #respondController: AgendaRespondController;

  forMonth: string;

  month: Month;

  #ready: boolean = false;

  #listRef: RefObject<FlatList<any>> = createRef<FlatList<any>>();

  #lockers: Set<LockingAction> = new Set();

  #timer: number = 0;

  #apiFields: IApiFields = {
    onDayChange: () => {},
    onDaySettled: () => {},
  };

  constructor(month: Month) {
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
    this.#scrollController.onLockListener(this.lockListener);
    this.#respondController.onLockListener(this.lockListener);
  }

  private onReadyCheck = (): void => {
    if (this.#itemController.isReady && this.#listRef.current) {
      this.#ready = true;
    }
  };

  private lockListener = (isLocked: boolean, caller: LockingAction): void => {
    this.#lockers.forEach((locker) => {
      if (locker !== caller && isLocked) locker.lock();
      else if (locker !== caller && !isLocked) locker.unlock();
    });
  };

  /**
   * This is used to repeat action that could not be triggered for some reason immediately.
   * Only one action is accepted ( last one)
   * @param func
   * @param time
   * @param args
   */
  private tick = (func: Function, time: number, ...args: any[]): void => {
    clearTimeout(this.#timer);
    this.#timer = setTimeout(func, time, ...args);
  };

  scrollToIndex = (index): void => {
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
  onViewableItemsChanged = ({ viewableItems }: IOnViewItemChangeArgs): void => {
    this.#respondController.onViewableItemsChanged();
    this.#scrollController.onViewableItemsChanged();

    if (viewableItems.length && this.#scrollController.isActive) {
      const { item } = viewableItems[0];
      const { date } = item;
      this.#apiFields.onDayChange(date);
    }
  };

  get flatListProps(): any {
    return {
      viewabilityConfig: LIST_CONF.VIEWABILITY_CONF,
      key: this.key,
      onViewableItemsChanged: this.onViewableItemsChanged,

      onScroll: (): void => {
        this.#respondController.onScroll();
        this.#scrollController.onScroll();
      },
      // called when fingers starts drag
      onScrollBeginDrag: (): void => {
        this.#respondController.onScrollBeginDrag();
        this.#scrollController.onScrollBeginDrag();
      },
      // called when finger drag ends ( finger is lifted)
      onMomentumScrollEnd: (): void => {
        this.#respondController.onMomentumScrollEnd();
        this.#scrollController.onMomentumScrollEnd();
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
