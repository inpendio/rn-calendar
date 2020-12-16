import React, {
  memo,
  ReactElement,
  useRef,
  useContext,
  RefObject,
} from 'react';
import { View, StyleSheet } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import { CalendarDimensionsCtx, MonthControllerCtx } from '../../contexts';
import { MONTH_ORDER } from '../../consts';
import MonthWrapper from './MonthWrapper';

export type CalendarProps = {};

function Calendar(): ReactElement {
  const { updateWidth, isSet, height } = useContext(CalendarDimensionsCtx);
  const { keys, monthForward, monthBack } = useContext(MonthControllerCtx);
  const viewPager = useRef<RefObject<ViewPager>>();
  return (
    <View
      style={{
        backgroundColor: 'lime',
        flexGrow: 0,
        flexShrink: 1,
      }}
      pointerEvents="box-none"
    >
      {isSet ? (
        <ViewPager
          ref={viewPager}
          style={[
            {
              flexShrink: 1,
              backgroundColor: 'wheat',
              height,
            },
          ]}
          initialPage={1}
          transitionStyle="curl"
          onPageScroll={({ nativeEvent }): void => {
            const { offset, position } = nativeEvent;
            if (offset !== 0) return;
            if (position === 2) {
              monthForward();
            } else if (position === 0) {
              monthBack();
            } else if (position === 1) {
              // TODO:
            } else {
              // any other situations
            }
          }}
          orientation="horizontal"
          scrollEnabled
        >
          <MonthWrapper key={keys.past} order={MONTH_ORDER.PAST} />
          <MonthWrapper key={keys.present} order={MONTH_ORDER.PRESENT} />
          <MonthWrapper key={keys.future} order={MONTH_ORDER.FUTURE} />
        </ViewPager>
      ) : (
        <MonthWrapper
          key={keys.present}
          order={MONTH_ORDER.PRESENT}
          style={{ borderColor: 'red', borderWidth: 1 }}
        />
      )}
      <View
        style={[StyleSheet.absoluteFill]}
        pointerEvents="none"
        key="Calendar-width-probe"
        onLayout={updateWidth()}
      />
    </View>
  );
}

export default memo(Calendar);
