const GroupBuyingMode = localStorage.getItem('GroupBuyingMode');

let api;
if(GroupBuyingMode==='2'){
  api = require('../../services/apiGroupBuyingMode')
}else{
  api = require('../../services/api')
}

const {
  queryOrderFormList,
  queryOrderInfo,
} = api;


export default {
  namespace: 'orderForm',

  state: {
    data:{
      List:[],
      Count:0
    },
    orderInfo:{
      TaskStatistics:[]
    },
    loading:false
  },

  effects: {
    *queryOrderFormList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryOrderFormList, payload);
      yield put({
        type: 'getOrderFormList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *queryOrderInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryOrderInfo, payload);
      yield put({
        type: 'getOrderInfo',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    getOrderFormList(state, { payload }) {
      return {
        ...state,
        data:{
          ...payload.Data
        },
      };
    },
    getOrderInfo(state, { payload }) {
      return {
        ...state,
        orderInfo:{
          ...payload.Data
        },
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
