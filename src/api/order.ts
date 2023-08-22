import { get, post } from "@/utils/request";

/**
 *  订单管理
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
export const getOrderList = (params?: any) => {
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
