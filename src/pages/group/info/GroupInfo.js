import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List ,Avatar ,Row,Col} from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Ellipsis from '../../../components/Ellipsis';
import userIcon from '../../../assets/user.png';
import communityIcon from '../../../assets/community.png';
import purchaseIcon from '../../../assets/purchase.png';
import routeIcon from '../../../assets/route.png';
import orderFormIcon from '../../../assets/orderForm.png';
import distributionIcon from '../../../assets/distribution.png';
import {getLocalStorage} from "../../../utils/utils"
import styles from './GroupInfo.less';
const { Meta } = Card;

@connect(state => ({
  group: state.group,
}))

export default class CardList extends PureComponent {



  componentDidMount(){
    const {dispatch , match:{params}} = this.props;
    const OrganizationId = params.OrganizationId || 2;


    dispatch({
      type:'group/queryGroupInfo',
      payload:OrganizationId
    })

  }

  authorization(e){
    const userData = getLocalStorage('userData');
    return `/api/v1/user/admin/user/access_id_card_pic?_token=${userData.token}&_uid=${userData.uid}&uri=${encodeURI(e)}`
  }
  render() {
    const {group:{groupInfoData}} = this.props;

    const title = groupInfoData.Name || '团购组织详情';
    const titleUrlEncode = encodeURI(title);
    const listDate =
      [
        {
          id:'1',
          title:'成员管理',
          description:'可浏览成员列表、添加成员、角色管理、添加角色',
          avatar:userIcon,
          href:`/group/groupList&/groupUser/${groupInfoData.OrganizationId}/${titleUrlEncode}`
        },
        {
          id:'2',
          title:'社团管理',
          description:'可浏览“社团列表”',
          avatar:communityIcon,
          href:`/group/groupList&/groupCommunity/${groupInfoData.OrganizationId}/${titleUrlEncode}`
        },
        {
          id:'3',
          title:'团购任务管理',
          description:'可浏览“团购任务”',
          avatar:purchaseIcon,
          href:`/group/groupList&/groupPurchase/${groupInfoData.OrganizationId}/${titleUrlEncode}`

        },
        {
          id:'4',
          title:'销售概况单',
          description:'可浏览“销售概况单””',
          avatar:orderFormIcon,
          href:`/group/groupList&/orderForm/${groupInfoData.OrganizationId}/${titleUrlEncode}`

        },
        {
          id:'5',
          title:'送货单',
          description:'可浏览“送货单”',
          avatar:distributionIcon,
          href:`/group/groupList&/distributionList/${groupInfoData.OrganizationId}/${titleUrlEncode}`

        },
        {
          id:'6',
          title:'送货路线规划',
          // description:'团购任务',
          avatar:routeIcon,
          href:`/group/groupList&/distributionRoute/${groupInfoData.OrganizationId}/${titleUrlEncode}`

        }
      ]

    const content = (

        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Card bordered={false}>
                <Meta
                  avatar={<img style={{width:120}} src={groupInfoData.Logo} />}
                  title={title+'详情'}
                  description={
                    (
                      <div>
                        <div>
                          <span>企业开户名称：</span>
                          <span>{groupInfoData.BankAccountName}</span>
                        </div>
                        <div>
                          <span>企业开户银行：</span>
                          <span>{groupInfoData.BankName}</span>
                        </div>
                        <div>
                          <span>企业银行账号：</span>
                          <span>{groupInfoData.BankAccount}</span>
                        </div>
                        <div>
                          <span>所在省市：</span>
                          <span>{groupInfoData.City}</span>
                        </div>
                        <div>
                          <span>企业名称：</span>
                          <span>{groupInfoData.CompanyName}</span>
                        </div>
                        <div>
                          <span>营业执照注册号：</span>
                          <span>{groupInfoData.LicenseNumber}</span>
                        </div>
                        <div>
                          <span>营业执照照片：</span>
                          <span><a target="_bank" href={groupInfoData.LicensePicture}>查看</a></span>
                        </div>
                      </div>
                    )
                  }
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Meta
                  title="管理员信息"
                  description={
                    (
                      <div>
                        <div>
                          <span>管理员姓名：</span>
                          <span>{groupInfoData.ManagerName}</span>
                        </div>
                        <div>
                          <span>管理员手机：</span>
                          <span>{groupInfoData.ManagerMobile}</span>
                        </div>
                        <div>
                          <span>身份证号码：</span>
                          <span>{groupInfoData.ManagerIdCardNumber}</span>
                        </div>
                        <div>
                          <span>身份证正面照片：</span>
                          <span><a target="_bank" href={this.authorization(groupInfoData.ManagerIdCardFront)}>查看</a></span>
                        </div>
                        <div>
                          <span>身份证反面照片：</span>
                          <span><a target="_bank" href={this.authorization(groupInfoData.ManagerIdCardBack)}>查看</a></span>
                        </div>
                        <div>
                          <span>联系地址：</span>
                          <span>{groupInfoData.Address}</span>
                        </div>
                      </div>
                    )
                  }
                />
              </Card>
            </Col>
          </Row>
          {/*<div className={styles.contentLink}>*/}
          {/*<a>*/}
          {/*<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" /> 快速开始*/}
          {/*</a>*/}
          {/*<a>*/}
          {/*<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" /> 产品简介*/}
          {/*</a>*/}
          {/*<a>*/}
          {/*<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" /> 产品文档*/}
          {/*</a>*/}
          {/*</div>*/}
        </div>
    );

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
        title:title+'详情',
      }
    ]
    return (
      <PageHeaderLayout
        content={content}
        breadcrumbList={breadcrumbList}
      >
        <div className={styles.cardList}>
          <List
            rowKey="id"
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={[...listDate]}
            renderItem={item => ((

                <List.Item key={item.id}>
                  <Link to={item.href}>
                    <Card hoverable className={styles.card}>


                      <Card.Meta
                        avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                        title={item.title}
                        description={(
                          <Ellipsis className={styles.item} lines={3}>{item.description}</Ellipsis>
                        )}
                      />

                    </Card>
                  </Link>
                </List.Item>

              )
            )}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
