import React from 'react';
import { Form, Input} from 'antd';
import styles from './style.less';


export default ({form,data,formItemLayout }) => {

  const { getFieldDecorator} = form;

  return (
      <Form layout="horizontal" className={styles.stepForm}>
        <h2 style={{color:'green'}}>
          添加管理员账号
        </h2>
        <Form.Item
          {...formItemLayout}
          label="管理员账号"
        >
          {getFieldDecorator('ManagerMobile', {
            initialValue: data.ManagerMobile || '',
            validateTrigger: 'onBlur',
            rules: [
              {
                required: true, message: '管理员账号不能为空' },
              {
                pattern: /^1\d{10}$/, message: '手机号格式错误！',
              }
            ],
          })(
            <Input placeholder="手机号" />
          )}

        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="用户名"
        >
          {getFieldDecorator('ManagerNickName', {
            initialValue: data.ManagerNickName || '',
            rules: [{ required: true, message: '用户名不能为空' }],
          })(
            <Input placeholder="昵称/真实姓名" />
          )}
        </Form.Item>
      </Form>
  );
};
