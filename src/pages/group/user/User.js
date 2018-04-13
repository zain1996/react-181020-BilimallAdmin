import React, {PureComponent} from 'react';
import {Input,Card} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import UserListTable from './components/UserListTable'
import RoleListTable from './components/RoleListTable'



const {Search} = Input;
export default class User extends PureComponent {
  state = {
    operationkey: '1',
    title:'',
    OrganizationId:'',
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
        title:this.state.title+'详情',
        href:`/group/groupList&/groupInfo/${this.state.OrganizationId}`
      },
      {
        title:'成员管理'
      }
    ]
    const contentList = {
      1: <UserListTable title={this.state.title} OrganizationId={this.state.OrganizationId}/>,
      2: <RoleListTable OrganizationId={this.state.OrganizationId}/>,
    };

    const tabList = [{
      key: '1',
      tab: '成员列表',
    }, {
      key: '2',
      tab: '角色管理',
    }];

    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
        tabList={tabList}
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
