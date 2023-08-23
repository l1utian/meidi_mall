import { get } from "@/utils/request";

// 获取相关展示信息
// get /getDoc
export const getDoc = (params): Promise<any> => {
  return get("/getDoc", params);
};
