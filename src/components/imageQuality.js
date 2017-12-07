import styles from './imageQuality.styles';

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

class ImageQuality extends Component {
  static propTypes = {
    poorSignal: PropTypes.number,
    connected: PropTypes.bool,
  }
  static defaultProps = {
    poorSignal: -1,
    connected: false,
  }

  iconName = () => {
    const {
      poorSignal, connected,
    } = this.props

    if (!connected) return 'bluetooth-disabled';
    return (poorSignal === null || poorSignal == -1) || (poorSignal > 150  && poorSignal <= 200)
      ? 'sentiment-very-dissatisfied'
      : poorSignal > 50 && poorSignal <= 150
        ? 'sentiment-neutral'
        : poorSignal <= 50 && poorSignal >= 0
          ? 'sentiment-very-satisfied'
          : null;
  }

  render() {
    return (
      <View style={styles.imageView}>
        <Icon name={this.iconName()} style={styles.icon} />
      </View>
    );
  }
}

export default ImageQuality;