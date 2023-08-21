import { get, post } from "@/utils/request";

/**
 *  地址管理
 */

//地址列表
export const getAddressList = (params) => {
  return get("/address/list", params);
};

//查看地址
export const getAddressInfo = (params) => {
  return get("/address/getInfo", params);
};

//新增地址
export const postAddressAdd = (params) => {
  return post("/address/add", params);
};

//编辑地址
export const postAddressEdit = (params) => {
  return post("/address/edit", params);
};

//删除地址
export const postAddressRemove = (params) => {
  return post("/address/remove", params);
};
