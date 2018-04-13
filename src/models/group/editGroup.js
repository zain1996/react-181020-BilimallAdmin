import {
  queryGroupListInfo as queryGroupEdit,
  uploadGroupEditDate,
} from '../../services/api';
import {getLocalStorage} from '../../utils/utils'
import {routerRedux} from 'dva/router'

export default {
  namespace: 'editGroup',

  state: {
    data:[],
    regularFormSubmitting: false,
    stepFormSubmitting: false,
    advancedFormSubmitting: false,
    loading: false,
  },

  effects: {
    *queryGroupEdit({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const authorization = (e)=>{
        const userData = getLocalStorage('userData');
        return `/api/v1/user/admin/user/access_id_card_pic?_token=${userData.token}&_uid=${userData.uid}&uri=${encodeURI(e)}`
      }

      const response = yield call(queryGroupEdit, payload);
      if(!response.Code){
        response.Data.tempLogo = response.Data.Logo
        response.Data.tempManagerIdCardBack = authorization(response.Data.ManagerIdCardBack)
        response.Data.tempManagerIdCardFront = authorization(response.Data.ManagerIdCardFront)
        response.Data.tempLicensePicture = response.Data.LicensePicture
      }
      yield put({
        type: 'getGroupEdit',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *uploadGroupEditDate({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(uploadGroupEditDate, payload);
      if(response.Message==='success'){
        yield put(routerRedux.push('/group/groupList'));
      }
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
    getGroupEdit(state, action) {
      return {
        ...state,
        data: action.payload.Data,
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
