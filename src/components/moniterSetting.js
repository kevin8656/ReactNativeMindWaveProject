import { connect } from 'dva-no-router';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Dimensions,
    Switch
} from 'react-native';
import { Actions } from 'react-native-router-flux';
var { height, width } = Dimensions.get('window');

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
                name: this.props.name
            }
        })
    }
    render() {
        return <View style={styles.container}>
            <TextInput
                value={this.props.name}
                style={styles.textInput}
                editable={this.props.editable}
                autoCapitalize="none" />
            <Switch
                disabled={false}
                value={(this.props.name == this.props.selection.name) ? true : false}
                style={styles.switch}
                onValueChange={(value) => { this.editUserData(this.state.selection); }} />
            {console.log(this.props)}
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
        height: 30,
        borderColor: 'gray',
        borderWidth: 1,
        fontFamily: 'Euphemia UCAS',
        color:'gray'
    },
    switch: {
        marginLeft: 10,
    }
});

export default connect(state => state)(MoniterSetting);