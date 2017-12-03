import styles from './monitor.styles';

import _ from 'lodash';
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
import MoniterSetting from '../components/moniterSetting';

const imgBtnStart = require('../images/start.png')
const imgBtnStop = require('../images/stop.png')

class Monitor extends Component {
  componentDidMount() {
    this.mindwaveInit()
  }

  componentWillUnmount() {
    this.mindwaveDestory()
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
            event: 'onEEGPowerDelta',
            data,
          },
        })
      })
    }
    if (events.onESence === false) {
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
      'onESence',
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
      'onESence',
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
  }

  handleStopButtonClick = () => {
    this.props.dispatch({
      type: 'mindwave/SET_recording',
      payload: false,
    })

    Alert.alert(
      'Result',
      'The data will be send to you and to the application owner via email',
      [
        {
          text: 'Send', onPress: () => {
            this.props.dispatch({
              type: 'mindwave/result',
            })
          },
        },
        {
          text: 'Clear', onPress: () => {
            this.props.dispatch({
              type: 'mindwave/RESET_data'
            })
          }
        },
        {
          text: 'Cancel', onPress: () => {
            this.props.dispatch({
              type: 'mindwave/SET_recording',
              payload: true,
            })
          }
        },
      ],
      { cancelable: false }
    )
  }

  render() {
    const poorSignal = _.get(this.props, 'mindwave.current.poorSignal', -1)
    const connected = this.props.mindwave.connected || false
    const recording = this.props.mindwave.recording || false

    return (
      <View style={styles.container}>
        <View style={styles.qualityTitle}>
          {
            recording
              ? <ImageQuality poorSignal={poorSignal} />
              : <TouchableOpacity onPress={this.handlePressDeviceModal}>
                <ImageQuality poorSignal={poorSignal} />
              </TouchableOpacity>
          }
          <View style={styles.connectionTitleView}>
            <Text style={styles.connectionTitle}>
              {
                poorSignal > 150 && poorSignal <= 200 || poorSignal == null
                  ? 'Bad connection quality'
                  : poorSignal > 50 && poorSignal <= 150
                    ? 'Unstable connection quality'
                    : poorSignal <= 50 ? 'Good connection quality' : null
              }
            </Text>
          </View>
        </View>
        <MoniterSetting
          name="SEX" id='1' editable={false} disabled={recording} />
        <MoniterSetting
          name="FOOD" id='2' editable={false} disabled={recording} />
        <MoniterSetting
          name="SHOPPING" id='3' editable={false} disabled={recording} />
        <MoniterSetting
          name="EVENT 4" id='4' editable={!recording} disabled={recording} />
        <MoniterSetting
          name="EVENT 5" id='5' editable={!recording} disabled={recording} />
        <MoniterSetting
          name="EVENT 6" id='6' editable={!recording} disabled={recording} />
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
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    mindwave: state.mindwave,
  }
}

export default connect(mapStateToProps)(Monitor);