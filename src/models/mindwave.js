//import * as user from '../services/user';

export default {
    namespace: 'mindwave',
    state: {

    },
    reducers: {
        on_eeg_power_delta(state, action) {
            return {
                delta: action.delta, highAlpha: action.highAlpha,
                lowAlpha: action.lowAlpha, theta: action.theta, mindwaveTimer: action.mindwaveTimer
            }
        },
        on_eeg_power_low_beta(state, action) {
            return {
                lowBeta: action.lowBeta, midGamma: action.midGamma,
                highBeta: action.highBeta, lowGamma: action.lowGamma
            }
        },
        on_esense(state, action) {
            return { poorSignal: action.poorSignal }
        },
    },
    effects: {
    },
}
