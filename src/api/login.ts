import { get, post } from "@/utils/request";

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
