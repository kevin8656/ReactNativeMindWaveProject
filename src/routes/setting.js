import styles from './setting.styles';

import _ from 'lodash';
import { connect } from 'dva-no-router';
import React, { Component } from 'react';
import {
  View,
  Platform,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';

class Setting extends Component {
  state = {
    userData: this.props.userData,
  }

  componentWillReceiveProps(nextProps) {
    const {
      userData,
    } = nextProps

    if (this.props.userData !== userData) {
      this.setState({
        userData,
      })
    }
  }

  handleChangeField = (field, value) => {
    this.setState({
      userData: {
        ...this.state.userData,
        [field]: value,
      },
    })
  }

  handlePressSubmit = () => {
    this.props.dispatch({
      type: 'user/SET_data',
      payload: this.state.userData,
    })
  }

  render() {
    const {
      name, email, phone,
    } = this.state.userData

    return (
      <View style={styles.container} >
        <View>
          <Text style={styles.title}>Settings</Text>
        </View>
        <TextInput
          placeholder="Your Name"
          value={name}
          autoCapitalize="none"
          style={[styles.textInput, (Platform === 'ios') && styles.iosHeight]}
          underlineColorAndroid='transparent'
          onChangeText={text => this.handleChangeField('name', text)} />
        <TextInput
          placeholder="Your Email"
          value={email}
          autoCapitalize="none"
          style={[styles.textInput, (Platform.OS === 'ios') && styles.iosHeight]}
          underlineColorAndroid='transparent'
          onChangeText={text => this.handleChangeField('email', text)} />
        <TextInput
          placeholder="Phone number"
          value={phone}
          style={[styles.textInput, (Platform.OS === 'ios') && styles.iosHeight]}
          underlineColorAndroid='transparent'
          keyboardType='number-pad'
          onChangeText={text => this.handleChangeField('phone', text)} />
        <TouchableOpacity onPress={this.handlePressSubmit}>
          <View style={styles.button}>
            <Text>Save</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    userData: state.user,
  }
}

export default connect(mapStateToProps)(Setting);