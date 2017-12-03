export default {
  namespace: 'scene',
  state: {
    name: 'SEX',
    id: '1'
  },
  reducers: {
    SET_scene(state, { selection }) {
      return {
        ...state,
        ...selection,
      }
    },
  },
  effects: {},
}
