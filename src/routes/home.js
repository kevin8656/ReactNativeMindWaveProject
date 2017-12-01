import { connect } from 'dva-no-router';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
  Modal,
  ListView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Tabs from 'react-native-tabs';
import MindWaveMobile from 'react-native-mindwave-mobile';
import _ from 'lodash';
import MoniterSetting from '../components/moniterSetting';
let _platfrom = Platform.OS === 'ios' ? true : false;
const mwm = new MindWaveMobile();
const isMock = false;
const poorSignalTimerTimeMax = 5
var { height, width } = Dimensions.get('window');
var Settlecounter = 0;
var allData = [];
var data = [];
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      page: 'settings',
      mindwaveDeviceModalVisible: false,
      //Check Device Connection
      defaultPage: true,
      PrestartTest: false,
      deviceFound: false,
      mindwaveConnected: false,
      devices: [],
      mindwaveTimer: 0,
      //Check PoorSignal = 0
      poorSignalChecked: false,
      poorSignalTimer: poorSignalTimerTimeMax,
      Connected: false,
      isScanning: false,
      willConnect: null,
      //MindWave Data
      delta: this.props.mindwave.delta ? this.props.mindwave.delta : null,
      highAlpha: this.props.mindwave.highAlpha ? this.props.mindwave.highAlpha : null,
      lowAlpha: this.props.mindwave.lowAlpha ? this.props.mindwave.lowAlpha : null,
      theta: this.props.mindwave.theta ? this.props.mindwave.theta : null,
      lowBeta: this.props.mindwave.lowBeta ? this.props.mindwave.lowBeta : null,
      midGamma: this.props.mindwave.midGamma ? this.props.mindwave.midGamma : null,
      highBeta: this.props.mindwave.highBeta ? this.props.mindwave.highBeta : null,
      lowGamma: this.props.mindwave.lowGamma ? this.props.mindwave.lowGamma : null,
      poorSignal: this.props.mindwave.poorSignal ? this.props.mindwave.poorSignal : 200,
      meditation: this.props.mindwave.meditation ? this.props.mindwave.meditation : 0,
      attention: this.props.mindwave.attention ? this.props.mindwave.attention : 0,
      timerCounter: 0,
      //Start & Stop Button
      startOrStop: false,
    }
  }
  //----Mind Wave Function----
  handlePressScan = () => {
    mwm.scan();
    console.log('scan');
  }
  handleFoundDevice = (device) => {
    console.log(`device=${device.id}`);
    this.pushDevice(device);
  }
  pushDevice = (device) => {
    if (!device.id) {
      console.log('device id is undefined or null');
      return;
    }
    if (_.find(this.state.devices, ['id', device.id])) {
      console.log(`device (${device.id}) is in list`);
      return;
    }
    this.state.devices.push(device);

    this.setState({
      devices: this.state.devices,
    });
  }
  handlePressConnectDevice = (device) => {
    if (!device.id) {
      console.error('can not connect no id device');
      return;
    }
    this.setState({
      willConnect: device.id,
    }, () => {
      console.log(`IN handlePressConnectDevice willConnect=${this.state.willConnect}`);
    });
    if (isMock) {
      setTimeout(() => {
        this.handleConnect({ success: true });
      }, 2000);
    } else {
      this.mwm.connect(device.id);
    }
  }
  handlePressDisconnectDevice = () => {
    if (!this.state.mindwaveConnected) {
      console.log('no connecting device');
      return;
    }
    if (isMock) {
      this.handleDisconnect({ success: true });
    } else {
      this.mwm.disconnect();
    }
  }
  handleConnect = ({ success }) => {
    console.log(`Connect ${success ? 'Success' : 'Faild'}`);
    if (success && this.state.willConnect) {
      this.changeConnectedState(this.state.willConnect, true);
      this.setState({
        Connected: true,
      });
    } else {
      console.log('will connect device is null');
    }
  }
  handleDisconnect = ({ success }) => {
    console.log(`DisConnect ${success ? 'Success' : 'Faild'}`);
    if (success) {
      this.setState({
        Connected: false,
        startOrStop: false
      });
      this.alertMindWaveResult();
      console.log('no connecting device');
    }
    console.log(`mindwaveConnected=${this.state.mindwaveConnected}`);
    console.log(`willConnect=${this.state.willConnect}`);
    this.changeConnectedState(this.state.mindwaveConnected, false)
  }
  handleEEGPowerLowBeta = (data) => {
    //console.log('onEEGPowerLowBeta', data);
    this.props.dispatch({
      type: 'mindwave/on_eeg_power_lowbeta',
      lowBeta: data.lowBeta, midGamma: data.midGamma,
      highBeta: data.highBeta, lowGamma: data.lowGamma
    });
  }

  handleEEGPowerDelta = (data) => {
    //console.log('onEEGPowerDelta', data);
    this.props.dispatch({
      type: 'mindwave/on_eeg_power_delta',
      delta: data.delta, highAlpha: data.highAlpha,
      lowAlpha: data.lowAlpha, theta: data.theta
    });
  }

  handleESense = (data) => {
    //console.log('onESense', data);
    if (data.poorSignal != -1) {
      this.setState({
        mindwaveTimer: this.state.mindwaveTimer + 1
      })
      this.props.dispatch({
        type: 'mindwave/on_esence',
        poorSignal: data.poorSignal,
        meditation: data.meditation,
        attention: data.attention,
        mindwaveTimer: this.state.mindwaveTimer
      });
    }
  }
  // handleEEGBlink = (data) => {
  //   console.log('onEEGBlink', data);
  // }

  // handleMWMBaudRate = (data) => {
  //   console.log('onMWMBaudRate', data);
  // }
  changeConnectedState = (id, mindwaveConnected) => {
    if (!id) {
      console.log('device id is undefined or null');
      return;
    }
    if (_.findIndex(this.state.devices, ['id', id]) < 0) {
      console.log(`device (${id}) is not in list`);
      return;
    }

    let _state = { mindwaveConnected: id };
    if (mindwaveConnected && this.state.willConnect) {
      _state.willConnect = null;
    } else {
      _state.mindwaveConnected = null;
    }
    this.setState(_state);
  }
  setMindWaveDeviceModalVisible(visible) {
    this.setState({
      mindwaveDeviceModalVisible: visible,
      devices: []
    });
    mwm.scan();
    if (visible) {
      var i = 0
      this.timer = setInterval(
        () => {
          // this.setState({
          //   devices: []
          // });
          console.log('scanning devices');
          mwm.scan();
        }, 1000)
    } else {
      clearTimeout(this.timer)
    }

  }
  changeButtonState(changeStartAndStop) {
    if (changeStartAndStop) {
      this.setState({
        startOrStop: true
      })
    } else {
      this.setState({
        startOrStop: false,
      })
      this.alertMindWaveResult();
    }
  }
  alertMindWaveResult() {
    allData.push({ data: data })
    var user_details = {
      user_details: {
        name: this.props.user.name,
        email: this.props.user.email,
        phone: this.props.user.phone
      }
    }
    Alert.alert(
      'Result',
      'The data will be send to you and to the application owner via email',
      [
        {
          text: 'Send', onPress: () => {
            console.log(allData);
            allData = [];
            data = [];
            allData.push(user_details);
          },
        },
        {
          text: 'Clear', onPress: () => {
            allData = [];
            data = [];
            allData.push(user_details);
          }
        },
        {
          text: 'Cancel', onPress: () => {
            allData = [];
            data = [];
            allData.push(user_details);
          }
        },
      ],
      { cancelable: false }
    )
  }
  componentWillUnmount() {
    mwm.removeAllListeners();
  }
  componentDidMount() {
    this.mwm = new MindWaveMobile();
    mwm.onConnect(this.handleConnect);
    mwm.onDisconnect(this.handleDisconnect);
    mwm.onFoundDevice(this.handleFoundDevice);
    mwm.onEEGPowerLowBeta(this.handleEEGPowerLowBeta);
    mwm.onEEGPowerDelta(this.handleEEGPowerDelta);
    mwm.onESense(this.handleESense);
    // if (Platform.OS === 'ios') {
    //   mwm.onEEGBlink(this.handleEEGBlink);
    //   mwm.onMWMBaudRate(this.handleMWMBaudRate);
    // }
  }
  componentWillReceiveProps(nextProps) {
    const { user: previous_user } = this.props;
    const { user } = nextProps;
    if (previous_user != user) {
      var user_details = {
        user_details: {
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      }
      if (allData.length != 0) {
        allData.pop();
        allData.push(user_details);
      } else {
        allData.push(user_details);
      }
      console.log(allData);
      this.setState({
        userData: user,
      });
    }
    const { poorSignal } = nextProps.mindwave;
    const { mindwaveTimer: previous_mindwaveTimer } = this.props.mindwave;
    const { mindwaveTimer } = nextProps.mindwave;
    const { selection } = nextProps;
    const { selection: previous_selection } = this.props;
    if (previous_selection != selection) {
      console.log(selection);
    }
    if (previous_mindwaveTimer != mindwaveTimer) {
      if (this.state.startOrStop) {
        console.log(this.props.selection.name);
        data.push(
          {
            "low_gamma": nextProps.mindwave.lowGamma,
            "mid_gamma": nextProps.mindwave.midGamma,
            "meditation": nextProps.mindwave.meditation,
            "high_beta": nextProps.mindwave.highBeta,
            "low_beta": nextProps.mindwave.lowBeta,
            "delta": nextProps.mindwave.delta,
            "attention": nextProps.mindwave.attention,
            "theta": nextProps.mindwave.theta,
            "low_alpha": nextProps.mindwave.lowAlpha,
            "high_alpha": nextProps.mindwave.highAlpha,
            "event_name": this.props.selection.name,
            "event_id": this.props.selection.id
          }
        );
      }
      console.log({
        delta: nextProps.mindwave.delta, highAlpha: nextProps.mindwave.highAlpha, lowAlpha: nextProps.mindwave.lowAlpha, theta: nextProps.mindwave.theta,
        lowBeta: nextProps.mindwave.lowBeta, midGamma: nextProps.mindwave.midGamma, highBeta: nextProps.mindwave.highBeta, lowGamma: nextProps.mindwave.lowGamma,
        meditation: nextProps.mindwave.meditation, attention: nextProps.mindwave.attention, poorSignal: poorSignal
      })
    }
  }

  render() {
    const {
      name, email, phone
    } = this.state.userData;
    var pageElement;
    if (this.state.page == 'settings') {
      pageElement = (
        <View style={{ alignItems: 'center' }}>
          <View>
            <Text style={styles.title}>Settings</Text>
          </View>
          <TextInput
            placeholder="Your Name"
            value={name}
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
            value={email}
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
            value={phone}
            style={[styles.textInput, _platfrom && styles.iosHeight]}
            underlineColorAndroid='transparent'
            keyboardType='number-pad'
            onChangeText={
              (phone) =>
                this.setState({
                  userData: {
                    ...this.state.userData,
                    phone
                  }
                })} />
          <TouchableOpacity onPress={() => { this.editUserData(this.state.userData) }}>
            <View style={styles.button}>
              <Text>Save</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      const { account, name, token } = this.props.user;
      const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
      var mineWave = ds.cloneWithRows({ 1: 'MineWave1', 2: 'MineWave2' });
      pageElement = (
        <KeyboardAvoidingView behavior='position'>
          <View style={{ alignItems: 'center' }}>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.mindwaveDeviceModalVisible}
              onRequestClose={() => { alert("Modal has been closed.") }}
            >
              <View style={styles.container}>
                <View style={styles.topbarView}>
                  <TouchableOpacity style={styles.topbarText} onPress={() => this.setMindWaveDeviceModalVisible(false)}>
                    <Text style={{ fontSize: 23, color: '#82eaff' }}>Close</Text>
                  </TouchableOpacity>
                  <View style={styles.deviceTitle} >
                    <Text style={{ fontSize: 23 }}>Devices</Text>
                  </View>
                  <View style={{ flex: 1 }} >
                  </View>
                </View>

                <Text>{this.props.mindwavedevice ? this.props.mindwavedevice.id : null}</Text>
                <ScrollView style={styles.deviceList} >
                  {
                    this.state.devices.map((device, index) => {
                      const handlePress = () => this.state.mindwaveConnected ? this.handlePressDisconnectDevice() : this.handlePressConnectDevice(device);
                      const message = `Device : ${device.name || device.id}`
                      return <TouchableOpacity key={index} style={styles.view} onPress={handlePress} >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                          <View style={{ flex: 0.7 }}>
                            <Text style={{ fontSize: 15 }}>{message}</Text>
                          </View>
                          <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                            {this.state.mindwaveConnected == device.id ? <Image source={require('../images/check.png')} style={styles.imageCheck} /> : null}
                          </View>
                        </View>
                      </TouchableOpacity>
                    })
                  }
                </ScrollView>
              </View>
            </Modal>
            <View style={styles.qualityTitle}>
              {
                this.state.startOrStop ?
                  <View style={styles.imageView}>
                    {
                      this.props.mindwave.poorSignal > 150 && this.props.mindwave.poorSignal <= 200 || this.props.mindwave.poorSignal == null ? <Image source={require('../images/bad.png')} style={styles.imageQuality} /> :
                        this.props.mindwave.poorSignal > 50 && this.props.mindwave.poorSignal <= 150 ? <Image source={require('../images/unstable.png')} style={styles.imageQuality} /> :
                          this.props.mindwave.poorSignal <= 50 ? <Image source={require('../images/good.png')} style={styles.imageQuality} /> : null
                    }
                  </View>
                  :
                  <View style={styles.imageView}>
                    <TouchableOpacity onPress={() => {
                      this.setMindWaveDeviceModalVisible(true);
                    }}>
                      {
                        this.props.mindwave.poorSignal > 150 && this.props.mindwave.poorSignal <= 200 || this.props.mindwave.poorSignal == null ? <Image source={require('../images/bad.png')} style={styles.imageQuality} /> :
                          this.props.mindwave.poorSignal > 50 && this.props.mindwave.poorSignal <= 150 ? <Image source={require('../images/unstable.png')} style={styles.imageQuality} /> :
                            this.props.mindwave.poorSignal <= 50 ? <Image source={require('../images/good.png')} style={styles.imageQuality} /> : null
                      }
                    </TouchableOpacity>
                  </View>
              }
              <View style={styles.connectionTitleView}>
                <Text style={styles.connectionTitle}>
                  {
                    this.props.mindwave.poorSignal > 150 && this.props.mindwave.poorSignal <= 200 || this.props.mindwave.poorSignal == null ? 'Bad connection quality' :
                      this.props.mindwave.poorSignal > 50 && this.props.mindwave.poorSignal <= 150 ? 'Unstable connection quality' :
                        this.props.mindwave.poorSignal <= 50 ? 'Good connection quality' : null
                  }
                </Text>
              </View>
            </View>
            <MoniterSetting
              name="SEX" id='1' value={true} editable={false} disabled={this.state.startOrStop} />
            <MoniterSetting
              name="FOOD" id='2' value={true} editable={false} disabled={this.state.startOrStop} />
            <MoniterSetting
              name="SHOPPING" id='3' value={true} editable={false} disabled={this.state.startOrStop} />
            <MoniterSetting
              name="EVENT 4" id='4' value={true} editable={this.state.startOrStop ? false : true} disabled={this.state.startOrStop} />
            <MoniterSetting
              name="EVENT 5" id='5' value={true} editable={this.state.startOrStop ? false : true} disabled={this.state.startOrStop} />
            <MoniterSetting
              name="EVENT 6" id='6' value={true} editable={this.state.startOrStop ? false : true} disabled={this.state.startOrStop} />
            {
              this.state.mindwaveConnected ?
                this.state.startOrStop ?
                  null : <TouchableOpacity onPress={() => { this.changeButtonState(true); }}>
                    <View style={styles.startButton}>
                      <Image source={require('../images/start.png')} style={styles.startImage} />
                    </View>
                  </TouchableOpacity>
                : null
            }
            {
              this.state.mindwaveConnected ?
                !this.state.startOrStop ?
                  null : <TouchableOpacity onPress={() => { this.changeButtonState(false); }}>
                    <View style={styles.stopButton}>
                      <Image source={require('../images/stop.png')} style={styles.startImage} />
                    </View>
                  </TouchableOpacity>
                : null
            }
          </View>
        </KeyboardAvoidingView>
      );
    }
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Tabs selected={this.state.page} style={{ backgroundColor: 'white' }}
            selectedStyle={{ color: 'red' }} onSelect={el => this.setState({ page: el.props.name })}>
            <Text name="monitor" selectedIconStyle={{ borderTopWidth: 2, borderTopColor: 'red', backgroundColor: 'white' }}>Monitor</Text>
            <Text name="settings" selectedIconStyle={{ borderTopWidth: 2, borderTopColor: 'red', backgroundColor: 'white' }}>Settings</Text>
          </Tabs>
          {pageElement}
        </View>
      </TouchableWithoutFeedback>
    );
  }
  editUserData = (userData) => {
    this.props.dispatch({ type: 'user/POST_data', userData });
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
  qualityTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 35,
    width: width,
    height: width * 0.15,
    justifyContent: 'center',
  },
  imageCheck: {
    width: width * 0.05,
    height: width * 0.05,
    marginLeft: 13,
  },
  imageQuality: {
    width: width * 0.15,
    height: width * 0.15,
    marginRight: 13
  },
  imageView: {
    width: width * 0.15,
  },
  startImage: {
    width: width * 0.2,
    height: width * 0.2,
  },
  connectionTitle: {
    fontSize: 20,
  },
  connectionTitleView: {
    width: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
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
  topbarView: {
    paddingTop: 20,
    paddingBottom: 10,
    borderWidth: 1,
    borderBottomColor: '#d6d6d4',
    flexDirection: 'row',
    backgroundColor: '#f4f4f4'
  },
  topbarText: {
    marginLeft: 10,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  deviceTitle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  view: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#d6d6d4',
    width: width
  },
  deviceList: {
    borderTopWidth: 1,
    borderColor: '#d6d6d4',
    width: width,
    marginTop: 10
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default connect(state => state)(Home);