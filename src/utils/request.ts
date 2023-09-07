import Taro from "@tarojs/taro";
import { apiAppId, apiAppKey } from "@/config/base";
import CryptoJS from "crypto-js";
import { BASE_API_URL } from "@/config/base";

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
    return BASE_API_URL + url;
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
      url: BASE_API_URL + url,
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
          // 如果code存在，则是正常返回
          if (res?.data?.code) {
            Taro.showToast({
              title: res.data.msg || "服务器错误，请稍后再试",
              icon: "none",
              duration: 2000,
            });
            resolve(null);
            return;
          }

          switch (res?.statusCode) {
            case 400:
              Taro.showToast({
                title: "操作失败，请稍后重试",
                icon: "none",
                duration: 2000,
              });
              break;

            case 401:
              Taro.showToast({
                title: "您尚未登录或登录已过期",
                icon: "none",
                duration: 2000,
              });
              break;

            case 403:
              Taro.showToast({
                title: "抱歉，您没有权限进行此操作",
                icon: "none",
                duration: 2000,
              });
              break;

            case 404:
              Taro.showToast({
                title: "抱歉，我们找不到您请求的内容",
                icon: "none",
                duration: 2000,
              });
              break;

            case 500:
              Taro.showToast({
                title: "服务器出了点小差，请稍后再试",
                icon: "none",
                duration: 2000,
              });
              break;

            case 502:
            case 503:
            case 504:
              Taro.showToast({
                title: "服务器繁忙，请稍后重试",
                icon: "none",
                duration: 2000,
              });
              break;

            default:
              Taro.showToast({
                title: "出现未知错误，请稍后再试",
                icon: "none",
                duration: 2000,
              });
              break;
          }
          resolve(null);
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
const post = <T extends {}>(
  url: string,
  options?: T,
  isFormData: boolean = false
) => {
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
