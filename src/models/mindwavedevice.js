export default {
    namespace: 'mindwavedevice',
    state: {
        id: null,
        mfgId: null,
        name: null
    },
    reducers: {
        saveMindWaveConnectedDevice(state, action) {
            return {
                id: action.device?action.device.id:null,
                mfgId: action.device?action.device.mfgId:null,
                name: action.device?action.device.name:null,
            };
        },
    },
    effects: {
        *save_mindwaveConnectedDevice(action, { call, put }) {
            console.log('save_mindwaveConnectedDevice');
            yield put({ type: 'saveMindWaveConnectedDevice', device: action.device });
        },
    },
}
