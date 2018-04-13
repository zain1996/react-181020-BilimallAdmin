import React, {PureComponent} from 'react';
import { Form, Input, Button, Upload, message ,Icon} from 'antd';

import styles from './style.less';


function beforeUpload(file) {
  const {dispatch} = this.props

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
    return
  }
  return  dispatch({
    type:'getToken/queryPicToken',
    payload:{
      FileNames:[file.name],
    }
  })

}

class Step2 extends PureComponent {

  state = {
    loading: false,
  };

  onChange = (info,name) => {
    const {dispatch,data,QINIU_HOST} = this.props;
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {

      dispatch({
        type: 'editGroup/setEditDate',
        payload: {
          ...data,
          [name]: QINIU_HOST + info.file.response.img
        },
      });

      this.setState({
        loading: false,
      })
    }
  }
  render(){

  const { formItemLayout, form, data,dispatch,prev,next,tokens,QINIU_SERVER} = this.props;

  const { getFieldDecorator, validateFields } = form;

  const onPrev = () => {
    validateFields((err, values) => {
        dispatch({
          type: 'editGroup/setEditDate',
          payload: {
            ...data,
            ...values,
          },
        });
        prev()
    });
  };

  const onNext = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'editGroup/setEditDate',
          payload: {
            ...data,
            ...values,
          },
        });
        next();
      }
    });
  };


  return (
    <Form layout="horizontal" className={styles.stepForm}>
      <Form.Item
        {...formItemLayout}
        label="组织名称"
      >
        {getFieldDecorator('Name', {
          initialValue: data.Name || '',
          rules: [{ required: true, message: '组织名称不能为空' }]
        })(
          <Input placeholder="" />
        )}
      </Form.Item>

      <Form.Item
        {...formItemLayout}
        label='组织logo'
      >
        <Upload
          name="file"
          data={tokens}
          className={styles.avatarUploader}
          listType="picture-card"
          showUploadList={false}
          action={QINIU_SERVER}
          beforeUpload={beforeUpload.bind(this)}
          onChange={(e)=>{this.onChange(e,'Logo')}}
        >
          {data.Logo ? <img src={data.Logo} width='100%' alt="" /> : <div>
            <Icon type={this.state.loading ? 'loading' : 'plus'} />
            <div className="ant-upload-text">上传</div>
          </div>}
        </Upload>
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="企业名称"
      >
        {getFieldDecorator('CompanyName', {
          initialValue: data.CompanyName || '',
          rules: [{ required: true, message: '企业名称不能为空' }]
        })(
          <Input placeholder="请填写工商营业执照上的企业全称" />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="企业开户名称"
      >
        {getFieldDecorator('BankAccountName', {
          initialValue: data.BankAccountName || '',
          rules: [{ required: true, message: '企业开户名称不能为空' }]
        })(
          <Input placeholder="请填写企业开户名称" />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="企业开户银行"
      >
        {getFieldDecorator('BankName', {
          initialValue: data.BankName || '',
          rules: [{ required: true, message: '企业开户银行不能为空' }]
        })(
          <Input placeholder="如：招商银行" />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="企业银行账户"
      >
        {getFieldDecorator('BankAccount', {
          initialValue: data.BankAccount || '',
          rules: [{ required: true, message: '企业银行账户不能为空' }]
        })(
          <Input />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="所在省份"
      >
        {getFieldDecorator('Province', {
          initialValue: data.Province || '',
          rules: [{ required: true, message: '所在省份不能为空' }]
        })(
          <Input placeholder="如：广东省" />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="所在城市"
      >
        {getFieldDecorator('City', {
          initialValue: data.City || '',
          rules: [{ required: true, message: '所在城市不能为空' }]
        })(
          <Input placeholder="如：深圳市" />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="营业执照注册号"
      >
        {getFieldDecorator('LicenseNumber', {
          initialValue: data.LicenseNumber || '',
          rules: [{ required: true, message: '营业执照注册号不能为空' }]
        })(
          <Input placeholder="" />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="营业执照片"
      >
        <Upload
          name="file"
          data={tokens}
          className={styles.avatarUploader}
          listType="picture-card"
          showUploadList={false}
          action={QINIU_SERVER}
          beforeUpload={beforeUpload.bind(this)}
          onChange={(e)=>{this.onChange(e,'LicensePicture')}}
        >
          {data.LicensePicture ? <img src={data.LicensePicture} width='100%' alt="" /> : <div>
            <Icon type={this.state.loading ? 'loading' : 'plus'} />
            <div className="ant-upload-text">上传</div>
          </div>}
        </Upload>
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="联系地址"
      >
        {getFieldDecorator('Address', {
          initialValue: data.Address || '',
          rules: [{ required: true, message: '联系地址不能为空' }]
        })(
          <Input placeholder="企业所在地址" />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="邮政编码"
      >
        {getFieldDecorator('PostCode', {
          initialValue: data.PostCode || '',
          rules: [{ required: true, message: '邮政编码不能为空' }]
        })(
          <Input placeholder="邮政编码"/>
        )}
      </Form.Item>
      <Form.Item
        style={{ marginBottom: 8 }}
        wrapperCol={{
          xs: { span: 24, offset: 0 },
          sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
        }}
        label=""
      >
        <Button onClick={onPrev} style={{ marginRight: 8 }}>
          上一步
        </Button>

        <Button type="primary" onClick={onNext}>
          下一步
        </Button>
      </Form.Item>
    </Form>
  );
  }
};

export default Step2;
