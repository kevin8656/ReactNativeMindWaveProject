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
    ScrollView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
var { height, width } = Dimensions.get('window');

import MindWaveMobile from 'react-native-mindwave-mobile';
const mwm = new MindWaveMobile()
const isMock = false;
import _ from 'lodash';

class Device extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {},
            mindwaveConnected: this.props.mindwavedevice ? this.props.mindwavedevice.id : null,
            willConnect: null,
            Connected: false,
            devices: this.props.mindwavedevicelist ? this.props.mindwavedevicelist.deviceList : []
        }
    }
    componentWillReceiveProps(nextProps) {
        const { mindwavedevice: previous_mindwavedevice } = this.props;
        const { mindwavedevice } = nextProps;
        if (previous_mindwavedevice != mindwavedevice) {
            this.setState({
                mindwaveConnected: mindwavedevice.id,
            });
            console.log('component Will Recive Props update mindwaveDevice');
        }
        const { mindwavedevicelist: previous_mindwavedevicelist } = this.props;
        const { mindwavedevicelist } = nextProps;
        if (previous_mindwavedevicelist != mindwavedevicelist) {
            this.setState({
                devices: mindwavedevicelist.deviceList,
            });
            console.log('component Will Recive Props update mindwaveDeviceList');
        }
    }
    componentDidMount() {
        this.props.dispatch({ type: 'user/POST_login' });
        mwm.scan();
    }
    //點擊後連接到Device
    handlePressConnectDevice = (device) => {
        if (!device.id) {
            console.error('can not connect no id device');
            return;
        }
        this.props.dispatch({ type: 'mindwavedevice/save_mindwaveConnectedDevice', device });
        mwm.connect(device.id);
    }
    //點擊後關閉裝置連接
    handlePressDisconnectDevice = () => {
        if (!this.state.mindwaveConnected) {
            console.log('no connecting device');
            return;
        }
        this.props.dispatch({ type: 'mindwavedevice/save_mindwaveConnectedDevice', device: null });
        mwm.disconnect();
    }
    render() {
        const { account, name, token } = this.props.user;
        return (
            <View style={styles.container}>
                <Text style={styles.mindwaveTitle}>正在掃描附近裝置</Text>
                <Text style={styles.deviceTitle} >裝置列表</Text>
                <Text>{this.props.mindwavedevice ? this.props.mindwavedevice.id : null}</Text>
                <ScrollView style={styles.listView} >
                    {
                        this.state.devices.map((device, index) => {
                            const handlePress = () => this.state.mindwaveConnected ? this.handlePressDisconnectDevice() : this.handlePressConnectDevice(device);
                            const message = `裝置 ${device.name || device.id} ${this.state.mindwaveConnected ? '[已連結]' : ''}`
                            return <TouchableOpacity key={index} style={styles.deviceItem} onPress={handlePress} >
                                <Text style={styles.deviceItemTitle} >{message}</Text>
                            </TouchableOpacity>
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 20
    },
    listView: {
        borderTopWidth: 1,
        borderColor: 'gray',
        width: width,
    },
    view: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: 'gray',
        width: width
    },
    minewave: {

    }
});

export default connect(state => state)(Device);