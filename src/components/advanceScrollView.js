import styles from './advanceScrollView.styles';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  ViewPropTypes,
} from 'react-native';

class AdvanceScrollView extends Component {
  static propTypes = {
    keyboardVerticalOffset: PropTypes.number,
    containerViewStyle: ViewPropTypes.style,
  }
  render() {
    const {
      keyboardVerticalOffset,
      containerViewStyle,
      ...props,
    } = this.props;
    const keyboardBehavior = Platform.select({
      ios: 'padding', android: null,
    })

    return (
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={keyboardBehavior}
        keyboardVerticalOffset={keyboardVerticalOffset || Platform.select({ ios: 64, android: 54 })}
      >
        <ScrollView contentContainerStyle={styles.scrollContentContainer} {...props} >
          <View style={[styles.containerView, containerViewStyle]}>
            {this.props.children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default AdvanceScrollView;