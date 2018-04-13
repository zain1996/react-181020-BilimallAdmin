import React, {PureComponent} from 'react';
import {Table, Divider, Switch, Button} from 'antd';
import AddDialog from './dialog/AddRoleDialog';
import EditDialog from './dialog/EditRoleDialog';
import styles from './UserListTable.less';
import {connect} from 'dva'


@connect(state => ({
  groupUser: state.groupUser,
}))
class UserListTable extends PureComponent {
  state = {
    totalCallNo: 0,
    showEditUserInfo: false,
    showAddUserInfo: false,
    OrganizationId: '',
    RoleId: '',
  };


  componentWillMount() {
    const {dispatch,OrganizationId} = this.props;

    this.setState({
      OrganizationId:OrganizationId
    })

    dispatch({
      type: 'groupUser/queryRoleList',
      payload: {
        page: 1,
        id: OrganizationId,
        page_size: 10
      }
    });
  }

  closeEditDialog = () => {
    this.setState({showEditUserInfo: false})
  };
  showEditDialog = (val) => {
    this.setState({
      RoleId:val,
      showEditUserInfo: true
    })
  };
  showAddDialog = () => {
    this.setState({showAddUserInfo: true})
  };

  closeAddDialog = () => {
    this.setState({showAddUserInfo: false})
  };

  submitRole = () => {
    const {dispatch, groupUser: {addRoles: {Modules}}, OrganizationId} = this.props
    const AuthorizationIds = this.getRoleMap(Modules)
    const RoleName = this.childCp.getRoleName();

    if(AuthorizationIds.length===0 || RoleName===false){
      return
    }

    dispatch({
      type: 'groupUser/uploadAddRole',
      payload: {
        ...RoleName,
        AuthorizationIds: AuthorizationIds,
        OrganizationId: OrganizationId
      }
    }).then(() => {
      this.setState({showAddUserInfo: false})
    })
  }
  submitEditRole = () => {
    const {dispatch, groupUser: {editRoles:{Modules}}, OrganizationId} = this.props
    const AuthorizationIds = this.getRoleMap(Modules)
    const RoleName = this.childEditCp.getRoleName();
    if(AuthorizationIds.length===0 || RoleName===false){
      return
    }

    dispatch({
      type: 'groupUser/uploadAddRole',
      payload: {
        ...RoleName,
        AuthorizationIds: AuthorizationIds,
        RoleId: this.state.RoleId,
        OrganizationId: OrganizationId
      }
    }).then(() => {
      this.setState({showEditUserInfo: false})
    })
  }

  getRoleMap(Modules){
    const AuthorizationIds = [];
    Modules.map((val) => {
      if (val.ModuleAuthorization.IsOwn) {
        AuthorizationIds.push(val.ModuleAuthorization.AuthorizationId)
      }

      Object.values(val.SubAuthorizations).map((chilrdenVal) => {

        if (chilrdenVal.IsOwn) {
          AuthorizationIds.push(chilrdenVal.AuthorizationId)
        }
      })
    })
    return AuthorizationIds;
  }
  ;
  render() {

    const change = (val,payload)=>{
      this.props.dispatch({
        type: 'groupUser/uploadGroupRoleState',
        payload: {
          OrganizationId:payload.OrganizationId,
          RoleId:payload.RoleId,
          IsDisable:val,
        },
      });

    }
    const {groupUser: {roles: {List, pagination, Count}, loading},OrganizationId} = this.props
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'RoleName',
      },

      {
        title: '权限',
        dataIndex: 'RoleAuthorization',

        render: list => {
          if(list){
            return Object.values(list).map((vaule,index) =>
              (
                <a key={index}>{vaule.Title}, </a>
              )
            )
          }
        }

      },
      {
        title: '操作',
        dataIndex: 'RoleId',
        render: (text,record) => (
          <div>
            <a onClick={()=>{this.showEditDialog(text)}}>修改</a>
            <Divider type="vertical"/>
            <Switch defaultChecked={!record.IsDisable} checkedChildren="开启" onChange={(val)=>{change(val,record)}} unCheckedChildren="禁用"  />
          </div>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    let isDitDialog = '';

    if(this.state.showEditUserInfo){
      isDitDialog = <EditDialog
                  RoleId={this.state.RoleId}
                  OrganizationId={OrganizationId}
                  onOk={this.submitEditRole}
                  getInstance={(childCp) => { this.childEditCp = childCp; }}
                  onCancel={this.closeEditDialog} visible={this.state.showEditUserInfo}/>
    }else{
      isDitDialog = <div></div>
    }

    return (
      <div className={styles.container}>
        <Button icon="plus" onClick={this.showAddDialog}>
          添加角色
        </Button>

        <Table
          bordered
          className={styles.table}
          loading={loading}
          rowKey='RoleId'
          dataSource={List}
          columns={columns}
          pagination={false}
        />


        <AddDialog onOk={this.submitRole} getInstance={(childCp) => { this.childCp = childCp; }}
                   onCancel={this.closeAddDialog} visible={this.state.showAddUserInfo}/>
        {isDitDialog}
      </div>
    );
  }
}

export default UserListTable;
