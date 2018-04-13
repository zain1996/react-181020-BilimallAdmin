import request from '../utils/request';
import { stringify } from 'qs';

export async function query() {
  return request('/api/users');
}

export async function queryBasicInfo(params) {
  return request(`/api/v1/user/admin/wx_work/user/basic_info?${stringify(params)}`);
}
