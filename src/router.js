import { connect } from 'dva-no-router';
import React from 'react';
import {
  Platform,
  Alert,
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
import RNExitApp from 'react-native-exit-app';
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
const handleBackPress = () => {
  const prevScene = Actions.currentScene;

  Actions.pop();

  if (Actions.currentScene === prevScene) {
    Alert.alert(
      'Want Exit？',
      'Press \"Yes\" exit',
      [
        { text: 'Cancel' },
        { text: 'Yes', onPress: () => RNExitApp.exitApp() },
      ]
    );
  }

  return true;
}

export default () => {
  const devicesNavButton = Platform.select({
    ios: {
      leftTitle: 'Close',
      onLeft: () => Actions.pop(),
    },
    android: {
      rightTitle: 'Close',
      onRight: () => Actions.pop(),
    }
  })
  return <DvaRouter backAndroidHandler={handleBackPress} >
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