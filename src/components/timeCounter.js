import styles from './timeCounter.styles';

import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import {
  Text,
} from 'react-native';

class TimeCounter extends Component {
  state = {
    timeCounter: null,
    recorded: false,
  }

  startedAt = null
  
  timeCounterInterval = null

  componentWillUnmount() {
    if (this.timeCounterInterval) {
      clearInterval(this.timeCounterInterval)
      this.timeCounterInterval = null
      this.startedAt = null
    }
  }

  flash = () => {
    this.setState({ recorded: true }, () => {
      setTimeout(() => {
        if (this.state.recorded === false) return
        this.setState({ recorded: false })
      }, 300)
    })
  }

  start = () => {
    if (!this.startedAt || !moment.isDuration(this.startedAt)) {
      this.startedAt = moment.duration(0, 'seconds')
    }

    this.timeCounterInterval = this.setTimeCounterInterval()
  }

  stop = () => {
    if (this.timeCounterInterval) {
      clearInterval(this.timeCounterInterval)
      this.timeCounterInterval = null
    }
    this.startedAt = null
    this.setState({
      timeCounter: null
    })
  }

  pause = () => {
    if (this.timeCounterInterval) {
      clearInterval(this.timeCounterInterval)
      this.timeCounterInterval = null
    }
  }

  setTimeCounterInterval = () => setInterval(() => {
    if (!this.startedAt || !moment.isDuration(this.startedAt)) return

    this.startedAt.add(1, 'seconds')
    this.setState({
      timeCounter: `${_.padStart(this.startedAt.hours(), 2, 0)}:${_.padStart(this.startedAt.minutes(), 2, 0)}:${_.padStart(this.startedAt.seconds(), 2, 0)}`
    })
  }, 1000)

  render() {
    const { timeCounter, recorded } = this.state

    return (
      <Text style={[
        styles.counterText,
        recorded && styles.counterRecorded
      ]} >{timeCounter}</Text>
    );
  }
}

export default TimeCounter;