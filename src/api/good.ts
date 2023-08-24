import { get } from "@/utils/request";

/**
 *  商品管理
 */

//商品列表
export const getGoodsList = (params) => {
  return get("/goods/list", params);
};

//商品详情
export const getGoodsInfo = (params): Promise<any> => {
  return get("/goods/getInfo", params);
};
