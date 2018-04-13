import React, { Component } from 'react';
import {Route, Switch ,Link} from 'dva/router';
import { connect } from 'dva';
import {Tag,Table, DatePicker,Button,Divider} from 'antd';
const {MonthPicker} = DatePicker;
import moment from 'moment';

@connect(state => ({
  purchase: state.groupPurchase,
}))
export default class PurchaseDefult extends Component {

  state = {
    current:1,
  }

  componentWillMount(){
    this.getData()
  }

  getData(){
    const {dispatch,OrganizationId} = this.props
    dispatch({
      type:'groupPurchase/queryPurchaseList',
      payload:{
        OrganizationId:OrganizationId,
        page:1,
        page_size:10,
      }
    })
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }


  handleTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;
    const {OrganizationId} = this.props
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
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type:'groupPurchase/queryPurchaseList',
      payload:{
        OrganizationId:OrganizationId,
        page:pagination.current,
        page_size:pagination.pageSize,
      }
    });
  }

  formatTime(val,formatString='YYYY年MM月DD'){
    return moment(val).utcOffset(val).format(formatString)
  }


  checkFlag(val){
    const shapeType = {
      0: <Tag  color="orange">未开团</Tag>,
      1: <Tag  color="green">进行中</Tag>,
      2: <Tag  color="magenta">已截单</Tag>,
      3: <Tag  color="#c1c1c1">已结团</Tag>,
      4: <Tag  color="#c1c1c1">已取消</Tag>,
    };
    return shapeType[val];
  }


  render(){
    const {purchase:{defaultData:{List,Count},loading}} = this.props

    const list = [];
    const columns = [
      {
        title: '产品',key:'TaskId',
        render:(text,record,index) =>{
          list[index] = this.formatTime(record.CreateTime);
          const isCheckTitle = list[index] === list[index-1] ? '': <h4>{list[index]}</h4>;
          return (<div key={index}>
            {isCheckTitle}
            <img style={{display:'inline-block',verticalAlign:'middle',width:100,marginRight:10}} src={record.CoverPicture}/>
            <div style={{display:'inline-block',verticalAlign:'middle'}}><h4 style={{}}>[{record.Title}]</h4>
              <div>
                市场价:<b style={{color:'#FFC107'}}>{record.Specification.MarketPriceRange.Min}~{record.Specification.MarketPriceRange.Max}</b>
                ,团购价:<b style={{color:'#FFC107'}}>{record.Specification.GroupBuyingPriceRange.Min}~{record.Specification.GroupBuyingPriceRange.Max}</b>
              </div>
              <div>
                结算价:<b style={{color:'#FFC107'}}>{record.Specification.SettlementPriceRange.Min}~{record.Specification.SettlementPriceRange.Max}</b>
                ,成本价:<b style={{color:'#FFC107'}}>{record.Specification.CostPriceRange.Min}~{record.Specification.CostPriceRange.Max}</b>
              </div>
            </div>
          </div>)
        }
      },
      {
        title: '开团日期',dataIndex:'StartTime',
        render:(text,record,index) =>(
          this.formatTime(text,'YYYY.MM.DD HH:mm')
        )
      },
      {
        title: '截单日期',dataIndex:'EndTime',
        render:(text,record,index) =>(
          this.formatTime(text,'YYYY.MM.DD HH:mm')
        )
      },
      {
        title: '备注',dataIndex:'Notes',
        render:(text,record,index) =>(
          <div style={{width:200}} title={text}>{text}</div>
        )
      },
      {
        title: '销量',dataIndex:'Sales'
      },
      {
        title: '状态',dataIndex:'GroupState',
        render:(text,record,index) =>(
          this.checkFlag(text)
        )
      },
    ]
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: this.state.current,
      total: Count,
    };
    return (

      <div>
        <Table
          size="small"
          loading={loading}
          border={false}
          rowKey={(record)=>record.TaskId}
          dataSource={List}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    )
  }

}
