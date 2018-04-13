import React, {PureComponent} from 'react';
import { Link } from 'dva/router';
import {connect} from 'dva';
import {Table,Card,Button,Divider} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import moment from 'moment';
import {getLocalStorage}  from '../../../utils/utils';
const GroupBuyingMode = localStorage.getItem('GroupBuyingMode')
const ServerHost = GroupBuyingMode === '2' ? 'group_buying_order' : 'group_buying';
@connect(state => ({
  orderForm: state.orderForm,
}))
export default class orderForm extends PureComponent {

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
        type: 'orderForm/queryOrderFormList',
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
      type: 'orderForm/queryOrderFormList',
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
      0: <span>默认</span>,
      1: <span>销售概况单数据生成中</span>,
      2: <div>
        <Link to={`/group/groupList&/orderFormInfo/${this.state.OrganizationId}/${this.state.title}/${val.IndentId}`}>
          查看概要
        </Link>
        <Divider type="vertical" />
        <Link target="_bank" to={`/api/v1/${ServerHost}/admin/indent/invoices/${val.IndentId}?${this.checkUserInfo()}`}>点击导出</Link>
      </div>,
      3: <span>销售概况单数据生成失败</span>,
    };
    return state[val.State];
  }
  render() {
    const {orderForm:{data:{List,loading,Count}}} = this.props;
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
        title:'销售概况单',
      }
    ]

    const columns = [
      // { title: '编号', dataIndex: 'IndentId', },
      {
        title: '销售概况商品',
        dataIndex: 'IndentId',
        render:(text,record,index)=>
          record.TasksBrief.map((val,index)=><div key={index}>{this.formatTime(val.StartTime)}-{val.Title}</div>
          )
      },
      {
        title: '销售概况单生成时间',dataIndex:'CreateTime',
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
              title="销售概况单"
        >
          <Table
            bordered
            columns={columns}
            rowKey="IndentId"
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
