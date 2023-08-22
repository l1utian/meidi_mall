import { get, post } from "@/utils/request";

/**
 *  地址管理
 */
// 可用地址列表
export const getAvailableAddressList = () => {
  return get("/address/areaList");
};

//地址列表
export const getAddressList = (): Promise<any> => {
  return get("/address/list");
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
export const postAddressRemove = (params): Promise<any> => {
  return get("/address/remove", params);
};
