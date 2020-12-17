import React, {
  memo,
  ReactElement,
  // useRef,
  useContext,
  // RefObject,
  // useEffect,
} from 'react';
import { View, StyleSheet/* , Platform */ } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import { CalendarDimensionsCtx, MonthControllerCtx } from '../../contexts';
import { MONTH_ORDER } from '../../consts';
import MonthWrapper from './MonthWrapper';

export type CalendarProps = {};

function Calendar(): ReactElement {
  const { updateWidth, isSet, height } = useContext(CalendarDimensionsCtx);
  const { keys, monthForward, monthBack, pagerPosition } = useContext(MonthControllerCtx);
  // on iOS ViewPager works a bit different. 
  // Instead of positioning to `initialPosition` before rendering, it renders normally and silently scrolls to desired position
  // this is a control element that helps skip action on initial render
  // const firstRun = useRef<number>(-1);

  // useEffect(() => {
  //   firstRun.current = -1;
  // }, [keys.viewPager]);


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
          key={keys.viewPager}
          // ref={viewPager}
          style={[
            {
              flexShrink: 1,
              backgroundColor: 'wheat',
              height,
            },
          ]}
          initialPage={pagerPosition}
          // transitionStyle="curl"
          onPageSelected={({ nativeEvent: { position } }): void => {
            console.log(position);
            if (position < pagerPosition) monthBack();
            else if (position > pagerPosition) monthForward();
          }}
          // onPageScroll={({ nativeEvent }): void => {
          //   const { offset, position } = nativeEvent;
          //   if (offset !== 0) return;
          //   if (position === 2) {
          //     console.log("%c @Calendar/ViewPager/onPageScroll", "color:#ed6623", position, offset, firstRun.current, keys.viewPager,);
          //     if (Platform.OS === 'ios' && firstRun.current < 1) {
          //       firstRun.current++;
          //       return;
          //     }

          //     monthForward();
          //   } else if (position === 0) {
          //     console.log("%c @Calendar/ViewPager/onPageScroll", "color:#ed6623", position, offset, firstRun.current, keys.viewPager);
          //     if (Platform.OS === 'ios' && firstRun.current < 1) {
          //       firstRun.current++;
          //       return;
          //     }
          //     monthBack();
          //   } else if (position === 1) {
          //     console.log("%c @Calendar/ViewPager/onPageScroll", "color:#ed6623", position, offset, firstRun.current, keys.viewPager);
          //     if (Platform.OS === 'ios' && firstRun.current < 1) {
          //       firstRun.current++;
          //       // return;
          //     }
          //     // TODO:
          //     // console.log("%c @Calendar/ViewPager/onPageScroll", "color:#ed6623", position, offset, nativeEvent,);
          //   } else {
          //     // any other situations
          //   }
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
