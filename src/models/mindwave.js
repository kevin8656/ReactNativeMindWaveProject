import _ from 'lodash';
import MindWaveMobile from 'react-native-mindwave-mobile';
import * as result from '../services/result';
import moment from 'moment-timezone';

export default {
  namespace: 'mindwave',
  state: {
    connected: false,
    connectDevice: null,
    recording: false,
    scanning: false,
    devices: {},
    events: {
      onConnect: false,
      onDisconnect: false,
      onFoundDevice: false,
      onEEGPowerDelta: false,
      onEEGPowerLowBeta: false,
      onESense: false,
    },
    current: {
      delta: null,
      highAlpha: null,
      lowAlpha: null,
      theta: null,
      lowBeta: null,
      midGamma: null,
      highBeta: null,
      lowGamma: null,
      poorSignal: null,
      meditation: null,
      attention: null,
    },
    data: [],
  },
  reducers: {
    SET_recording (state, { payload }) {
      return {
        ...state,
        recording: payload,
      }
    },
    SET_connected (state, { payload }) {
      return {
        ...state,
        connected: payload,
      }
    },
    SET_connectDevice (state, { payload }) {
      return {
        ...state,
        connectDevice: payload,
      }
    },
    SET_listener (state, { payload }) {
      return {
        ...state,
        events: {
          ...state.events,
          [payload.event]: payload.enable,
        }
      }
    },
    SET_current (state, { payload }) {
      return {
        ...state,
        current: {
          ...state.current,
          ...payload,
        },
      }
    },
    SET_scanning (state, { payload }) {
      return {
        ...state,
        scanning: payload,
      }
    },
    PUSH_device (state, { payload }) {
      return {
        ...state,
        devices: {
          ...state.devices,
          [payload.id]: payload,
        }
      }
    },
    PUSH_data (state, { payload }) {
      return {
        ...state,
        data: [
          ...state.data,
          payload
        ]
      }
    },
    RESET_data (state) {
      return {
        ...state,
        data: [],
      }
    },
    SET_disconnect (state) {
      return {
        ...state,
        connected: false,
        connectDevice: null,
        recording: false,
        current: {
          delta: null,
          highAlpha: null,
          lowAlpha: null,
          theta: null,
          lowBeta: null,
          midGamma: null,
          highBeta: null,
          lowGamma: null,
          poorSignal: null,
          meditation: null,
          attention: null,
        },
        data: [],
      }
    },
  },
  effects: {
    * result (action, { put, call, select }) {
      try {
        const data = yield select(state => state.mindwave.data)
        const user = yield select(state => state.user)
        const response = yield call(result.POST_result, {
          user_details: user,
          data,
        })
        yield put({
          type: 'RESET_data',
        })
      } catch (error) {
        console.error(error);
      }
    },
    * handleConnect({ payload }, { put }) {;
      yield put({
        type: 'SET_connected',
        payload: payload.success ? true : false,
      })
    },
    * handleDisconnect({ payload }, { put }) {
      if (!payload.success) return;

      yield put({
        type: 'SET_disconnect'
      })
    },
    * handleFoundDevice ({ payload }, { put, select }) {
      const scanning = yield select(state => state.mindwave.scanning)
      if (!scanning) return;
      yield put({
        type: 'PUSH_device',
        payload,
      })
    },
    * handleEEGData ({ payload }, { put, select }) {
      const {
        event, data,
      } = payload

      let tempEEGData = {};

      if (event === 'onEEGPowerDelta') {
        tempEEGData = {
          delta: data.delta,
          highAlpha: data.highAlpha,
          lowAlpha: data.lowAlpha,
          theta: data.theta,
        }
      } else if (event === 'onEEGPowerLowBeta') {
        tempEEGData = {
          lowBeta: data.lowBeta,
          midGamma: data.midGamma,
          highBeta: data.highBeta,
          lowGamma: data.lowGamma,
        }
      } else if (event === 'onESense') {
        if (data.poorSignal >= 0) {
          tempEEGData.poorSignal = data.poorSignal
        }
        if (data.meditation >= 0) {
          tempEEGData.meditation = data.meditation
        }
        if (data.attention >= 0) {
          tempEEGData.attention = data.attention
        }
      }

      yield put({
        type: 'SET_current',
        payload: tempEEGData,
      })

      yield put({
        type: 'saveRecord',
      })
    },
    saveRecord: [
      function* (action, { put, select }) {
        const recording = yield select(state => _.get(state, 'mindwave.recording', false))
        if (recording === false) return;

        const scene = yield select(state => _.get(state, 'scene'))
        const currentData = yield select(state => _.get(state, 'mindwave.current'))
        const data = _.chain(currentData)
          .mapKeys((value, key) => _.snakeCase(key))
          .assign({
            event_name: scene.name,
            event_id: scene.id,
            timestamp: moment().tz('Asia/Jerusalem').format(),
          })
          .value()

        yield put({
          type: 'PUSH_data',
          payload: data,
        })
      },
      { type: 'throttle', ms: 1000 }
    ]
  }
}