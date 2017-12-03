import styles from './moniterSetting.styles';

import _ from 'lodash';
import { connect } from 'dva-no-router';
import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Switch,
  Platform
} from 'react-native';
import { Actions } from 'react-native-router-flux';

class MoniterSetting extends Component {
  state = {
    selection: {
      name: this.props.name,
      id: this.props.id
    }
  }

  handleChangeText = (text) => {
    this.setState({
      selection: {
        ...this.state.selection,
        name: text,
      }
    })
  }

  handleChangeValue = (value) => {
    this.props.dispatch({
      type: 'scene/SET_scene',
      selection: this.state.selection,
    })
  }

  render() {
    const { selection } = this.state

    return (
      <View style={styles.container}>
        <TextInput
          style={[styles.textInput, (Platform.OS === 'ios') && styles.iosHeight]}
          value={selection.name}
          editable={this.props.editable}
          underlineColorAndroid='transparent'
          autoCapitalize="none"
          onChangeText={this.handleChangeText} />
        <Switch
          style={styles.switch}
          disabled={this.props.disabled}
          value={_.isEqual(selection.id, this.props.scene.id) ? true : false}
          onValueChange={this.handleChangeValue} />
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    scene: state.scene,
  }
}

export default connect(mapStateToProps)(MoniterSetting);