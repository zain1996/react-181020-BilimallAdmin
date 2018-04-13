import {queryBasicInfo } from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    loading: false,
    currentUser: {},
  },

  effects: {
    *fetchUser(_, { call, put , select}) {

      const user = yield select(state => state.login.user);

      const response = yield call(queryBasicInfo,user);

      yield put({
        type: 'saveUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveUser(state, action) {
      return {
        ...state,
        currentUser: action.payload.Data,
      };
    }
  },
};
