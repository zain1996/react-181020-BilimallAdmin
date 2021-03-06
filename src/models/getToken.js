import {
  queryIdCardPicToken,
  queryPicToken
} from '../services/getTokenApi';

import {routerRedux} from 'dva/router'

export default {
  namespace: 'getToken',

  state: {
    tokens:{},
  },

  effects: {
    *queryIdCardPicToken({ payload }, { call, put }) {
      const response = yield call(queryIdCardPicToken, payload);
      yield put({
        type: 'setTokens',
        payload: response.Data.Tokens[0],
      });
    },
    *queryPicToken({ payload }, { call, put }) {
      const response = yield call(queryPicToken, payload);
      yield put({
        type: 'setTokens',
        payload: response.Data.Tokens[0],
      });
    },
  },
  reducers:{
    setTokens(state, action) {
      return {
        ...state,
        tokens: {
          key:action.payload.Key,
          AccessUrl:action.payload.AccessUrl,
          StoreUrl:action.payload.StoreUrl,
          name:action.payload.OriginalFileName,
          token:action.payload.Token,
        },
      };
    },
  },
};
