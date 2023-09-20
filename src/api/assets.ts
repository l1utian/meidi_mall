import { get, post } from "@/utils/request";

// 获取相关展示信息
// get /getDoc
export const getDoc = (params): Promise<any> => {
  return get("/getDoc", params);
};

// 获取客服的抖音号
// post /getIm
export const getIm = (): Promise<any> => {
  return post("/getIm", {});
};
