import React, { ReactElement } from 'react';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';

import Wrapper from './src/containers/Wrapper';
import { Calendar, Agenda } from './src/components';
import mocks from './mocks';

declare const global: { HermesInternal: null | {} };

const App = (): ReactElement => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>
      <StatusBar barStyle="dark-content" />
      <Wrapper
        startingDay={6}
        minDate="03-12-2020"
        // maxMonth="04-2021"
        futureScrollRange={4}
        pastScrollRange={0}
        events={mocks}
      >
        <Calendar />
        <Agenda />
      </Wrapper>
    </SafeAreaView>
  );
};



export default App;
