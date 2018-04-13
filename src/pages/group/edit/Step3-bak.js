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
    type:'getToken/queryIdCardPicToken',
    payload:{
      FileNames:[file.name],
    }
  })

}

class Step3 extends PureComponent {

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

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;

    }
    return e && e.fileList;
  }

  render(){

    const { formItemLayout, form, data, dispatch,loading,OrganizationId,prev,tokens,QINIU_SERVER} = this.props;
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
      });
      prev()
    };

    const onValidateForm = (e) => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'editGroup/uploadGroupEditDate',
            payload: {
              ...data,
              ...values,
            },
          });
        }
      });
    };
    const uploadButton = (name)=> (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">{name}</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    const upload = (name)=>
       (
          <Upload
            name="avatar"
            className={styles.avatarUploader}
            listType="picture-card"
            showUploadList={false}
            action="//jsonplaceholder.typicode.com/posts/"
            beforeUpload={beforeUpload}
            onChange={this.handleChange}
          >
            {imageUrl ? <img src={imageUrl} alt="" /> : uploadButton(name)}
          </Upload>
      )


    return (
      <Form layout="horizontal" className={styles.stepForm}>
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
          label="管理员手机"
        >
          {data.ManagerMobile}
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
            {data.ManagerIdCardFront ? <img src={data.ManagerIdCardFront} width='100%' alt="" /> : <div>
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
            {data.ManagerIdCardBack ? <img src={data.ManagerIdCardBack} width='100%' alt="" /> : <div>
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

          <Button type="primary" onClick={onValidateForm} loading={loading}>
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
};

export default Step3;
