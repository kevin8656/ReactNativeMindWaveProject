import { connect } from 'dva-no-router';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Dimensions,
    Switch,
    Platform
} from 'react-native';
import { Actions } from 'react-native-router-flux';
var { height, width } = Dimensions.get('window');
let _platfrom = Platform.OS === 'ios' ? true : false;
class MoniterSetting extends Component {
    constructor() {
        super();
        this.state = {
            selection: {}
        }
    }
    componentWillMount() {
        this.setState({
            selection: {
                ...this.state.selection,
                name: this.props.name,
                id: this.props.id
            }
        })
    }
    render() {
        return <View style={styles.container}>
            <TextInput
                value={this.props.name}
                style={styles.textInput}
                editable={this.props.editable}
                style={[styles.textInput, _platfrom && styles.iosHeight]}
                underlineColorAndroid='transparent'
                autoCapitalize="none" />
            <Switch
                disabled={false}
                value={(this.props.name == this.props.selection.name) ? true : false}
                style={styles.switch}
                onValueChange={(value) => { this.editUserData(this.state.selection); }} />
        </View>
    }
    editUserData = (selection) => {
        this.props.dispatch({ type: 'selection/save_selection', selection });
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20
    },
    textInput: {
        width: width * 0.7,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        fontFamily: 'Euphemia UCAS',
        color: 'gray'
    },
    iosHeight: {
        height: 30
    },
    switch: {
        marginLeft: 10,
    }
});

export default connect(state => state)(MoniterSetting);