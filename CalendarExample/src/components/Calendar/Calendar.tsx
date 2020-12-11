import React, { memo, ReactElement, useRef, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import { CalendarDimensionsCtx, MonthControllerCtx } from '../../contexts';
import { MONTH_ORDER } from '../../consts';
import MonthWrapper from './MonthWrapper';

export type CalendarProps = {};

function Calendar({}: CalendarProps): ReactElement {
  const { updateWidth, isSet, getHeight, height } = useContext(
    CalendarDimensionsCtx
  );
  const { keys, monthForward, monthBack } = useContext(MonthControllerCtx);
  const viewPager = useRef<ViewPager>();
  return (
    <View
      style={{
        backgroundColor: 'lime',
        // alignItems: 'flex-start',
        // justifyContent: 'flex-start',
        // flex: 1,
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
              // maxHeight:height
              height,
            },
          ]}
          initialPage={1}
          transitionStyle="curl"
          onPageScroll={({ nativeEvent }): void => {
            // console.log(nativeEvent);
            const { offset, position } = nativeEvent;
            if (offset !== 0) return;
            if (position === 2) {
              console.log('POS--> 2');
              monthForward();
            } else if (position === 0) {
              console.log('POS--> 0');
              monthBack();
            } else if (position === 1) {
              console.log('POS--> 1', viewPager);
            } else {
              console.log('sve ostalo');
            }
          }}
          // onPageSelected={({ nativeEvent }): void => {
          //   console.log(nativeEvent, keys);
          // }}
          // onPageScrollStateChanged={({ nativeEvent }): void => {
          //   console.log(nativeEvent, keys);
          // }}
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
