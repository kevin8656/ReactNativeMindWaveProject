import * as user from '../services/user';

export default {
  namespace: 'user',
  state: {
    name: null,
    email: null,
    phone: null,
  },
  reducers: {
    postData(state, action) {
      return {
        ...state,
        ...action.userData,
      };
    },
    logout(state, action) {
      return {
        ...state,
        name: null,
        email: null,
        phone: null,
      };
    },
  },
  effects: {
    *POST_data(action, { call, put }) {
      const { data } = yield call(user.POST_login);
      yield put({ type: 'postData', userData: action.userData });
    },
  },
}
