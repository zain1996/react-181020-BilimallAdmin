import {stringify} from 'qs';
import request from '../utils/request';


/**
 * 获取身份证token
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryIdCardPicToken(params) {
  return request(`/api/v1/user/admin/user/id_card_pic_token`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取组织图片token
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryPicToken(params) {
  return request(`/api/v1/agency/admin/organization/add/pic_token`, {
    method: 'POST',
    body: params,
  });
}
