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
  ScrollView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Tabs from 'react-native-tabs';
import MindWaveMobile from 'react-native-mindwave-mobile';
import _ from 'lodash';

var { height, width } = Dimensions.get('window');
const mwm = new MindWaveMobile();
const isMock = false;
var { height, width } = Dimensions.get('window');
var Settlecounter = 0;
const poorSignalTimerTimeMax = 5
import MoniterSetting from '../components/moniterSetting';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      page: 'settings',
      mindwaveDeviceModalVisible: false,
      //確認裝置連接
      defaultPage: true,
      PrestartTest: false,
      deviceFound: false,
      mindwaveConnected: false,
      devices: [],
      mindwaveTimer: 0,
      //確認訊號值歸零
      poorSignalChecked: false,
      poorSignalTimer: poorSignalTimerTimeMax,
      Connected: false,
      isScanning: false,
      willConnect: null,
      //腦波數據
      delta: this.props.delta ? this.props.delta : null,
      highAlpha: this.props.highAlpha ? this.props.highAlpha : null,
      lowAlpha: this.props.lowAlpha ? this.props.lowAlpha : null,
      theta: this.props.theta ? this.props.theta : null,
      lowBeta: this.props.lowBeta ? this.props.lowBeta : null,
      midGamma: this.props.midGamma ? this.props.midGamma : null,
      highBeta: this.props.highBeta ? this.props.highBeta : null,
      lowGamma: this.props.lowGamma ? this.props.lowGamma : null,
      poorSignal: this.props.poorSignal ? this.props.poorSignal : 0,
      meditation: this.props.meditation ? this.props.meditation : 0,
      attention: this.props.attention ? this.props.attention : 0,
      timerCounter: 0,
    }
  }
  componentWillUnmount() {
    //clearTimeout(this.timerScan)
    mwm.removeAllListeners();
  }
  componentDidMount() {
    this.props.dispatch({ type: 'user/POST_login' });
    console.log('run componentDidMount');
    this.mwm = new MindWaveMobile();
    mwm.onConnect(this.handleConnect);
    mwm.onDisconnect(this.handleDisconnect);
    mwm.onFoundDevice(this.handleFoundDevice);
    mwm.onEEGPowerLowBeta(this.handleEEGPowerLowBeta);
    mwm.onEEGPowerDelta(this.handleEEGPowerDelta);
    mwm.onESense(this.handleESense);
    mwm.scan();
    if (Platform.OS === 'ios') {
      mwm.onEEGBlink(this.handleEEGBlink);
      mwm.onMWMBaudRate(this.handleMWMBaudRate);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { user: previous_user } = this.props;
    const { user } = nextProps;
    if (previous_user != user) {
      this.setState({
        userData: user,
      });
    }
    //檢查訊號值正常（poorsignal為0）
    const { poorSignal } = nextProps;
    //console.log('poorSignal', poorSignal);
    if (poorSignal == 0 && !this.state.poorSignalChecked && this.state.Connected) {

      //counter累加
      Settlecounter++;

      let DownSettleCounter = 5 - Settlecounter;
      //顯示倒數
      //ToastAndroid.show('訊號穩定！倒數' + DownSettleCounter + '秒', ToastAndroid.SHORT);

      //當Settlecounter==5（需維持10次的poorsignal=0 poorsignalchecked才會通過）
      if (Settlecounter == 5) {
        this.setState({ poorSignalChecked: true });
        if (poorSignal == 0) {
          //console.log(nextProps.poorSignal)
          this.setState({
            poorSignal: nextProps.poorSignal,
          })
          //將訊號push進訊號陣列
          // this.state.deltaArray.push(nextProps.delta)
          // this.state.highAlphaArray.push(nextProps.highAlpha)
          // this.state.lowAlphaArray.push(nextProps.lowAlpha)
          // this.state.thetaArray.push(nextProps.theta)
          // this.state.lowBetaArray.push(nextProps.lowBeta)
          // this.state.midGammaArray.push(nextProps.midGamma)
          // this.state.highBetaArray.push(nextProps.highBeta)
          // this.state.lowGammaArray.push(nextProps.lowGamma)
          console.log({
            delta: nextProps.delta, highAlpha: nextProps.highAlpha, lowAlpha: nextProps.lowAlpha, theta: nextProps.theta,
            lowBeta: nextProps.lowBeta, midGamma: nextProps.midGamma, highBeta: nextProps.highBeta, lowGamma: nextProps.lowGamma
          })
        } else {
          this.setState({
            poorSignal: nextProps.poorSignal,
          })
          console.log('訊號不正常，請調整腦波耳機穿戴位置')
        }
      }
    }

    //訊號不正常（poorsignal不為0）
    if (poorSignal != 0 && !this.state.checkPoorSignal && this.state.Connected) {
      Settlecounter = 0;
      if (this.state.canShowToast) {
        //ToastAndroid.show('請避免頭部晃動', ToastAndroid.SHORT);
        this.setState({ canShowToast: false })
      }
    }
  }
  //----腦波操作function----
  //掃描裝置
  handlePressScan = () => {
    mwm.scan();
    console.log('scan');
  }
  //尋找腦波耳機裝置
  handleFoundDevice = (device) => {
    console.log('on found deviceId ', device.id);
    console.log(device);
    this.pushDevice(device);
  }
  //將掃描到的裝置放入裝置清單中
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
  //點擊後連接到Device
  handlePressConnectDevice = (device) => {
    if (!device.id) {
      console.error('can not connect no id device');
      return;
    }
    this.setState({
      willConnect: device.id,
    });
    if (isMock) {
      setTimeout(() => {
        this.handleConnect({ success: true });
      }, 2000);
    } else {
      this.mwm.connect(device.id);
    }
  }
  //點擊後關閉裝置連接
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
  //連接腦波耳機
  handleConnect = ({ success }) => {
    console.log(`連結 ${success ? '成功' : '失敗'}`);
    //alert(`連結 ${success ? '成功' : '失敗'}`);
    //ToastAndroid.show(`連結 ${success ? '成功' : '失敗'}`, ToastAndroid.SHORT);
    if (success && this.state.willConnect) {
      this.changeConnectedState(this.state.willConnect, true);
      this.setState({
        Connected: true,
      });
    } else {
      console.log('will connect device is null');
    }
  }
  //關閉腦波耳機連接
  handleDisconnect = ({ success }) => {
    console.log(`移除連結 ${success ? '成功' : '失敗'}`);
    //alert(`移除連結 ${success ? '成功' : '失敗'}`);
    //ToastAndroid.show(`移除連結 ${success ? '成功' : '失敗'}`, ToastAndroid.SHORT);
    if (success && !this.state.mindwaveConnected) {
      this.setState({
        Connected: false,
      });
      console.log('no connecting device');
      return;
    }
    this.changeConnectedState(this.state.mindwaveConnected, false)
  }
  handleEEGPowerLowBeta = (data) => {
    console.log('onEEGPowerLowBeta', data);
    //this.props.onEEGPowerLowBeta(data);
  }

  handleEEGPowerDelta = (data) => {
    console.log('onEEGPowerDelta', data);
    this.setState({
      mindwaveTimer: this.state.mindwaveTimer + 1
    })
    //this.props.onEEGPowerDelta(data, this.state.mindwaveTimer)
  }

  handleESense = (data) => {
    console.log('onESense', data);
    if (data.poorSignal != -1) {
      //this.props.onESense(data);
    }
  }
  handleEEGBlink = (data) => {
    console.log('onEEGBlink', data);
  }

  handleMWMBaudRate = (data) => {
    console.log('onMWMBaudRate', data);
  }
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
    this.setState({ mindwaveDeviceModalVisible: visible });
    mwm.scan();
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
            style={styles.textInput}
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
            style={styles.textInput}
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
            <Button onPress={() => { this.editUserData(this.state.userData) }}
              title="Save"
              color="gray"
            />
          </View>
        </View>
      );
    } else {
      const { account, name, token } = this.props.user;
      const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
      var mineWave = ds.cloneWithRows({ 1: 'MineWave1', 2: 'MineWave2' });
      pageElement = (

        <View style={{ alignItems: 'center' }}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.mindwaveDeviceModalVisible}
            onRequestClose={() => { alert("Modal has been closed.") }}
          >
            <View style={styles.container}>
              <View style={styles.topbarView}>
                <TouchableOpacity onPress={() => this.setMindWaveDeviceModalVisible(false)}>
                  <Text style={styles.topbarText}>結束</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.mindwaveTitle}>正在掃描附近裝置</Text>
              <Text style={styles.deviceTitle} >裝置列表</Text>
              <Text>{this.props.mindwavedevice ? this.props.mindwavedevice.id : null}</Text>
              <ScrollView style={styles.deviceList} >
                {
                  this.state.devices.map((device, index) => {
                    const handlePress = () => this.state.mindwaveConnected ? this.handlePressDisconnectDevice() : this.handlePressConnectDevice(device);
                    const message = `裝置 ${device.name || device.id} ${this.state.willConnect === device.id ? '[正在連結]' : this.state.mindwaveConnected === device.id ? '[已連結]' : ''}`
                    return <TouchableOpacity key={index} style={styles.deviceItem} onPress={handlePress} >
                      <Text style={styles.deviceItemTitle} >{message}</Text>
                    </TouchableOpacity>
                  })
                }
              </ScrollView>
            </View>
          </Modal>
          <View style={styles.qualityTitle}>
            <TouchableOpacity onPress={() => {
              //this.selectDevice(this.props.deviceList ? this.props.deviceList : []);
              this.setMindWaveDeviceModalVisible(true);
            }}>
              <Image source={require('../images/good.png')} style={styles.imageQuality} />
            </TouchableOpacity>
            <Text style={styles.connectionTitle}>Good connection quality</Text>
          </View>
          <MoniterSetting
            name="SEX" value={true} editable={false} />
          <MoniterSetting
            name="FOOD" value={true} editable={false} />
          <MoniterSetting
            name="SHOPPING" value={true} editable={false} />
          <MoniterSetting
            name="EVENT 4" value={true} editable={true} />
          <MoniterSetting
            name="EVENT 5" value={true} editable={true} />
          <MoniterSetting
            name="EVENT 6" value={true} editable={true} />
          <TouchableOpacity onPress={() => { this.handlePressScan(); }}>
            <Text>Scan</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Tabs selected={this.state.page} style={{ backgroundColor: 'white' }}
          selectedStyle={{ color: 'red' }} onSelect={el => this.setState({ page: el.props.name })}>
          <Text name="monitor" selectedIconStyle={{ borderTopWidth: 2, borderTopColor: 'red' }}>Monitor</Text>
          <Text name="settings" selectedIconStyle={{ borderTopWidth: 2, borderTopColor: 'red' }}>Settings</Text>
        </Tabs>
        {pageElement}
      </View>
    );
  }
  editUserData = (userData) => {
    this.props.dispatch({ type: 'user/POST_data', userData });
  }
  selectDevice = (deviceList) => {
    Actions.device(deviceList);
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
  },
  imageQuality: {
    width: width * 0.15,
    height: width * 0.15,
    marginRight: 13
  },
  connectionTitle: {
    fontSize: 20
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
  topbarView: {
    marginTop: 20
  },
  topbarText: {
  },
  mindwaveTitle: {
  },
  deviceTitle: {
  },
  deviceList: {
  },
  deviceItem: {
  },
  deviceItemTitle: {
  },
});

export default connect(state => state)(Home);