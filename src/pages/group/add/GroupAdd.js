import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card,Form,Button } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FooterToolbar from '../../../components/FooterToolbar';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
const QINIU_HOST = 'http://7xjy8m.com2.z0.glb.qiniucdn.com/';
const QINIU_SERVER = 'https://up-z2.qiniup.com'

@Form.create()
class StepForm extends PureComponent {

  sumbit(){
    this.props.form.validateFields((err, values) => {
      if(!err){
        this.props.dispatch({
          type: 'group/uploadGroupAddDate',
          payload: {
            ...this.props.stepFormData,
            ...values,
          },
        });
      }
    })
  }

  render() {
    const { form, stepFormData, submitting, dispatch,loading,tokens } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 15,
      },
    };

    const breadcrumbList = [
      {
        title:'首页',
        href:'/'
      },
      {
        title:'团购组织管理',
        href:'/group/groupList'
      }
      ,
      {
        title:'添加组织',
      }
    ]

    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
      >
        <Card bordered={false}>
          <div>
            <Step1
              QINIU_HOST={QINIU_HOST}
              QINIU_SERVER={QINIU_SERVER}
              formItemLayout={formItemLayout}
              form={form}
              tokens={tokens}
              loading={loading}
              dispatch={dispatch}
              data={stepFormData}
              submitting={submitting}
              props={this.props}
            />
            <Step2
              QINIU_HOST={QINIU_HOST}
              QINIU_SERVER={QINIU_SERVER}
              formItemLayout={formItemLayout}
              form={form}
              tokens={tokens}
              loading={loading}
              dispatch={dispatch}
              data={stepFormData}
              submitting={submitting}
              props={this.props}
            />
            <Step3
              QINIU_HOST={QINIU_HOST}
              QINIU_SERVER={QINIU_SERVER}
              formItemLayout={formItemLayout}
              form={form}
              tokens={tokens}
              loading={loading}
              dispatch={dispatch}
              data={stepFormData}
              submitting={submitting}
              props={this.props}
            />
            <Step4
              QINIU_HOST={QINIU_HOST}
              QINIU_SERVER={QINIU_SERVER}
              formItemLayout={formItemLayout}
              form={form}
              tokens={tokens}
              loading={loading}
              dispatch={dispatch}
              data={stepFormData}
              submitting={submitting}
              props={this.props}
            />
          </div>
          <FooterToolbar style={{ width: '100%' }}>
            <Button type="primary" loading={loading} onClick={()=>{this.sumbit()}}>
              提交
            </Button>
          </FooterToolbar>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default connect(state => ({
  stepFormData: state.group.groupAddFromData.data,
  tokens: state.getToken.tokens,
  submitting: state.group.groupAddFromData.stepFormSubmitting,
  loading: state.group.loading,
}))(StepForm);
