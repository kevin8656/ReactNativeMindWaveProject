import { connect } from 'dva-no-router';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Actions } from 'react-native-router-flux';
var { height, width } = Dimensions.get('window');
import MindWaveMobile from 'react-native-mindwave-mobile';
let _platfrom = Platform.OS === 'ios' ? true : false;
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
  }
  render() {
    const {
      account, name, token
    } = this.props.user;
    return( 
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Welcome</Text>
      </View>
      <TextInput
        placeholder="Your Name"
        value={this.state.name}
        style={styles.textInput}
        autoCapitalize="none"
        style={[styles.textInput, _platfrom && styles.iosHeight]}
        underlineColorAndroid='transparent'
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
        style={[styles.textInput, _platfrom && styles.iosHeight]}
        underlineColorAndroid='transparent'
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
        keyboardType='number-pad'
        style={[styles.textInput, _platfrom && styles.iosHeight]}
        underlineColorAndroid='transparent'
        onChangeText={
          (phone) =>
            this.setState({
              userData: {
                ...this.state.userData,
                phone
              }
            })} />
      <TouchableOpacity onPress={() => { this.createUserData(this.state.userData) }}>
        <View style={styles.button}>
          <Text>Let's Play</Text>
        </View>
      </TouchableOpacity>
    </View>
</TouchableWithoutFeedback>
          )
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
    height: width * 0.1,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 5,
    fontFamily: 'Euphemia UCAS',
    // backgroundColor:'white'
    marginBottom: 18
  },
  iosHeight: {
    height: 30
  },
  button: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 18,
    paddingRight: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'white',
    marginTop: 10,
  },
});

export default connect(state => state)(Login);