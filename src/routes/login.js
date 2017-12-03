import styles from './login.styles';

import { connect } from 'dva-no-router';
import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import {
  Button,
} from 'react-native-elements';
import ProfileForm from '../components/profileForm';

class Login extends Component {
  handlePressSubmit = () => {
    this.form.validateFields((error, values) => {
      this.props.dispatch({
        type: 'user/POST_login',
        payload: values,
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Welcome</Text>
        </View>
        <ProfileForm ref={(ref) => { this.form = ref }} />
        <Button title="Let's Play"
          buttonStyle={styles.btn}
          containerViewStyle={styles.btnContainer}
          textStyle={styles.btnText}
          onPress={this.handlePressSubmit}
        />
      </View>
    )
  }
}

export default connect()(Login);