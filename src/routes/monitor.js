import styles from './monitor.styles';

import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva-no-router';
import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Alert,
  Text,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ImageQuality from '../components/imageQuality';
import SelectorScene from '../components/selectorScene';
import AdvanceScrollView from '../components/advanceScrollView';

const imgBtnStart = require('../images/start.png')
const imgBtnStop = require('../images/stop.png')

class Monitor extends Component {
  state = {
    timeCounter: null,
    recorded: false,
  }

  startedAt = null

  timeCounterInterval = null

  componentDidMount() {
    this.mindwaveInit()

    this.startedAt = moment.duration(0, 'seconds')
    this.timeCounterInterval = this.setTimeCounterInterval()
  }

  componentWillUnmount() {
    this.mindwaveDestory()
  }

  componentWillUnmount() {
    if (this.timeCounterInterval) {
      clearInterval(this.timeCounterInterval)
      this.timeCounterInterval = null
      this.startedAt = null
    }
  }

  componentWillReceiveProps(nextProps) {
    const { mindwave } = nextProps
    if (
      _.isArray(this.props.mindwave.data)
      &&
      _.isArray(mindwave.data)
      &&
      mindwave.data.length > this.props.mindwave.data.length
    ) {
      // flash
      this.setState({ recorded: true }, () => {
        setTimeout(() => {
          if (this.state.recorded === false) return
          this.setState({ recorded: false })
        }, 200)
      })
    }
  }
  

  mindwaveInit = () => {
    const { events } = this.props.mindwave

    if (events.onConnect === false) {
      this.props.mwm.onConnect(data => {
        this.props.dispatch({
          type: 'mindwave/handleConnect',
          payload: data,
        })
      })
    }
    if (events.onDisconnect === false) {
      this.props.mwm.onDisconnect(data => {
        this.props.dispatch({
          type: 'mindwave/handleDisconnect',
          payload: data,
        })
      })
    }
    if (events.onFoundDevice === false) {
      this.props.mwm.onFoundDevice(device => {
        this.props.dispatch({
          type: 'mindwave/handleFoundDevice',
          payload: device,
        })
      })
    }
    if (events.onEEGPowerDelta === false) {
      this.props.mwm.onEEGPowerDelta(data => {
        this.props.dispatch({
          type: 'mindwave/handleEEGData',
          payload: {
            event: 'onEEGPowerDelta',
            data,
          },
        })
      })
    }
    if (events.onEEGPowerLowBeta === false) {
      this.props.mwm.onEEGPowerLowBeta(data => {
        this.props.dispatch({
          type: 'mindwave/handleEEGData',
          payload: {
            event: 'onEEGPowerLowBeta',
            data,
          },
        })
      })
    }
    if (events.onESense === false) {
      this.props.mwm.onESense(data => {
        this.props.dispatch({
          type: 'mindwave/handleEEGData',
          payload: {
            event: 'onESense',
            data,
          },
        })
      })
    }
    
    [
      'onConnect',
      'onDisconnect',
      'onFoundDevice',
      'onEEGPowerDelta',
      'onEEGPowerLowBeta',
      'onESense',
    ].map(event => {
      this.props.dispatch({
        type: 'mindwave/SET_listener',
        payload: {
          event,
          enable: true,
        }
      })
    })
  }

  mindwaveDestory = () => {
    const {
      connected, connectDevice,
    } = this.props.mindwave

    if (connect === false || !connectDevice) return;

    this.props.dispatch({
      type: 'SET_connectDevice',
      payload: null,
    })
    this.props.mwm.disconnect();
    this.props.mwm.removeAllListeners();
    [
      'onConnect',
      'onDisconnect',
      'onFoundDevice',
      'onEEGPowerDelta',
      'onEEGPowerLowBeta',
      'onESense',
    ].map(event => {
      this.props.dispatch({
        type: 'mindwave/SET_listener',
        payload: {
          event,
          enable: false,
        }
      })
    })
  }

  handlePressDeviceModal = () => {
    Actions.devices();
  }

  handleStartButtonClick = () => {
    this.props.dispatch({
      type: 'mindwave/SET_recording',
      payload: true,
    })

    this.startedAt = moment.duration(0, 'seconds')
    this.timeCounterInterval = this.setTimeCounterInterval()
  }

  handleStopButtonClick = () => {
    this.props.dispatch({
      type: 'mindwave/SET_recording',
      payload: false,
    })

    if (this.timeCounterInterval) {
      clearInterval(this.timeCounterInterval)
      this.timeCounterInterval = null
    }

    Alert.alert(
      'Result',
      'The data will be send to you and to the application owner via email',
      [
        {
          text: 'Send', onPress: this.handleMessageButtonSend,
        },
        {
          text: 'Clear', onPress: this.handleMessageButtonClear
        },
        {
          text: 'Cancel', onPress: this.handleMessageButtonCancel
        },
      ],
      { cancelable: false }
    )
  }

  handleSceneChange = (identity, name, checked) => {
    this.props.dispatch({
      type: 'scene/SET_scene',
      payload: {
        name: checked ? name : 0,
        id: checked ? identity : 0,
      }
    })
  }

  handleSceneChangeText = (value) => {
    this.props.dispatch({
      type: 'scene/SET_name',
      payload: value,
    })
  }

  handleMessageButtonSend = () => {
    this.startedAt = null
    this.props.dispatch({
      type: 'mindwave/result',
    })
    this.setState({
      timeCounter: null
    })
  }

  handleMessageButtonCancel = () => {
    this.timeCounterInterval = this.setTimeCounterInterval()
    this.props.dispatch({
      type: 'mindwave/SET_recording',
      payload: true,
    })
  }

  handleMessageButtonClear = () => {
    this.startedAt = null
    this.props.dispatch({
      type: 'mindwave/RESET_data'
    })
    this.setState({
      timeCounter: null
    })
  }

  setTimeCounterInterval = () => setInterval(() => {
    if (!this.startedAt || !moment.isDuration(this.startedAt)) return

    this.startedAt.add(1, 'seconds')
    this.setState({
      timeCounter: `${_.padStart(this.startedAt.hours(), 2, 0)}:${_.padStart(this.startedAt.minutes(), 2, 0)}:${_.padStart(this.startedAt.seconds(), 2, 0)}`
    })
  }, 1000)

  render() {
    const timeCounter = this.state.timeCounter
    const poorSignal = this.props.mindwave.current.poorSignal
    const connected = this.props.mindwave.connected || false
    const recording = this.props.mindwave.recording || false
    const sceneId = this.props.scene.id

    return (
      <View style={styles.container}>
        <View style={styles.qualityTitle}>
          {
            recording
              ? <ImageQuality poorSignal={poorSignal} connected={connected} />
              : <TouchableOpacity onPress={this.handlePressDeviceModal}>
                <ImageQuality poorSignal={poorSignal} connected={connected} />
              </TouchableOpacity>
          }
          <View style={styles.connectionTitleView}>
            <Text style={styles.connectionTitle}>
              {
                poorSignal === null
                  ? 'No connection'
                  : poorSignal < 0 || (poorSignal > 150 && poorSignal <= 200)
                    ? 'Bad connection quality'
                    : poorSignal > 50 && poorSignal <= 150
                      ? 'Unstable connection quality'
                      : poorSignal <= 50 && poorSignal >= 0
                        ? 'Good connection quality'
                        : null
              }
            </Text>
          </View>
        </View>
        <AdvanceScrollView containerViewStyle={{ flex: 1, alignItems: 'center' }}>
          <SelectorScene
            identity="1"
            name="SEX"
            editable={false}
            checked={sceneId === '1'}
            onChangeCheck={this.handleSceneChange}
            onChangeText={this.handleSceneChangeText}
          />
          <SelectorScene 
            identity="2"
            name="FOOD"
            editable={false}
            checked={sceneId === '2'}
            onChangeCheck={this.handleSceneChange}
            onChangeText={this.handleSceneChangeText}
          />
          <SelectorScene 
            identity="3"
            name="SHOPPING"
            editable={false}
            checked={sceneId === '3'}
            onChangeCheck={this.handleSceneChange}
            onChangeText={this.handleSceneChangeText}
          />
          <SelectorScene 
            identity="4"
            name="EVENT 4"
            editable={!recording}
            checked={sceneId === '4'}
            onChangeCheck={this.handleSceneChange}
            onChangeText={this.handleSceneChangeText}
          />
          <SelectorScene 
            identity="5"
            name="EVENT 5"
            editable={!recording}
            checked={sceneId === '5'}
            onChangeCheck={this.handleSceneChange}
            onChangeText={this.handleSceneChangeText}
          />
          <SelectorScene 
            identity="6"
            name="EVENT 6"
            editable={!recording}
            checked={sceneId === '6'}
            onChangeCheck={this.handleSceneChange}
            onChangeText={this.handleSceneChangeText}
          />
          {
            timeCounter
              ? <Text style={[
                styles.timeCounterText,
                this.state.recorded && styles.timeCounterRecorded
              ]} >{timeCounter}</Text>
              : null
          }
          {
            connected
              ? !recording
                ? <TouchableOpacity onPress={this.handleStartButtonClick}>
                  <View style={styles.startButton}>
                    <Image source={imgBtnStart} style={styles.controlImage} />
                  </View>
                </TouchableOpacity>
                : <TouchableOpacity onPress={this.handleStopButtonClick}>
                  <View style={styles.stopButton}>
                    <Image source={imgBtnStop} style={styles.controlImage} />
                  </View>
                </TouchableOpacity>
              : null
          }
        </AdvanceScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    mindwave: state.mindwave,
    scene: state.scene,
  }
}

export default connect(mapStateToProps)(Monitor);