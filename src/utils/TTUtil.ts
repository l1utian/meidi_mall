// 判断是否登录
export const checkLogin = () => {
  return new Promise<{
    hasLogin: true;
    code?: string;
    message?: string;
  }>((resolve, reject) => {
    tt.login({
      force: true,
      success: function (res) {
        console.log("登录接口成功", res);
        if (res.code) {
          resolve({
            hasLogin: true,
            code: res.code,
            message: "登录成功",
          });
        } else {
          reject({
            hasLogin: false,
            code: undefined,
            message: "登录失败",
          });
        }
      },
      fail: function (err) {
        console.log("登录接口失败", err);
        reject({
          hasLogin: false,
          code: undefined,
          message: "登录失败",
        });
      },
    });
  });
};

// 不分接口内容需要判断是否有section，如果没有,section则需要登录，才能调用对应的方法
const checkSession = () => {
  return new Promise<boolean>((resolve, reject) => {
    tt?.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject();
      },
    });
  });
};

export const loginWithCheckSession = () => {
  return new Promise<{
    hasLogin: true;
    code?: string;
    message?: string;
  }>((resolve, reject) => {
    checkSession()
      ?.then(() => {
        resolve({
          hasLogin: true,
          code: undefined,
          message: "已登录",
        });
      })
      ?.catch(() => {
        checkLogin()
          ?.then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
  });
};

const getPhoneNumber = (e) => {
  return new Promise((resolve, reject) => {
    if (e.detail.errMsg.slice(-2) === "ok") {
      resolve(JSON.stringify(e.detail));
    } else if (e.detail.errMsg === "bad parameter") {
      reject({ errMsg: "页面发生错误，请刷新后重试" });
    } else {
      reject({ errMsg: "服务器开小差啦，请重试" });
    }
  });
};

export const loginAndGetPhoneNumber = (e, code) => {
  return new Promise((resolve, reject) => {
    getPhoneNumber(e)
      ?.then((res: string) => {
        try {
          const phoneInfo = JSON.parse(res);
          resolve({
            code,
            encryptedData: phoneInfo.encryptedData,
            iv: phoneInfo.iv,
          });
        } catch (error) {
          reject({
            errMsg: "手机号解析失败",
          });
        }
      })
      .catch((err) => {
        reject({
          errMsg: err?.errMsg || "登录发生未知错误，请重试",
        });
      });
  });
};

// 预览文件
export const previewFile = ({
  url,
  fileName,
  fileType,
}: {
  url: string;
  fileName: string;
  fileType: string;
}): void => {
  tt.downloadFile({
    // 仅为示例 url，并非真实地址
    url,
    success: function (res) {
      console.log(res);
      const filePath = res.tempFilePath;
      tt.openDocument({
        filePath: filePath,
        fileType,
        fileName,
        success: function () {
          console.log("打开文档成功");
        },
      });
    },
    fail(res) {
      console.log(`downloadFile 调用失败`, res);
    },
  });
};
