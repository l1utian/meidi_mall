import { post } from "@/utils/request";

/**
 *  地址管理
 */
// 可用地址列表
export const getAvailableAddressList = (regionId): Promise<any> => {
  return post("/address/areaList", { regionId });
};

//地址列表
export const getAddressList = (): Promise<any> => {
  return post("/address/list", {}, true);
};

//查看地址
export const getAddressInfo = (id): Promise<any> => {
  return post("/address/getInfo", { id });
};

//新增地址
export const postAddressAdd = (params): Promise<any> => {
  return post("/address/add", params);
};

//编辑地址
export const postAddressEdit = (params): Promise<any> => {
  return post("/address/edit", params);
};

//删除地址
export const postAddressRemove = (params): Promise<any> => {
  return post("/address/remove", params);
};
