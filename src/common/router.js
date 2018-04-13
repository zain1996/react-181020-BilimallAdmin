import React from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  // eslint-disable-next-line no-underscore-dangle
  models: () => models.filter(m => !app._models.some(({ namespace }) => namespace === m)).map(m => import(`../models/${m}.js`)),
  // add routerData prop
  component: () => {
    const p = component();
    return new Promise((resolve, reject) => {
      p.then((Comp) => {
        resolve(props => <Comp {...props} routerData={getRouterData(app)} />);
      }).catch(err => reject(err));
    });
  },
});

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = item.name;
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = item.name;
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerData = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/account/accountList': {
      component: dynamicWrapper(app, ['account'], () => import('../pages/account/list/Account')),
    },
    '/group/groupList': {
      component: dynamicWrapper(app, ['group','rule'], () => import('../pages/group/list/Group')),
    },
    '/group/groupList&/groupAdd': {
      component: dynamicWrapper(app, ['group','getToken'], () => import('../pages/group/add/GroupAdd')),
    },
    '/group/groupList&/groupAdd/confirm': {
      component: dynamicWrapper(app, ['group'], () => import('../pages/group/add/Step2')),
    },
    '/group/groupList&/groupAdd/result': {
      component: dynamicWrapper(app, ['group'], () => import('../pages/group/add/Step3'))
    },
    '/group/groupList&/groupEdit/:OrganizationId': {
      component: dynamicWrapper(app, ['group/editGroup','getToken'], () => import('../pages/group/edit/GroupEdit')),
    },
    '/group/groupList&/groupInfo/:OrganizationId': {
      component: dynamicWrapper(app, ['group'], () => import('../pages/group/info/GroupInfo'))
    },
    '/group/groupList&/groupCommunity/:OrganizationId/:title': {
      component: dynamicWrapper(app, ['group'], () => import('../pages/group/community/GroupCommunity'))
    },
    '/group/groupList&/groupPurchase/:OrganizationId/:title': {
      component: dynamicWrapper(app, ['group/purchase'], () => import('../pages/group/groupPurchase/GroupPurchase'))
    },
    '/group/groupList&/groupUser/:OrganizationId/:title': {
      component: dynamicWrapper(app, ['group/user'], () => import('../pages/group/user/User'))
    },
    '/group/groupList&/orderForm/:OrganizationId/:title': {
      component: dynamicWrapper(app, ['group/orderForm'], () => import('../pages/group/orderForm/orderForm'))
    },
    '/group/groupList&/orderFormInfo/:OrganizationId/:title/:IndentID': {
      component: dynamicWrapper(app, ['group/orderForm'], () => import('../pages/group/orderForm/orderFormInfo'))
    },
    '/group/groupList&/distributionList/:OrganizationId/:title': {
      component: dynamicWrapper(app, ['group/distribution'], () => import('../pages/group/distribution/distributionList'))
    },
    '/group/groupList&/distributionRoute/:OrganizationId/:title': {
      component: dynamicWrapper(app, ['group/distribution'], () => import('../pages/group/distribution/route'))
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../pages/login/Login')),
    }
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  const routerDataWithName = {};
  Object.keys(routerData).forEach((item) => {
    routerDataWithName[item] = {
      ...routerData[item],
      name: routerData[item].name || menuData[item.replace(/^\//, '')],
    };
  });
  return routerDataWithName;
};
