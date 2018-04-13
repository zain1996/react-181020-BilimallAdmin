import accountIcon from '../assets/account.png'
import groupIcon from '../assets/group.png'

const menuData = [
  {
    name: '用户管理',
    icon: accountIcon,
    path:'account/accountList'
  },
  {
    name: '团购组织管理',
    icon: groupIcon,
    path:'group/groupList',
  },
];

function formatter(data, parentPath = '') {
  const list = [];
  data.forEach((item) => {
    if (item.children) {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
        children: formatter(item.children, `${parentPath}${item.path}/`),
      });
    } else {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
      });
    }
  });
  return list;
}

export const getMenuData = () => formatter(menuData);
