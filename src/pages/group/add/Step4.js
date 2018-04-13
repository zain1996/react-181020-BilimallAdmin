import React from 'react';
import { Form, Radio} from 'antd';
import styles from './style.less';

export default ({form, data,formItemLayout }) => {

  const { getFieldDecorator } = form;
  const RadioGroup = Radio.Group;
  const RadioStyle = {
    lineHeight:'15px',
    fontSize:12,
    color:'#d9d9d9'
  }
  return (
      <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
        <h2 style={{color:'green'}}>
          团购模式设置
        </h2>
        <Form.Item
          {...formItemLayout}
          label="团购模式"
        >
          {getFieldDecorator('GroupBuyingMode', {
            initialValue: data.GroupBuyingMode || 1,
          })(
            <RadioGroup>
              <Radio value={1}>团长报单模式
              </Radio>
              <p style={RadioStyle}>团长报单模式，小程序仅支持团长端，且团长通过手动报单的方式把销售量上报，团购任务不支持库存控制和秒杀模式</p>
              <Radio value={2}>
                团长下单模式
              </Radio>
              <p style={RadioStyle}>团长下单模式，小程序仅支持团长端，团长可以通过下单的方式提交销售情况，且支持团长销售情况统计，团购任务支持库存控制和秒杀模式</p>
            </RadioGroup>
          )}

        </Form.Item>
      </Form>
  );
};
