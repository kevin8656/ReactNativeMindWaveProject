import { connect } from 'dva-no-router';
import React from 'react';
import {
  Actions,
  Reducer,
  Router,
  Overlay,
  Modal,
  Scene,
  Stack,
} from 'react-native-router-flux';

import Home from './routes/home';
import Login from './routes/login';
import Device from './routes/device';

const DvaRouter = connect()(props => {
  const reducerCreate = params => {
    const defaultReducer = new Reducer(params);
    return (state, action) => {
      props.dispatch(action);
      return defaultReducer(state, action);
    };
  };
  return <Router createReducer={reducerCreate}>
    {props.children}
  </Router>
});

export default () => {
  return <DvaRouter>
    <Overlay>
      <Modal hideNavBar>

        <Stack key="login">
          <Scene key="loginMain" component={Login} hideNavBar={true} />
        </Stack>
        <Stack key="root">
          <Scene key="home" component={Home} hideNavBar={true} />
        </Stack>
        <Stack key="device">
          <Scene key="deviceMain" component={Device} title="Devices"
            onLeft={() => Actions.pop()} leftTitle="Close" />
        </Stack>
      </Modal>
    </Overlay>
  </DvaRouter>
};