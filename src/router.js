import { connect } from 'dva-no-router';
import React from 'react';
import {
  Platform,
} from 'react-native';
import {
  Actions,
  Reducer,
  Router,
  Overlay,
  Modal,
  Scene,
  Stack,
  Tabs,
} from 'react-native-router-flux';
import MindWaveMobile from 'react-native-mindwave-mobile';
import Login from './routes/login';
import Monitor from './routes/monitor';
import Setting from './routes/setting';
import Devices from './routes/devices';

const mwm = new MindWaveMobile();
const DvaRouter = connect()(({ dispatch, ...props }) => {
  const reducerCreate = params => {
    const defaultReducer = new Reducer(params);
    return (state, action) => {
      dispatch(action);
      return defaultReducer(state, action);
    };
  };
  return <Router createReducer={reducerCreate} {...props} />
});

export default () => {
  const devicesNavButton = Platform.select({
    ios: {
      rightTitle: 'Close',
      onRight: () => Actions.pop(),
    },
    android: {
      leftTitle: 'Close',
      onLeft: () => Actions.pop(),
    }
  })
  return <DvaRouter>
    <Overlay>
      <Modal hideNavBar>
        <Scene key="login" component={Login} />
        <Tabs key="home"
          labelStyle={{ fontSize: 16 }}
          tabBarPosition='bottom'
          activeBackgroundColor="#B3E5FC"
          swipeEnabled={false}
          showIcon={false}
          animationEnabled={false}
        >
          <Scene key="monitor" component={Monitor} mwm={mwm} tabBarLabel="Monitor" hideNavBar />
          <Scene key="setting" component={Setting} tabBarLabel="Settings" hideNavBar />
        </Tabs>
        <Stack key="devices">
          <Scene key="devicesMain" component={Devices} title="Devices"
            mwm={mwm}
            {...devicesNavButton}
          />
        </Stack>
      </Modal>
    </Overlay>
  </DvaRouter>
};