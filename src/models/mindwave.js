//import * as user from '../services/user';

export default {
    namespace: 'mindwave',
    state: {
        delta: null,
        highAlpha: null,
        lowAlpha: null,
        theta: null,
        mindwaveTimer: null,
        lowBeta: null,
        midGamma: null,
        highBeta: null,
        lowGamma: null,
        poorSignal: null,
        meditation: null,
        attention: null
    },
    reducers: {
        onEEGPowerDelta(state, action) {
            return {
                ...state,
                delta: action.delta, highAlpha: action.highAlpha,
                lowAlpha: action.lowAlpha, theta: action.theta
            }
        },
        onEEGPowerLowBeta(state, action) {
            return {
                ...state,
                lowBeta: action.lowBeta, midGamma: action.midGamma,
                highBeta: action.highBeta, lowGamma: action.lowGamma
            }
        },
        onESence(state, action) {
            return {
                ...state,
                poorSignal: action.poorSignal,
                meditation: action.meditation,
                attention: action.attention,
                mindwaveTimer: action.mindwaveTimer
            }
        },
    },
    effects: {
        *on_eeg_power_delta(action, { call, put }) {
            yield put({
                type: 'onEEGPowerDelta',
                delta: action.delta, highAlpha: action.highAlpha,
                lowAlpha: action.lowAlpha, theta: action.theta
            });
            // console.log({
            //     delta: action.delta, highAlpha: action.highAlpha,
            //     lowAlpha: action.lowAlpha, theta: action.theta, mindwaveTimer: action.mindwaveTimer
            // });
        },
        *on_eeg_power_lowbeta(action, { call, put }) {
            yield put({
                type: 'onEEGPowerLowBeta',
                lowBeta: action.lowBeta, midGamma: action.midGamma,
                highBeta: action.highBeta, lowGamma: action.lowGamma
            });
            // console.log({
            //     lowBeta: action.lowBeta, midGamma: action.midGamma,
            //     highBeta: action.highBeta, lowGamma: action.lowGamma
            // });
        },
        *on_esence(action, { call, put }) {
            yield put({
                type: 'onESence',
                poorSignal: action.poorSignal,
                meditation: action.meditation,
                attention: action.attention,
                mindwaveTimer: action.mindwaveTimer
            });
            // console.log({
            //     poorSignal: action.poorSignal,
            //     meditation: action.meditation,
            //     attention: action.attention
            // });
        },
    },
}
