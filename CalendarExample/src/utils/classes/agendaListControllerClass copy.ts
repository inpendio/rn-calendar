import { RefObject, createRef } from 'react';
import {
  ViewToken,
  FlatList,
  LayoutChangeEvent,
  LayoutRectangle,
  // ViewabilityConfig,
  // ViewabilityConfigCallbackPair,
} from 'react-native';
import { LIST_CONF } from '../../consts';

import { Month } from './monthClass';
import { Callback, ItemSelectedCallback } from '../types';

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
  rowLayouts: Map<number, LayoutRectangle> = new Map();

  forMonth: string;

  month: Month;

  #listRef: RefObject<FlatList<any>> = createRef<FlatList<any>>();

  //   #list: FlatList<any> | null = null;

  #daysInMonth: number;

  #rowsReady: boolean = false;

  #listReady: boolean = false;

  #queue: QueueFuncTypes[] = [];

  #queueTimer: number = 0;

  #isLocked: boolean = false;

  #isDrag: boolean = false;

  #unlockTimer: number = 0;

  #selecterTime: number = 0;

  #onItemSelectedListeners: Set<Callback<IOnViewItemChangeInfo>> = new Set();

  #onItemViewChangedListeners: Set<Callback<OnChangeArgs>> = new Set();

  constructor(month: Month, caller?: string) {
    this.forMonth = month.label;
    this.month = month;
    this.#daysInMonth = month.days.length;
    // this.#list = this.#listRef.current;
    console.log('~ ~ ~ ~ ~ @CONSTRUCTOR', month.label, caller);
  }

  private recheckReady = (): void => {
    if (!this.#listReady && this.#listRef.current) this.#listReady = true;
  };

  private lock = (): void => {
    this.#isLocked = true;

    // this.#listRef.current?.setNativeProps({
    //   scrollEnabled: false,
    // });
    // console.log(
    //   '_________________________________ LOCKED ______________________________'
    // );
  };

  private unlock = (): void => {
    this.#isLocked = false;

    // this.#listRef.current?.setNativeProps({
    //   scrollEnabled: true,
    // });
    // console.log(
    //   '_________________________________ UNLOCKED ______________________________'
    // );
  };

  private dragLock = (): void => {
    this.#isDrag = false;
  };

  private dragUnlock = (): void => {
    this.#isDrag = false;
  };

  #runQueue = (): void => {
    console.log(
      '@#runQueue',
      this.#queue.length,
      this.#rowsReady,
      this.#listReady
    );
    if (this.#queue.length === 0) return;
    if (!this.#listRef.current) console.log('_____   NOT READY   _____');
    if (this.#rowsReady && this.#listReady) {
      this.lock();
      while (this.#queue.length) {
        const exec = this.#queue.pop() as QueueFuncTypes;
        exec();
      }
      // console.log('native scroll::', {
      //   native: this.#listRef.current?.getNativeScrollRef(),
      //   responder: this.#listRef.current?.getScrollResponder(),
      // });

      this.debouncedUnlocker();
    } else {
      if (this.#queueTimer) clearTimeout(this.#queueTimer);
      // @ts-ignore
      this.#queueTimer = setTimeout(this.#runQueue, 100);
    }
  };

  private calculateOffset = (index: number): number => {
    let offset = 0;
    for (let i = 0; i <= index - 1; i++) {
      offset += this.rowLayouts.get(i)?.height ?? 0;
    }

    return offset;
  };

  private scrollListTo = (offset: number): void => {
    if (!this.#listRef.current)
      console.log('@scrollListTo_____   NOT READY   _____listRef');
    this.#listRef.current?.scrollToOffset({ offset });
  };

  private notifySelectedListeners = (data): void => {
    this.#onItemSelectedListeners.forEach((cb) => {
      cb(data);
    });
  };

  private notifyOnChangeListeners = (data): void => {
    this.#onItemViewChangedListeners.forEach((cb) => {
      cb(data);
    });
  };

  private selectItem = ({
    viewableItems,
    changed,
  }: IOnViewItemChangeInfo): void => {
    console.log('@selectItem', { viewableItems, changed });
    if (viewableItems.length > 0 && !this.#isLocked) {
      const {
        index,
        item: { date },
      } = viewableItems[0];
      if (index || index === 0) {
        this.scrollToIndex(index);
        this.notifySelectedListeners(date);
      }
    }
  };

  private onChange = async ({
    viewableItems,
    changed,
  }: IOnViewItemChangeInfo): Promise<void> => {
    if (viewableItems.length > 0 && !this.#isLocked) {
      const { item } = viewableItems[0];
      const { date } = item;
      this.notifyOnChangeListeners({
        date,
        rawData: { viewableItems, changed },
      });
    }
  };

  private debouncedUnlocker = (time = 40): void => {
    clearTimeout(this.#unlockTimer);
    // @ts-ignore
    this.#unlockTimer = setTimeout(this.unlock, time);
  };

  private debouncedItemSelect = (info: IOnViewItemChangeInfo): void => {
    clearTimeout(this.#selecterTime);
    // @ts-ignore
    if (!this.#isDrag)
      this.#selecterTime = setTimeout(this.selectItem, 40, info);
    this.onChange(info);
  };

  private onItemViewChange = (info: IOnViewItemChangeInfo): void => {
    // const { viewableItems, changed /* viewabilityConfig */ } = info;
    if (this.#isLocked) {
      console.log('@onItemViewChange         #isLocked');
      // this.debouncedUnlocker(20);
    } else {
      console.log('FREEEEEEE', info);
      this.debouncedItemSelect(info);
    }
  };

  private onScroll = (/* { nativeEvent } */): void => {
    // console.log('@onScroll', nativeEvent);
    if (this.#isLocked) {
      this.debouncedUnlocker(40);
    } else {
      // console.log('@onScroll', nativeEvent);
    }
  };

  onLayoutForIndex = (index: number) => ({
    nativeEvent: { layout },
  }: LayoutChangeEvent): void => {
    this.rowLayouts.set(index, layout);
    if (this.rowLayouts.size >= this.#daysInMonth - 1) this.#rowsReady = true;
    this.recheckReady();
  };

  scrollToIndex = (index: number): void => {
    console.log('@scrollToIndex', index, this);
    if (this.#isDrag) return;
    this.lock();
    this.#queue.push(() => {
      this.scrollListTo(this.calculateOffset(index));
    });
    // this.lock();
    this.#runQueue();
  };

  get key(): string {
    return `AgendaList${this.forMonth}`;
  }

  get listRef(): RefObject<FlatList<any>> {
    console.log('@listRef/get:: called');
    this.#listReady = true;
    this.recheckReady();
    return this.#listRef;
  }

  addOnItemSelected = (callback?: ItemSelectedCallback): void => {
    if (callback) this.#onItemSelectedListeners.add(callback);
  };

  addOnItemViewChanged = (callback?: ItemSelectedCallback): void => {
    if (callback) this.#onItemViewChangedListeners.add(callback);
  };

  get flatListProps(): any {
    return {
      viewabilityConfig: LIST_CONF.VIEWABILITY_CONF,
      onViewableItemsChanged: this.onItemViewChange,
      key: this.key,
      onScroll: this.onScroll,
      // called when fingers starts drag
      onScrollBeginDrag: ({ nativeEvent }): void => {
        console.log('@onScrollBeginDrag', nativeEvent);
        this.#isDrag = true;
      },
      // called when finger drag ends ( finger is lifted)
      onMomentumScrollEnd: ({ nativeEvent }): void => {
        console.log('@onMomentumScrollEnd', { nativeEvent });
        if (this.#isDrag) this.#isDrag = false;
      },
      // finger is lifted, but view is still scrolling
      // onScrollEndDrag: ({ nativeEvent }): void => {
      //   console.log('@onScrollEndDrag', nativeEvent);
      // },
      // scrolling stopped
      // onMomentumScrollBegin: ({ nativeEvent }): void => {
      //   console.log('@onMomentumScrollBegin', { nativeEvent });
      // },
    };
  }
}
