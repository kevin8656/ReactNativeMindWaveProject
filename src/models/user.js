import { Actions } from 'react-native-router-flux'

export default {
  namespace: 'user',
  state: {
    name: null,
    email: null,
    phone: null,
  },
  reducers: {
    SET_data (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    RESET_data (state) {
      return {
        name: null,
        email: null,
        phone: null,
      }
    },
  },
  effects: {
    * POST_login ({ payload }, { call, put }) {
      yield put({
        type: 'SET_data',
        payload,
      })

      Actions.reset('home')
    }
  },
}
