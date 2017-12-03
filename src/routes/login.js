import styles from './login.styles';

import { connect } from 'dva-no-router';
import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';

class Login extends Component {
  state = {
    userData: {
      name: null,
      email: null,
      phone: null,
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
      type: 'user/POST_login',
      payload: this.state.userData,
    })
  }

  render() {
    const {
      name, phone, email,
    } = this.state.userData;

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Welcome</Text>
        </View>
        <TextInput
          placeholder="Your Name"
          style={[styles.textInput, (Platform.OS === 'ios') && styles.iosHeight]}
          autoCapitalize="none"
          underlineColorAndroid='transparent'
          value={name}
          onChangeText={value => this.handleChangeField('name', value)}
        />
        <TextInput
          placeholder="Your Email"
          style={[styles.textInput, (Platform.OS === 'ios') && styles.iosHeight]}
          autoCapitalize="none"
          underlineColorAndroid='transparent'
          value={email}
          onChangeText={value => this.handleChangeField('email', value)}
        />
        <TextInput
          placeholder="Phone number"
          style={[styles.textInput, (Platform.OS === 'ios') && styles.iosHeight]}
          keyboardType='number-pad'
          underlineColorAndroid='transparent'
          value={phone}
          onChangeText={value => this.handleChangeField('phone', value)}
        />
        <TouchableOpacity onPress={this.handlePressSubmit}>
          <View style={styles.button}>
            <Text>Let's Play</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

export default connect()(Login);