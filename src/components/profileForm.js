import styles from './profileForm.styles';

import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import {
  FormInput,
  Button,
} from 'react-native-elements';

class ProfileForm extends Component {
  static propTypes = {
    initData: PropTypes.object,
  }

  state = {
    form: this.props.initData || {
      name: null,
      email: null,
      phone: null,
    },
  }

  handleChangeField = (field, value) => {
    this.setState({
      form: {
        ...this.state.form,
        [field]: value,
      },
    })
  }

  validateFields = (callback) => {
    if (!_.isFunction(callback)) return ;
    callback(null, this.state.form)
  }

  render() {
    const {
      name, email, phone,
    } = this.state.form

    return (
      <View style={styles.container} >
        <FormInput
          containerStyle={styles.inputContainer}
          placeholder="Your Name"
          autoCapitalize="none"
          value={name}
          onChangeText={value => this.handleChangeField('name', value)}
        />
        <FormInput
          containerStyle={styles.inputContainer}
          placeholder="Your Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={value => this.handleChangeField('email', value)}
        />
        <FormInput
          containerStyle={styles.inputContainer}
          placeholder="Phone number"
          autoCapitalize="none"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={value => this.handleChangeField('phone', value)}
        />
      </View>
    );
  }
}

export default ProfileForm;