import styles from './setting.styles';

import _ from 'lodash';
import { connect } from 'dva-no-router';
import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import {
  Button,
} from 'react-native-elements';
import ProfileForm from '../components/profileForm';

class Setting extends Component {

  handlePressSubmit = () => {
    this.profileForm.validateFields((error, values) => {
      this.props.dispatch({
        type: 'user/SET_data',
        payload: values,
      })
    })
  }

  render() {
    return (
      <View style={styles.container} >
        <View>
          <Text style={styles.title}>Settings</Text>
        </View>
        <ProfileForm ref={(ref) => { this.profileForm = ref }}
          initData={this.props.userData}
        />
        <Button title="Save"
          buttonStyle={styles.btn}
          containerViewStyle={styles.btnContainer}
          textStyle={styles.btnText}
          onPress={this.handlePressSubmit}
        />
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