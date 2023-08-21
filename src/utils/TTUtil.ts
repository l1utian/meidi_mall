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
            .catch(() => {
              reject({
                errMsg: "",
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
