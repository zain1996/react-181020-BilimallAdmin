import React, {PureComponent} from 'react';
import { Link } from 'dva/router';
import {connect} from 'dva';
import {Table, Button,Divider,Card,Input,Radio} from 'antd';
import styles from './GroupCommunity.less';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
const {Search} = Input;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import {getLocalStorage} from '../../../utils/utils'
const userData = getLocalStorage('userData');
@connect(state => ({
  group: state.group,
}))
export default class StandardTable extends PureComponent {

  state = {
    title:0,
    OrganizationId:0,
    current:0,
    audit_state:1,
    expandedRowKeys:[],
    searchValue:'',
  };

  componentDidMount() {

    const {match:{params},dispatch} = this.props;

    this.setState({
      title:params.title,
      OrganizationId:params.OrganizationId
    },()=>{
      dispatch({
        type: 'group/queryGroupCommunity',
        payload:{
          page:1,
          page_size:10,
          audit_state:1,
          OrganizationId:this.state.OrganizationId
        }
      });
    })

  }
  accountListTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;
    this.setState({
      current:pagination.current
    })
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      OrganizationId: this.state.OrganizationId,
      audit_state:this.state.audit_state,
      search:this.state.searchValue,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'group/queryGroupCommunity',
      payload: params,
    });
  }

  getInfo(isOpen,val){

    if(isOpen){
      this.props.dispatch({
        type: 'group/queryGroupCommunityInfo',
        payload: {
          GroupId:val.GroupId,
          OrganizationId:val.OrganizationId,
        }
      }).then(()=>{
        this.setState({
          expandedRowKeys:[val.GroupId]
        })
      });
    }else{
      this.setState({
        expandedRowKeys:[]
      })
    }
    return false;
  }

  authorization(e){
    return `/api/v1/user/admin/user/access_id_card_pic?_token=${userData.token}&_uid=${userData.uid}&uri=${encodeURI(e)}`
  }

  search(val){
    const {dispatch} = this.props;
    this.setState({
      searchValue:val,
      current:1
    },()=>{
      dispatch({
        type: 'group/queryGroupCommunity',
        payload:{
          page:1,
          OrganizationId: this.state.OrganizationId,
          page_size:10,
          audit_state:this.state.audit_state,
          search:val
        },
      });
    })
  }
  radioOnChange(val){
    const {dispatch} = this.props;
    this.setState({
      audit_state:val.target.value,
      current:1
    },()=>{
      dispatch({
        type: 'group/queryGroupCommunity',
        payload:{
          page:1,
          OrganizationId: this.state.OrganizationId,
          page_size:10,
          audit_state:this.state.audit_state,
          search:this.state.search
        },
      });
    })
  }
  render() {
    const {group:{groupCommunityData,loading,pagination}} = this.props;
    const {List} = groupCommunityData;
    const userInfo = ()=>{
      const {group:{groupCommunityInfo}} = this.props;
      const data = groupCommunityInfo;
      return  (
        <div>
          <div>
            <span>所属团组织：</span>
            <span>{data.OrganizationName}</span>
          </div>
          <div>
            <span>管辖社团名称：</span>
            <span>{data.Name}</span>
          </div>
          <div>
            <span>关联成员账号：</span>
            <span>{data.ManagerMobile}</span>
          </div>
          <div>
            <span>姓名：</span>
            <span>{data.ManagerName}</span>
          </div>
          <div>
            <span>手机号：</span>
            <span>{data.ManagerMobile}</span>
          </div>
          <Divider/>
          <div>
            <span>身份证正反面照片：</span>
            <span>
              {data.ManagerIdCardFront?
                <a style={{marginRight:10}} target="_bank" href={this.authorization(data.ManagerIdCardFront)}>查看</a>:<span style={{marginRight:10}}>查看</span>
              }
              {data.ManagerIdCardBack?
                <a target="_bank" href={this.authorization(data.ManagerIdCardBack)}>查看</a>:'查看'
              }
            </span>
          </div>
          <div>
            <span>身份证号：</span>
            <span>{data.ManagerIdCardNumber}</span>
          </div>
          <div>
            <span>联系地址：</span>
            <span>{data.Address}</span>
          </div>
        </div>
      )
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
        title:'社团管理',
      }
    ]

    const columns = [
      { title: '所属团组织',dataIndex: '',render:()=>{return this.state.title}} ,
      { title: '社团名称', dataIndex: 'Name'},
      { title: '团长姓名', dataIndex: 'ManagerName'},
      { title: '手机号', dataIndex: 'ManagerMobile'},
      { title: '提货地址', dataIndex: 'Address'},
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current:this.state.current,
      total: groupCommunityData.Count,
      ...pagination,
    };

    const extraContent = (
      <div >
        <Search
          enterButton
          placeholder="用户名/手机号"
          onSearch={(e) => {this.search(e)}}
        />
      </div>
    );
    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}>
        <Card bordered={false}
              extra={extraContent}
              title="社团列表">

          <div>
            <div className={styles.standardTable}>
              {/*<RadioGroup onChange={this.radioOnChange.bind(this)} style={{marginBottom:20}} defaultValue="1">*/}
                {/*<RadioButton value="1">已审核</RadioButton>*/}
                {/*<RadioButton value="2">未审核</RadioButton>*/}
              {/*</RadioGroup>*/}

              <Table
                columns={columns}
                rowKey="GroupId"
                expandedRowRender={record => userInfo(record)}
                expandRowByClick
                expandedRowKeys={this.state.expandedRowKeys}
                onExpand={(val,text)=>{this.getInfo(val,text)}}
                dataSource={List}
                loading={loading}
                pagination={paginationProps}
                onChange={this.accountListTableChange}
              />

            </div>
          </div>
        </Card>
      </PageHeaderLayout>

    );
  }
}

