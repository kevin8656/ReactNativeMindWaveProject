import styles from './selectorScene.styles';

import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  Switch,
} from 'react-native';
import {
  FormInput,
} from 'react-native-elements';

class SelectorScene extends Component {
  static propTypes = {
    identity: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    editable: PropTypes.bool,
    disabled: PropTypes.bool,
    onChangeCheck: PropTypes.func,
    onChangeText: PropTypes.func,
  }

  static defaultProps = {
    checked: false,
    editable: true,
    disabled: false,
    onChangeCheck: () => null,
    onChangeText: () => null,
  }

  state = {
    name: this.props.name,
  }

  handleChangeText = value => {
    this.setState({
      name: value,
    })
    if (this.props.checked) {
      this.props.onChangeText(value)
    }
  }

  handleValueChange = checked => {
    this.props.onChangeCheck(
      this.props.identity,
      this.state.name,
      checked,
    )
  }

  render() {
    const {
      checked, editable, disabled,
    } = this.props

    return (
      <View style={styles.container} >
        <FormInput
          containerStyle={styles.inputContainer}
          inputStyle={styles.input}
          editable={editable}
          value={this.state.name}
          onChangeText={this.handleChangeText}
        />
        <Switch
          style={styles.switch}
          value={checked}
          disabled={disabled}
          onValueChange={this.handleValueChange}
        />
      </View>
    );
  }
}

export default SelectorScene;