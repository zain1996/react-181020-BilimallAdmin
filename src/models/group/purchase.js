const GroupBuyingMode = localStorage.getItem('GroupBuyingMode');

let api;
if(GroupBuyingMode==='2'){
  api = require('../../services/apiGroupBuyingMode')
}else{
  api = require('../../services/api')
}

const {
  queryPurchaseList,
  queryPurchaseMontherList,
} = api;


export default {
  namespace: 'groupPurchase',

  state: {
    defaultData:{
      List:[]
    },
    montherData:{
      List:[]
    },
    loading:false
  },

  effects: {
    *queryPurchaseList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryPurchaseList, payload);
      yield put({
        type: 'getPurchaseList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *queryPurchaseMontherList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryPurchaseMontherList, payload);
      yield put({
        type: 'getPurchaseMontherList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    setEditDate(state, { payload }) {
      return {
        ...state,
        data:{
          ...payload
        },
      };
    },
    getPurchaseList(state, action) {
      return {
        ...state,
        defaultData: action.payload.Data,
      };
    },
    getPurchaseMontherList(state, action) {
      return {
        ...state,
        montherData: action.payload.Data,
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
