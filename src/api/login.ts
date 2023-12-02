import { get, post } from "@/utils/request";

//登录
export const login = (params): Promise<any> => {
  return post("/login", params, true);
};

//保存用户信息
export const postUserInfo = (params) => {
  return post("/updateUserInfo", params, true);
};

//获取用户信息
export const getUserInfo = (): Promise<any> => {
  return get("/getUserInfo");
};
