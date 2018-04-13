import React, {PureComponent} from 'react';
import { Link } from 'dva/router';
import {connect} from 'dva';
import {Table,Card,Button,Tabs} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import moment from 'moment';
const TabPane = Tabs.TabPane;

@connect(state => ({
  distribution: state.distribution,
}))
export default class distributionRoute extends PureComponent {

  state = {
    title:0,
    OrganizationId:0,
    LineId:null,
    current:1,
  };

  componentDidMount() {

    const {match:{params},dispatch} = this.props;

    this.setState({
      title:params.title,
      OrganizationId:params.OrganizationId
    },()=>{
      dispatch({
        type: 'distribution/queryDistributionRoute',
        payload:{
          page:1,
          page_size:49,
          OrganizationId:this.state.OrganizationId
        }
      });
    })

  }

  formatTime(val,formatString='YYYY年MM月DD日'){
    return moment(val).utcOffset(val).format(formatString)
  }

  TableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;
    this.setState({
      current:pagination.current,
    })
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      LineId:this.state.LineId,
      OrganizationId: this.state.OrganizationId,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'distribution/queryDistributionRouteCommunity',
      payload: params,
    });
  }
  tabsChange(val){
    const {dispatch} = this.props;
    this.setState({
        LineId:val,
        current:1,
      },()=>{
      dispatch({
        type: 'distribution/queryDistributionRouteCommunity',
        payload: {
          OrganizationId:this.state.OrganizationId,
          LineId:this.state.LineId,
          page_size: 10,
          page:1,
        },
      })
    })
  }
  render() {
    const {distribution:{route,routeCommunity,loading,currentLineId}} = this.props;
    const columns = [
      { title: '社团名称', dataIndex: 'GroupName', },
      {
        title: '团长名称',dataIndex:'ManagerName'
      },
      {
        title: '手机号',dataIndex:'ManagerMobile'

      },
      // {
      //   title: '操作',
      //   render:(text)=>(
      //     <a>移除</a>
      //   )
      //
      // }

    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: routeCommunity.Count,
      current: this.state.current,
    };
    const getList=(val)=>{

      return val.map((val,index)=>{
        return <TabPane style={{paddingLeft:0}} tab={val.Name} key={val.LineId}>
          <Table
            columns={columns}
            rowKey="GroupId"
            dataSource={routeCommunity.List}
            loading={loading}
            pagination={paginationProps}
            onChange={this.TableChange}
          />
        </TabPane>
      })
    }


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
        title:'路线列表',
      }
    ]

    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}>
        <Card bordered={false}
              title="路线列表"
        >
          <Tabs
            defaultActiveKey={currentLineId}
            tabPosition='left'
            style={{ height: 650}}
            onChange={this.tabsChange.bind(this)}
          >
            {getList(route.List)}
          </Tabs>

        </Card>

      </PageHeaderLayout>

    );
  }
}
