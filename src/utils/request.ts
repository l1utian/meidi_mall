import Taro from "@tarojs/taro";

export const baseUrl = "http://nj.cirscn.com:15581/h5api";

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
      },
      success(res: any) {
        console.log(res);
        if (res.data.code === 200) {
          resolve(res.data);
          return;
        } else {
          // 其他各种各样的状态码统统返回
          if (res.data.msg) {
            Taro.showToast({
              title: res.data.msg,
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
