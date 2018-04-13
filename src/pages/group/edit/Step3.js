import React, {PureComponent} from 'react';
import { Form, Input, Upload, message ,Icon} from 'antd';
import styles from './style.less';

function beforeUpload(file) {
  const {dispatch} = this.props
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
    return
  }
  return  dispatch({
    type:'getToken/queryIdCardPicToken',
    payload:{
      FileNames:[file.name],
    }
  })

}

class StepForm extends PureComponent {

  state = {
    loading: false,
  };

  onChange = (info,name) => {
    const {dispatch,data,tokens} = this.props;
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {

      dispatch({
        type: 'editGroup/setEditDate',
        payload: {
          ...data,
          [name]: tokens.StoreUrl,
          ['temp'+name]:tokens.AccessUrl
        },
      });

      this.setState({
        loading: false,
      })
    }
  }

  render(){

    const { formItemLayout, form, data,tokens,QINIU_SERVER } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <h2 style={{color:'green'}}>
          填写组织信息
        </h2>
        <Form.Item
          {...formItemLayout}
          label="管理员姓名"
        >
          {getFieldDecorator('ManagerName', {
            initialValue: data.ManagerName || '',
            rules: [{ required: true, message: '管理员姓名不能为空' }],
          })(
            <Input placeholder="管理员真实姓名" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="身份证正反面照片"
        >
          <Upload
            name="file"
            data={tokens}
            className={styles.avatarUploader}
            listType="picture-card"
            showUploadList={false}
            action={QINIU_SERVER}
            beforeUpload={beforeUpload.bind(this)}
            onChange={(e)=>{this.onChange(e,'ManagerIdCardFront')}}
          >
            {data.tempManagerIdCardFront ? <img src={data.tempManagerIdCardFront} width='100%' alt="" /> : <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">上传身份证正面照片</div>
            </div>}
          </Upload>
          <Upload
            name="file"
            data={tokens}
            className={styles.avatarUploader}
            listType="picture-card"
            showUploadList={false}
            action={QINIU_SERVER}
            beforeUpload={beforeUpload.bind(this)}
            onChange={(e)=>{this.onChange(e,'ManagerIdCardBack')}}
          >
            {data.tempManagerIdCardBack ? <img src={data.tempManagerIdCardBack} width='100%' alt="" /> : <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">身份证反面照片</div>
            </div>}
          </Upload>

        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="身份证号"
        >

          {getFieldDecorator('ManagerIdCardNumber', {
            initialValue: data.ManagerIdCardNumber || '',
            rules: [{ required: true, message: '身份证号不能为空' }],
          })(
            <Input placeholder="" />
          )}
        </Form.Item>
      </Form>
    );
  }
};

export default StepForm;
