const login = () => {
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

const getPhoneNumber = (e) => {
  return new Promise((resolve, reject) => {
    if (e.detail.errMsg.slice(-2) === "ok") {
      resolve(JSON.stringify(e.detail));
    } else {
      reject(e.detail.errMsg);
    }
  });
};

export const loginAndGetPhoneNumber = (e) => {
  return new Promise((resolve, reject) => {
    login()
      .then((res) => {
        const { hasLogin, code } = res;
        if (hasLogin) {
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
                  errMsg: "解析手机号失败",
                });
              }
            })
            .catch((err) => {
              // 用户未授权
              if (err === "getPhoneNumber:fail auth deny") {
                return;
              }
              reject({
                errMsg: "登录发生未知错误，请重试",
              });
            });
        }
      })
      .catch(() => {
        reject({
          errMsg: "登录失败",
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
        success: function (res) {
          console.log("打开文档成功");
        },
      });
    },
    fail(res) {
      console.log(`downloadFile 调用失败`, res);
    },
  });
};
