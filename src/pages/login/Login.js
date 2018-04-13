import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './Login.less';

@connect(state => ({
  login: state.login,
}))
export default class Login extends Component {
  componentDidMount(){
    this.props.dispatch({
      type: 'login/login',
      payload: {
        redirect_uri: encodeURI('https://admin.bilimall.com.cn'),
      },
    });
  }
  render() {
    const wxScanId = 'wx_work';
    return (
      <div className={styles.main}>

        <div id={wxScanId} className={styles.wx_work}>

        </div>

      </div>
    );
  }
}
