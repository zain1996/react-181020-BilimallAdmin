import React, {PureComponent} from 'react';
import { Link } from 'dva/router';
import {connect} from 'dva';
import {Table,Card,Button} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import moment from 'moment';
import {getLocalStorage}  from '../../../utils/utils';
const GroupBuyingMode = localStorage.getItem('GroupBuyingMode')
const ServerHost = GroupBuyingMode === '2' ? 'group_buying_order' : 'group_buying';
@connect(state => ({
  distribution: state.distribution,
}))
export default class distributionList extends PureComponent {

  state = {
    title:0,
    OrganizationId:0,
  };

  componentDidMount() {

    const {match:{params},dispatch} = this.props;

    this.setState({
      title:params.title,
      OrganizationId:params.OrganizationId
    },()=>{
      dispatch({
        type: 'distribution/queryDistributionList',
        payload:{
          page:1,
          page_size:10,
          OrganizationId:this.state.OrganizationId
        }
      });
    })

  }
  accountListTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      OrganizationId: this.state.OrganizationId,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'group/queryGroupDistributionList',
      payload: params,
    });
  }

  formatTime(val,formatString='YYYY年MM月DD日'){
    return moment(val).utcOffset(val).format(formatString)
  }
  checkUserInfo(){
    const userData = getLocalStorage('userData');
    return `&_uid=${userData.uid}&_token=${userData.token}`
  }
  checkState(val){
    const state = {
      0: <a>默认</a>,
      1: <a>送货单数据生成中</a>,
      2: <Link target="_bank" to={`/api/v1/${ServerHost}/admin/send/invoices/${val.SendId}?${this.checkUserInfo()}`}>点击导出</Link>,
      3: <a>送货单数据生成失败</a>,
    };
    return state[val.State];
  }
  render() {
    const {distribution:{data:{List,loading,Count}}} = this.props;
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
        title:this.state.title,
        href:`/group/groupList&/groupInfo/${this.state.OrganizationId}`
      }
      ,
      {
        title:'送货单',
      }
    ]

    const columns = [
      // { title: '编号', dataIndex: 'SendId', },
      {
        title: '送货商品',
        dataIndex: 'SendId',
        render:(text,record,index)=>
          record.TasksBrief.map((val,index)=><div key={index}>{this.formatTime(val.StartTime)}-{val.Title}</div>
          )
      },
      {
        title: '配货单生成时间',dataIndex:'CreateTime',
        render:(text,record,index)=>
          (
            this.formatTime(text)
          )

      },
      {
        title: '操作', dataIndex: 'State',
        render:(text,record)=>(<div>{this.checkState(record)}</div>)
      }

    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: Count
    };

    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}>
        <Card bordered={false}
              title="送货单"
        >
          <Table
            bordered
            columns={columns}
            rowKey="SendId"
            dataSource={List}
            loading={loading}
            pagination={paginationProps}
            onChange={this.accountListTableChange}
          />
        </Card>
      </PageHeaderLayout>

    );
  }
}
