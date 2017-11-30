import React, { Component } from 'react';
import dva from 'dva-no-router';

import router from './router';
import user from './models/user';
import selection from './models/selection';
import mindwave from './models/mindwave';


class App extends Component {
  app = dva();
  state = {
    init: false,
  };
  componentDidMount() {
    this.app.model(user);
    this.app.model(selection);
    this.app.model(mindwave);
    this.app.router(router);

    this.setState({ init: true });
  }
  render() {
    if (!this.state.init) return null;
    return this.app.start()(this.props);
  }
}

export default App;
