import Taro from "@tarojs/taro";
import { apiAppId, apiAppKey } from "@/config/base";
import CryptoJS from "crypto-js";

export const baseUrl = "http://nj.cirscn.com:15581/h5api";

// 计算get请求的加密数据
export const getGetSign = () => {
  const timestamp = new Date().getTime();
  const siginOrigin = `appid=${apiAppId}&appkey=${apiAppKey}&timestamp=${timestamp}&req=`;
  return {
    timestamp,
    sign: CryptoJS.MD5(siginOrigin).toString()?.toUpperCase(),
  };
};
// 计算post请求的加密数据
export const getPostSign = (data: any) => {
  const timestamp = new Date().getTime();
  const siginOrigin = `appid=${apiAppId}&appkey=${apiAppKey}&timestamp=${timestamp}&req=${JSON.stringify(
    data
  )}`;
  return {
    timestamp,
    sign: CryptoJS.MD5(siginOrigin).toString()?.toUpperCase(),
  };
};

export const REG_CDN_FILE_ORIGIN = (url: string) => {
  const reg = /^http.*/;
  if (reg.test(url)) {
    return url;
  } else {
    return baseUrl + url;
  }
};
const request = (
  url: string,
  options: {
    method: Taro.request.Option["method"];
    data: Taro.request.Option["data"];
  },
  isFormData?: boolean
) => {
  let sign;
  if (options.method === "GET") {
    sign = getGetSign();
  } else if (options.method === "POST") {
    sign = getPostSign(options.data);
  }

  return new Promise((resolve, reject) => {
    const token = Taro.getStorageSync("token");
    Taro.request({
      url: baseUrl + url,
      method: options.method,
      data: options.data,
      timeout: 180000,
      header: {
        "content-type": isFormData
          ? "application/x-www-form-urlencoded"
          : "application/json;charset=UTF-8",
        Authorization: token,
        token: token,
        appid: apiAppId,
        timestamp: sign.timestamp,
        sign: sign.sign,
      },
      success(res: any) {
        if (res.data.code === 200) {
          resolve(res.data);
          return;
        } else if (res?.data?.code === 401) {
          Taro.removeStorageSync("token");
          resolve(null);
        } else {
          // 其他各种各样的状态码统统返回
          if (res?.data?.msg) {
            Taro.showToast({
              title: res.data.msg || "请求失败",
              icon: "none",
              duration: 2000,
            });
            resolve(null);
          }
        }
      },
      fail(error) {
        reject(error.errMsg);
        console.log(error);
      },
    });
  });
};

const get = <T extends {}>(url: string, options?: T) => {
  return request(url, { method: "GET", data: options });
};
const post = <T extends {}>(url: string, options: T, isFormData = false) => {
  return request(url, { method: "POST", data: options }, isFormData);
};

const formDataPost = <T extends {}>(url: string, options: T) => {
  return request(url, { method: "POST", data: options }, true);
};

const put = (url: string, options = {}) => {
  return request(url, { method: "PUT", data: options });
};
// 不能声明DELETE（关键字）
const remove = (url: string, options = {}) => {
  return request(url, { method: "DELETE", data: options });
};

export { request, get, post, formDataPost, put, remove };
