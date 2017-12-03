import styles from './devices.styles';

import _ from 'lodash';
import { connect } from 'dva-no-router';
import React, { Component } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';

const imgCheck = require('../images/check.png')

class Devices extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'mindwave/SET_scanning',
      payload: true,
    })
    this.props.mwm.scan();
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'mindwave/SET_scanning',
      payload: false,
    })
  }
  
  handlePress = (deviceId, isConnected = false) => {
    if (isConnected) {
      this.props.mwm.disconnect();
    } else {
      this.props.mwm.connect(deviceId)
    }
  }

  render() {
    const {
      devices, connected, connectDevice
    } = this.props

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.deviceList} >
          {
            _.map(devices, (device, index) => (
              <TouchableOpacity key={index} style={styles.deviceItemTouchable} onPress={() => this.handlePress(device.id, (connected && (connectDevice === device.id)))} >
                <View style={styles.deviceItemContainer}>
                  <View style={styles.deviceItemLeft}>
                    <Text style={{ fontSize: 15 }}>{`Device : ${device.name || device.id}`}</Text>
                  </View>
                  <View style={styles.deviceItemRight}>
                    {
                      connected && (connectDevice === device.id)
                        ? <Image source={imgCheck} style={styles.imageCheck} />
                        : null
                    }
                  </View>
                </View>
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    connectDevice: state.mindwave.connectDevice,
    connected: state.mindwave.connected,
    devices: state.mindwave.devices,
  }
}

export default connect(mapStateToProps)(Devices);