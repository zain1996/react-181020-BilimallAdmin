import React, { Component } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import {Card, Icon, Tag, Divider, DatePicker} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PurchaseDefault from './default';
import PurchaseMonther from './monther';



@connect()
export default class GroupPurchase extends Component {

  state = {
    operationkey: 'default',
    startValue: null,
    endValue: null,
    endOpen: false,
  }

  componentWillMount(){
    const {match:{params}} = this.props;

    this.setState({
      title:params.title,
      OrganizationId:params.OrganizationId
    })
  }

  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
  }

  render() {

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
      },
      {
        title:'团购任务管理'
      }
    ]



    const contentList = {
      default: <PurchaseDefault
        OrganizationId={this.state.OrganizationId}
      />,
      mother: <PurchaseMonther
        OrganizationId={this.state.OrganizationId}
      />,
    };

    const tabList = [{
      key: 'default',
      tab: '默认',
    }, {
      key: 'mother',
      tab: '按月查看',
    }];



    return (
      <PageHeaderLayout
        title="团购任务管理"
        tabList={tabList}
        breadcrumbList={breadcrumbList}
        onTabChange={this.onOperationTabChange}
        activeTabKey={this.state.operationkey}
      >
        <Card>
        {contentList[this.state.operationkey]}
        </Card>
      </PageHeaderLayout>
    );
  }
}
