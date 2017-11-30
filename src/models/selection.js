export default {
  namespace: 'selection',
  state: {
    name: 'SEX',
    id: '1'
  },
  reducers: {
    saveSelection(state, action) {
      return {
        ...state,
        ...action.selection,
      };
    },
  },
  effects: {
    *save_selection(action, { call, put }) {
      yield put({ type: 'saveSelection', selection: action.selection });
    },
  },
}
