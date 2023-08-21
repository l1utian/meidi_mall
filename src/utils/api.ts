import { get, post } from "./request";
/**
 *  登录注册
 */

//登录
export const login = (params) => {
  return post("/login", params);
};

//保存用户信息
export const postUserInfo = (params) => {
  return post("/updateUserInfo", params);
};

//获取用户信息
export const getUserInfo = () => {
  return get("/getUserInfo");
};

/**
 *  商品管理
 */

//商品列表
export const getGoodsList = (params) => {
  return get("/goods/list", params);
};

//商品详情
export const getGoodsInfo = (params) => {
  return get("/goods/getInfo", params);
};

/**
 *  商品管理
 */

//创建订单
export const postOrderCreate = (params) => {
  return post("/order/create", params);
};

//继续支付
export const postOrderContinuePay = (params) => {
  return post("/order/continuePay", params);
};

//订单列表
export const getOrderList = (params) => {
  return get("/order/list", params);
};

//订单详情
export const getOrderInfo = (params) => {
  return get("/order/getInfo", params);
};

//预约服务
export const postOrderAppointment = (params) => {
  return post("/order/appointment", params);
};

//确认服务完成
export const postOrderConfirmOrder = (params) => {
  return post("/order/confirmOrder", params);
};

//申请退款
export const postOrderRefund = (params) => {
  return post("/order/refund", params);
};

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
