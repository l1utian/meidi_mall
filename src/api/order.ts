import { post } from "@/utils/request";

/**
 *  订单管理
 */

//创建订单
export const postOrderCreate = (params): Promise<any> => {
  return post("/order/create", params);
};

//继续支付
export const postOrderContinuePay = (params): Promise<any> => {
  return post("/order/continuePay", params);
};

//订单列表
export const getOrderList = (params): Promise<any> => {
  return post("/order/list", params, true);
};

//订单详情
export const getOrderInfo = (params): Promise<any> => {
  return post("/order/getInfo", params, true);
};

//预约服务
export const postOrderAppointment = (params): Promise<any> => {
  return post("/order/appointment", params, true);
};

//确认服务完成
export const postOrderConfirmOrder = (params): Promise<any> => {
  return post("/order/confirmOrder", params, true);
};

//申请退款
export const postOrderRefund = (params): Promise<any> => {
  return post("/order/refund", params, true);
};

// 可预约时间
// /order/appointmentTimeList POST
export const postOrderAppointmentTimeList = (): Promise<any> => {
  return post("/order/appointmentTimeList", {});
};

// 退款失败提示
// Post /order/refundFailCount
export const postOrderRefundFailCount = (): Promise<any> => {
  return post("/order/refundFailCount", {});
};

// 退款失败已读
// POST /order/refundFailRead
export const postOrderRefundFailRead = (): Promise<any> => {
  return post("/order/refundFailRead", {});
};
