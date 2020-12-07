import React, { memo, ReactElement, useRef, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import { CalendarDimensionsCtx, MonthControllerCtx } from '../../contexts';
import { MONTH_ORDER } from '../../consts';
import MonthWrapper from './MonthWrapper';

export type CalendarProps = {};

function Calendar({}: CalendarProps): ReactElement {
  const { updateWidth, isSet, getHeight } = useContext(CalendarDimensionsCtx);
  const { keys, monthForward, monthBack } = useContext(MonthControllerCtx);
  const viewPager = useRef<ViewPager>();
  return (
    <View
      style={{
        backgroundColor: 'lime',
        // alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flex: 1,
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
              height: getHeight(),
            },
          ]}
          initialPage={1}
          transitionStyle="curl"
          onPageScroll={({ nativeEvent: { offset, position } }): void => {
            if (position === 2 && offset === 0) {
              monthForward();
            } else if (position === 0 && offset === 0) {
              monthBack();
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
