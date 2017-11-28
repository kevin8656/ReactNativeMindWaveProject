import { connect } from 'dva-no-router';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Dimensions
} from 'react-native';
import { Actions } from 'react-native-router-flux';
var { height, width } = Dimensions.get('window');
import MindWaveMobile from 'react-native-mindwave-mobile';

const mwm = new MindWaveMobile()

class Login extends Component {
  constructor() {
    super();
    this.state = {
      userData: {}
    }
  }

  componentDidMount() {
    this.props.dispatch({ type: 'user/POST_login' });

    mwm.onFoundDevice(device => {
      console.log(device)
      console.log('device');
    })
  }
  scan() {
    mwm.scan()
    console.log('scan');
  }
  render() {
    const {
      account, name, token
    } = this.props.user;
    return <View style={styles.container}>
      <View>
        <Text style={styles.title}>Welcome</Text>
      </View>
      <TextInput
        placeholder="Your Name"
        value={this.state.name}
        style={styles.textInput}
        autoCapitalize="none"
        onChangeText={
          (name) =>
            this.setState({
              userData: {
                ...this.state.userData,
                name
              }
            })} />
      <TextInput
        placeholder="Your Email"
        value={this.state.email}
        style={styles.textInput}
        autoCapitalize="none"
        onChangeText={
          (email) =>
            this.setState({
              userData: {
                ...this.state.userData,
                email
              }
            })} />
      <TextInput
        placeholder="Phone number"
        value={this.state.phone}
        style={styles.textInput}
        keyboardType='number-pad'
        onChangeText={
          (phone) =>
            this.setState({
              userData: {
                ...this.state.userData,
                phone
              }
            })} />
      <View style={styles.button}>
        <Button onPress={() => { this.createUserData(this.state.userData) }}
          title="Let's Play"
          color="gray"
        />
      </View>
      <View style={styles.button}>
        <Button onPress={() => { this.scan() }}
          title="Scan MindWave"
          color="gray"
        />
      </View>
    </View>
  }
  createUserData = (userData) => {
    this.props.dispatch({ type: 'user/POST_data', userData });
    Actions.root();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    marginTop: 35,
    marginBottom: 35,
    fontSize: 45
  },
  textInput: {
    width: width * 0.6,
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 5,
    fontFamily: 'Euphemia UCAS',
    // backgroundColor:'white'
    marginBottom: 20
  },
  button: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'white',
    marginTop: 10,

  },
});

export default connect(state => state)(Login);