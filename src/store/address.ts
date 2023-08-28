import { create } from "zustand";
import { isObject } from "lodash-es";

export type UserState = {
  address: any;
};

export type UserActions = {
  setAddress(address: any): void;
  removeAddress(): void;
};

/**
 * 创建并暴露地址存储对象
 */
export const addressStore = create<UserState & UserActions>((set, get) => ({
  // 地址信息
  address: {},

  /**
   * 设置用户信息
   * @param {Object} address - 地址信息
   */
  setAddress: (address) => {
    if (address && isObject(address)) {
      set({ address });
    } else {
      console.warn("setAddress 需要一个对象参数。");
    }
  },
  removeAddress: () => {
    set({ address: {} });
  },
}));
