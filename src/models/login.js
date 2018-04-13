import { routerRedux } from 'dva/router';
import { setLocalStorage,getLocalStorage } from '../utils/utils';
import { fakeAccountLogin } from '../services/api';
import  '../utils/wwlogin-1.0.0';

function GetQueryString(url,name)
{
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = url.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}

const setUserData = (token,uid) => {
  let userData = {
    token:token,
    uid:uid
  }
  setLocalStorage("userData",userData)
}

export default {
  namespace: 'login',

  state: {
    isLogin : false,
    user: {}
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);

      if(response.Code === 0){
        var wxInfo = response.Data;
        wxInfo.id = "wx_work";
        window.WwLogin(wxInfo);
      }
    },
    *logout({ payload }, { call, put }) {
      localStorage.removeItem("userData");
      yield put({
          type:  "changeLoginState",
          payload: {
            isLogin:false,
          }
        },
      )
      yield put(routerRedux.push('/user/login'));
    },
  *check({ payload }, { call, put }) {

      const url = payload.url;
      const uid = GetQueryString(url,'uid');
      const token = GetQueryString(url,'token');
      if(token && uid){
        setUserData(token,uid);
      }
      const userData = getLocalStorage("userData");
      if(!userData && (!token && !uid)){
        yield put(routerRedux.push('/user/login'));
      }else{
        yield put({
            type:  "changeLoginState",
            payload: {
              isLogin:true,
              user : userData
            }
          },
        )
      }
    }
  },

  reducers: {
    changeLoginState(state, {payload}) {
      return {
        ...state,
        isLogin: payload.isLogin,
        user: payload.user,
      }
    }

  },
};
