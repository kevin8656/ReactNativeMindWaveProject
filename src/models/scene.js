export default {
  namespace: 'scene',
  state: {
    name: 'SEX',
    id: '1'
  },
  reducers: {
    SET_scene(state, { payload }) {
      return {
        ...state,
        name: payload.name,
        id: payload.id,
      }
    },
  },
  effects: {},
}
