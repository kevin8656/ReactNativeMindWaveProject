export default {
    namespace: 'mindwavedevicelist',
    state: {
        deviceList: []
    },
    reducers: {
        saveMindWaveDeviceList(state, action) {
            return {
                deviceList: action.deviceList
            };
        },
    },
    effects: {
        *save_mindwaveDeviceList(action, { call, put }) {
            console.log('saveMindWaveDeviceList');
            yield put({ type: 'saveMindWaveDeviceList', deviceList: action.deviceList });
        },
    },
}
