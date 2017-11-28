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
    ListView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
var { height, width } = Dimensions.get('window');

class Device extends Component {
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
        const { account, name, token } = this.props.user;
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        var mineWave = ds.cloneWithRows({ 1: 'MineWave1', 2: 'MineWave2' });
        return <View style={styles.container}>
            <View style={styles.listView}>
                <ListView
                    dataSource={mineWave}
                    renderRow={(rowData) =>
                        <View style={styles.view}>
                            <TouchableOpacity style={styles.minewave}>
                                <Text>{rowData}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    style={{ flexDirection: 'column', }}
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