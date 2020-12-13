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
import { LockingAction } from './classHelpers';

import { Month } from './monthClass';
import { Callback, ItemSelectedCallback } from './types';

type ScrollToOffsetFunc = () => void;
type CalculatedScrollToOffsetFunc = () => void;

type QueueFuncTypes = ScrollToOffsetFunc | CalculatedScrollToOffsetFunc;

interface IOnViewItemChangeInfo {
  viewableItems: Array<ViewToken>;
  changed: Array<ViewToken>;
  //   viewabilityConfig: ViewabilityConfig;
}

type OnChangeArgs = {
  date: Date;
  rawData: IOnViewItemChangeInfo;
};

export class AgendaListController {
  #itemController: AgendaItemController;

  #scrollController: AgendaScrollController;

  #respondController: AgendaRespondController;

  forMonth: string;

  month: Month;

  #ready: boolean = true;

  #listRef: RefObject<FlatList<any>> = createRef<FlatList<any>>();

  #lockers: Set<LockingAction> = new Set();

  #locked: boolean = false;

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
    this.#scrollController.onLockListener(
      this.lockListener(this.#scrollController)
    );
    console.log('~ ~ ~ ~ ~ @CONSTRUCTOR', month.label, caller);
  }

  private onReadyCheck = (): void => {
    if (!this.#itemController.isReady && this.#listRef.current)
      this.#ready = true;
  };

  private lockListener = (caller: LockingAction) => {
    return (isLocked: boolean): void => {
      this.#locked = isLocked;
      this.#lockers.forEach((la) => {
        if (la !== caller && isLocked) la.lock();
        else if (la !== caller && !isLocked) la.unlock();
      });
    };
  };

  // #region  public

  scrollToIndex = (index): void => {
    if (!this.#ready) setTimeout(this.scrollToIndex, 50, index);
    this.#respondController.scrollToOffset(
      this.#itemController.getOffset(index)
    );
  };

  onLayoutForIndex = (index): any =>
    this.#itemController.onLayoutForIndex(index);

  get listRef(): RefObject<FlatList<any>> {
    console.log('@listRef/get:: called');
    // this.#listReady = true;
    // this.onReadyCheck();
    return this.#listRef;
  }

  get key(): string {
    return `AgendaList${this.forMonth}`;
  }

  get flatListProps(): any {
    return {
      viewabilityConfig: LIST_CONF.VIEWABILITY_CONF,
      key: this.key,

      onViewableItemsChanged: (/* info */): void => {
        this.#respondController.onViewableItemsChanged();
        this.#scrollController.onViewableItemsChanged();
      },
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
