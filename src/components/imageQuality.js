import styles from './imageQuality.styles';

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  Image,
} from 'react-native';

const imgBad = require('../images/bad.png')
const imgUnstable = require('../images/unstable.png')
const imgGood = require('../images/good.png')

class ImageQuality extends Component {
  static propTypes = {
    poorSignal: PropTypes.number,
  }
  static defaultProps = {
    poorSignal: -1
  }

  imageSource = () => {
    const {
      poorSignal
    } = this.props

    return poorSignal > 150 && poorSignal <= 200 || poorSignal == null
      ? imgBad
      : poorSignal > 50 && poorSignal <= 150
        ? imgUnstable
        : poorSignal <= 50
          ? imgGood
          : null;
  }

  render() {
    const {
      poorSignal,
    } = this.props;

    return (
      <View style={styles.imageView}>
        <Image source={this.imageSource()} style={styles.imageQuality} />
      </View>
    );
  }
}

export default ImageQuality;