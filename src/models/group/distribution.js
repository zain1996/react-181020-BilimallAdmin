const GroupBuyingMode = localStorage.getItem('GroupBuyingMode');

let api;
if(GroupBuyingMode==='2'){
  api = require('../../services/apiGroupBuyingMode')
}else{
  api = require('../../services/api')
}

const {
  queryDistributionList,
  queryDistributionRoute,
  queryDistributionRouteCommunity,
} = api;

export default {
  namespace: 'distribution',

  state: {
    data:{
      List:[],
      Count:0
    },
    route:{
      List:[]
    },
    routeCommunity:{
      List:[]
    },
    currentLineId:'',
    loading:false
  },

  effects: {
    *queryDistributionList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryDistributionList, payload);
      yield put({
        type: 'getDistributionList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *queryDistributionRoute({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryDistributionRoute, payload);
      if(response.Data.Count>0){
        yield put({
          type:'queryDistributionRouteCommunity',
          payload:{
            ...payload,
            LineId : response.Data.List[0].LineId
          }
        });
        yield put({
          type:'setCurrentLineId',
          payload:`${response.Data.List[0].LineId}`
        });
      }
      yield put({
        type: 'getDistributionRoute',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *queryDistributionRouteCommunity({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryDistributionRouteCommunity, payload);
      yield put({
        type: 'getDistributionRouteCommunity',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    getDistributionList(state, { payload }) {
      return {
        ...state,
        data:{
          ...payload.Data
        },
      };
    },
    getDistributionRoute(state, { payload }) {
      return {
        ...state,
        route:{
          ...payload.Data
        },
      };
    },
    getDistributionRouteCommunity(state, { payload }) {
      return {
        ...state,
        routeCommunity:{
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
    setCurrentLineId(state,action){
      return {
        ...state,
        currentLineId:action.payload
      }
    }
  },
};
