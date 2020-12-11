import React, { memo, ReactElement, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Pressable,
  LayoutAnimation,
  NativeModules,
} from 'react-native';
import invariant from 'ts-invariant';
// import { PanGestureHandler, State } from 'react-native-gesture-handler';
import * as dateFns from 'date-fns';
import * as dateFnsConsts from 'date-fns/constants';
import ViewPager from '@react-native-community/viewpager';
import {
  getWeekDays,
  getShortName,
  getDayIndex,
  getWeekDaysFromIndex,
} from '../../utils';
import useStartingDayIndex from '../../utils/hooks/useStartingDayIndex';
import Agenda from '../Agenda';

const { UIManager } = NativeModules;

const FORMAT = 'MM-yyyy';
if (UIManager && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const {
  eachWeekOfInterval,
  startOfMonth,
  endOfMonth,
  getDate,
  addDays,
  subMonths,
  addMonths,
  getMonth,
  format,
  isSameDay,
  getDaysInMonth,
  setDate,
} = dateFns;
console.log({ dateFns, dateFnsConsts, NativeModules });

const Day = ({ date, isSelected }): ReactElement => {
  return (
    <View
      style={[
        { backgroundColor: 'teal', flex: 1 },
        isSelected ? { backgroundColor: 'blue', borderRadius: 50 } : {},
      ]}
    >
      <Text>{getDate(date)}</Text>
    </View>
  );
};

const WeekRow = ({ children, ...other }): ReactElement => (
  <View
    collapsable={false}
    style={{ flexDirection: 'row', justifyContent: 'space-between' }}
    {...other}
  >
    {children}
  </View>
);

const Month = ({
  date,
  style,
  startingDayIndex,
  keyExtender,
  selectedDate,
  updateHeight,
}): ReactElement => {
  const [weeksStartingDays, setWeeksStartingDays] = useState<Date[]>([]);
  const [rowHeight, setRowHeight] = useState(0);
  const [allHeight, setAllHeight] = useState(0);

  useEffect(() => {
    console.log(
      'overallheight::::',
      rowHeight + allHeight,
      !!allHeight && !!rowHeight,
      rowHeight,
      allHeight,
      weeksStartingDays.length
    );
    // update calendar height, normally 5 weeks in month, can be 6, we need max!
    if (!!allHeight && !!rowHeight)
      updateHeight(weeksStartingDays.length === 5 ? rowHeight : 0 + allHeight);
  }, [rowHeight, allHeight]);

  useEffect(() => {
    console.log('FIRST', { date, month: getMonth(date), weeksStartingDays });
    setWeeksStartingDays(
      eachWeekOfInterval(
        { start: startOfMonth(date), end: endOfMonth(date) },
        { weekStartsOn: startingDayIndex }
      )
    );
  }, []);

  const layoutUpdater = updateHeight
    ? ({
        nativeEvent: {
          layout: { x, y, width, height },
        },
      }): void => {
        console.log('MONTH:layout', { x, y, width, height });
        setAllHeight(height);
      }
    : undefined;

  return (
    <View
      onLayout={layoutUpdater}
      collapsable={false}
      style={[
        {
          backgroundColor: 'yellow',
          paddingHorizontal: 10,
          // justifyContent:'space-between'
          // marginVertical: 20,
          // flex:1

          // height:350,
          // flexGrow:1,
          // flexShrink:0,
        },
        style,
      ]}
    >
      <Text>{format(date, FORMAT)}</Text>
      <WeekRow>
        {getWeekDaysFromIndex(startingDayIndex).map((day) => {
          return (
            <Text style={{ flex: 1 }} key={`week_names_${day}_${keyExtender}`}>
              {getShortName(day)}
            </Text>
          );
        })}
      </WeekRow>
      {weeksStartingDays.map((wsd, i) => (
        <WeekRow
          key={`week_${getDate(wsd)}_${keyExtender}_${i + 1}`}
          onLayout={
            updateHeight && i === 0
              ? ({
                  nativeEvent: {
                    layout: { x, y, width, height },
                  },
                }): void => {
                  console.log('Row hight:', height);
                  setRowHeight(height);
                }
              : undefined
          }
        >
          {new Array(7).fill(0).map((_, i) => (
            <Day
              isSelected={isSameDay(selectedDate, addDays(wsd, i))}
              date={addDays(wsd, i)}
              key={i}
            />
          ))}
        </WeekRow>
      ))}
    </View>
  );
};

export type CalendarProps = {};

function Calendar(props: CalendarProps): ReactElement {
  const [availableWidth, setAvailableWidth] = useState(0);
  const [calendarHeight, setCalendarHeight] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [beforeDate, setBeforeDate] = useState(subMonths(currentDate, 1));
  const [afterDate, setAfterDate] = useState(addMonths(currentDate, 1));
  const [currentDateMonthFormated, setCurrentDateMonthFormated] = useState(
    format(currentDate, FORMAT)
  );
  const [beforeDateMonthFormated, setBeforeDateMonthFormated] = useState(
    format(beforeDate, FORMAT)
  );
  const [afterDateMonthFormated, setAfterDateMonthFormated] = useState(
    format(afterDate, FORMAT)
  );
  const startingDayIndex = useStartingDayIndex('tuesday');
  const xOffset = useRef(new Animated.Value(0));
  //   const xDrag = useRef(new Animated.Value(0));
  //   const xXX = useRef(new Animated.Value(0));
  //   const xVal = useRef(Animated.add(xDrag.current, xOffset.current));
  //   const panState = useRef(new Animated.Value(State.UNDETERMINED));
  //   const xValBefore = useRef(Animated.subtract(xVal.current,availableWidth));
  //   const xValAfter = useRef(Animated.add(xVal.current,availableWidth));

  const viewPager = useRef<ViewPager>();

  //   useEffect(()=>{
  //     LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  //   },[calendarHeight]);

  useEffect(() => {
    setBeforeDate(subMonths(currentDate, 1));
    setAfterDate(addMonths(currentDate, 1));
    setCurrentDateMonthFormated(format(currentDate, FORMAT));
    setBeforeDateMonthFormated(format(subMonths(currentDate, 1), FORMAT));
    setAfterDateMonthFormated(format(addMonths(currentDate, 1), FORMAT));
  }, [currentDate]);
  useEffect(() => {
    xOffset.current.extractOffset();
  }, [beforeDateMonthFormated]);

  //   const onGestureEvent = Animated.event(
  //     [
  //       {
  //         nativeEvent: {
  //           translationX: xDrag.current,
  //           state: panState.current,
  //         },
  //       },
  //     ],
  //     {
  //       useNativeDriver: true,
  //     //   listener:(a)=>{console.log(a);}
  //     }
  //   );

  //   const onHandlerStateChange = ({ nativeEvent }) => {
  //     if(nativeEvent.state === State.BEGAN){
  //       console.log('BEGAN',{nativeEvent,xOffset,xVal,xDrag,xXX});
  //     }
  //     if (nativeEvent.oldState === State.ACTIVE || nativeEvent.state===State.END) {
  //       const { velocityX, translationX } = nativeEvent;
  //       console.log({nativeEvent,velocityX,translationX,xOffset,xVal,xDrag});
  //       xOffset.current.extractOffset();
  //       //   xOffset.current.setValue(translationX);
  //       //   xOffset.current.flattenOffset();
  //       xDrag.current.setValue(0);
  //       if(Math.abs(translationX)>availableWidth*0.4){
  //         Animated.spring(xXX.current, {
  //           velocity: velocityX,
  //           tension: 68,
  //           friction: 12,
  //           toValue: velocityX > 0 ? availableWidth : -availableWidth,
  //           useNativeDriver: true,
  //         }).start(()=>{
  //           setCurrentDate(velocityX>0 ? subMonths(currentDate,1):addMonths(currentDate,1));
  //         });
  //       }else{
  //         Animated.spring(xXX.current, {
  //           velocity: velocityX,
  //           tension: 68,
  //           friction: 12,
  //           toValue: 0,
  //           useNativeDriver: true,
  //         }).start(()=>{
  //           // setCurrentDate(velocityX>0 ? addMonths(currentDate,1):subMonths(currentDate,1));
  //         });
  //       }
  // translationY -= this._lastScrollYValue;
  // const dragToss = 0.05;
  // const endOffsetY =
  //   this.state.lastSnap + translationY + dragToss * velocityY;

  // let destSnapPoint = SNAP_POINTS_FROM_TOP[0];
  // for (let i = 0; i < SNAP_POINTS_FROM_TOP.length; i++) {
  //   const snapPoint = SNAP_POINTS_FROM_TOP[i];
  //   const distFromSnap = Math.abs(snapPoint - endOffsetY);
  //   if (distFromSnap < Math.abs(destSnapPoint - endOffsetY)) {
  //     destSnapPoint = snapPoint;
  //   }
  // }
  // this.setState({ lastSnap: destSnapPoint });
  // this._translateYOffset.extractOffset();
  // this._translateYOffset.setValue(translationY);
  // this._translateYOffset.flattenOffset();
  // this._dragY.setValue(0);
  // Animated.spring(this._translateYOffset, {
  //   velocity: velocityY,
  //   tension: 68,
  //   friction: 12,
  //   toValue: destSnapPoint,
  //   useNativeDriver: USE_NATIVE_DRIVER,
  // }).start();
  //     }
  //   };

  //   console.log({
  //     currentDate,
  //     startingDayIndex,
  //     availableWidth,
  //     beforeDateMonthFormated,
  //     currentDateMonthFormated,
  //     afterDateMonthFormated,state:panState.current
  //   });

  const previousMonth = (): void => setCurrentDate(subMonths(currentDate, 1));
  const forwardMonth = (): void => setCurrentDate(addMonths(currentDate, 1));

  const backPage = (): void => viewPager.current?.setPage(0);
  const nextPage = (): void => viewPager.current?.setPage(2);

  console.log({
    calendarHeight,
    availableWidth,
    isViewPager: !!availableWidth && !!calendarHeight,
  });
  return (
    <Animated.View
      style={{
        backgroundColor: 'lime',
        // alignItems:'flex-start',
        justifyContent: 'flex-start',
        // flexGrow: 1,
        // flexShrink: 2,
        flex: 1,
      }}
      pointerEvents="box-none"
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <Pressable style={{ padding: 20 }} onPress={backPage}>
          <Text>Back</Text>
        </Pressable>
        <Pressable style={{ padding: 20 }} onPress={nextPage}>
          <Text>Next</Text>
        </Pressable>
      </View>
      {
        // eslint-disable-next-line no-extra-boolean-cast
        !!availableWidth && !!calendarHeight ? (
          <ViewPager
            ref={viewPager}
            style={[
              {
                /* width: availableWidth,height:availableWidth, */
                // minHeight:0,
                // flex:1,
                //   flexGrow: 1,
                //   height:60,
                //   flexDirection:'row',
                //   overflow:'hidden',
                //   flexShrink: 0,
                // flexBase:0,
                backgroundColor: 'wheat',
                height: calendarHeight,

                // width: "100%",
                // height:"auto",
              } /* ,calendarHeight ? {height:calendarHeight}:{flex:1} */,
            ]}
            initialPage={1}
            transitionStyle="curl"
            onPageScroll={({ nativeEvent: { offset, position } }): void => {
              console.log('onPageScroll', { offset, position });
              if (position === 2 && offset === 0) {
                forwardMonth();
              } else if (position === 0 && offset === 0) {
                previousMonth();
              }
            }}
            orientation="horizontal"
            scrollEnabled
          >
            <Month
              key={`Month-${beforeDateMonthFormated}`}
              startingDayIndex={startingDayIndex}
              date={beforeDate}
              keyExtender={beforeDateMonthFormated}
              style={{
                paddingVertical: 20,
                width: availableWidth,
                backgroundColor: 'violet',
              }}
            />
            <Month
              key={`Month-${currentDateMonthFormated}`}
              startingDayIndex={startingDayIndex}
              date={currentDate}
              selectedDate={selectedDate}
              keyExtender={currentDateMonthFormated}
              // updateHeight={setCalendarHeight}
              style={{
                paddingVertical: 20,
                width: availableWidth,
                backgroundColor: 'peru',
              }}
            />
            <Month
              key={`Month-${afterDateMonthFormated}`}
              startingDayIndex={startingDayIndex}
              date={afterDate}
              keyExtender={afterDateMonthFormated}
              style={{
                paddingVertical: 20,
                width: availableWidth,
                backgroundColor: 'olive',
              }}
            />
          </ViewPager>
        ) : (
          <Month
            key={`Month-${currentDateMonthFormated}`}
            startingDayIndex={startingDayIndex}
            date={currentDate}
            selectedDate={selectedDate}
            keyExtender={currentDateMonthFormated}
            updateHeight={setCalendarHeight}
            style={{
              paddingVertical: 20,
              backgroundColor: 'peru',
            }}
          />
        )
      }
      <Agenda
        key={format(currentDate, 'dd-MM-yyyy')}
        currentDate={currentDate}
      />
      <View
        style={[StyleSheet.absoluteFill /* , { backgroundColor: 'silver' } */]}
        pointerEvents="none"
        key="Calendar-width-probe"
        onLayout={({
          nativeEvent: {
            layout: { x, y, width, height },
          },
        }): void => {
          setAvailableWidth(width);
        }}
      />
    </Animated.View>
  );
}

export default memo(Calendar);
