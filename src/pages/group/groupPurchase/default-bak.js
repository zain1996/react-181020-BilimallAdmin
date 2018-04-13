import React, { Component } from 'react';
import {Route, Switch } from 'dva/router';
import { connect } from 'dva';
import {Card, Icon, Row,Tag,Col, Divider} from 'antd';
import moment from 'moment';
import style from './default.less';

@connect(state => ({
  purchase: state.groupPurchase,
}))
export default class PurchaseDefault extends Component {

  componentWillMount(){

    const {dispatch,OrganizationId} = this.props
    dispatch({
      type:'groupPurchase/queryPurchaseList',
      payload:{
        OrganizationId:OrganizationId,
        page:1,
        page_size:49
      }
    }).then(()=>{

    })
  }

  checkFlag(val){
    const shapeType = {
      0: <Tag style={{position: 'absolute',right:0, top:0,margin:0}} color="orange">未开团</Tag>,
      1: <Tag style={{position: 'absolute',right:0, top:0,margin:0}} color="green">进行中</Tag>,
      2: <Tag style={{position: 'absolute',right:0, top:0,margin:0}} color="magenta">已截单</Tag>,
      3: <Tag style={{position: 'absolute',right:0, top:0,margin:0}} color="#c1c1c1">已结团</Tag>,
      4: <Tag style={{position: 'absolute',right:0, top:0,margin:0}} color="#c1c1c1">已取消</Tag>,
    };
    return shapeType[val];
  }
  formatTime(val,formatString='YYYY年MM月DD'){
    return moment(val).utcOffset(val).format(formatString)
  }
  getSpecification(v1,v2){
    if(v1===v2){
      return v2;
    }else{
      return v1+'~'+v2
    }
  }
  getList(List){
    const list = [];
    return List.map((val,i)=>{
      list[i] = this.formatTime(val.CreateTime);
      const isCheck = list[i] === list[i-1]
      return (
        !isCheck ? <div key={i}>
        <h2>{list[i]}</h2>
        <Divider type="horizontal" />
          <Row gutter={16}>
          {List.map((value,q)=>{
            let MarketPriceRange = this.getSpecification(value.Specification.MarketPriceRange.Min,value.Specification.MarketPriceRange.Max);
            let GroupBuyingPriceRange = this.getSpecification(value.Specification.GroupBuyingPriceRange.Min,value.Specification.GroupBuyingPriceRange.Max);
            let SettlementPriceRange = this.getSpecification(value.Specification.SettlementPriceRange.Min,value.Specification.SettlementPriceRange.Max);
            let CostPriceRange = this.getSpecification(value.Specification.CostPriceRange.Min,value.Specification.CostPriceRange.Max);

            return this.formatTime(value.CreateTime)===list[i] ? <Col className={style.col} key={q} span={8}><Card
              style={{ width: '100%'}}
              title={value.Title}
              bodyStyle={{ padding:10}}

            >
              <div>
                {this.checkFlag(value.GroupState)}
                <img style={{width:100,height:100,float:'left',marginRight:10}} src={value.CoverPicture}/>
                <div style={{marginLeft:110}}>
                  <div>
                    市场价:
                    <b style={{color:'#FFC107'}}>{MarketPriceRange}</b>
                    <br/>
                    团购价:
                    <b style={{color:'#FFC107'}}>{GroupBuyingPriceRange}</b>
                  </div>
                  <div>
                    结算价:
                    <b style={{color:'#FFC107'}}>{SettlementPriceRange}</b>
                    <br/>
                    成本价:
                    <b style={{color:'#FFC107'}}>{CostPriceRange}</b>
                  </div>
                  <div>开团时间：{this.formatTime(value.StartTime,'YYYY.MM.DD HH:mm')}</div>
                  <div>截单时间：{this.formatTime(value.EndTime,'YYYY.MM.DD HH:mm')}</div>
                  {/*<div>备注：{value.Notes}</div>*/}
                  <div>销量: {value.Sales}</div>
                </div>
              </div>
            </Card></Col>:''
          })}
          </Row>
      </div>:''
      )
    })
  };

  render(){
    const {purchase:{defaultData:{List}}} = this.props
    return (
      <div>
        {this.getList(List)}
      </div>
    )
  }

}
