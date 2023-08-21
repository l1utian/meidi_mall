import { create } from "zustand";
import { isObject } from "lodash-es";

export type UserState = {
  userProfile: any | null;
};

export type UserActions = {
  setUserProfile(userProfile: any): void;
  removeUserProfile(): void;
};

/**
 * 创建并暴露用户状态存储对象
 */
export const userStore = create<UserState & UserActions>((set) => ({
  // 用户的信息
  userProfile: null,

  /**
   * 设置用户信息
   * @param {Object} userProfile - 用户信息对象
   */
  setUserProfile: (userProfile) => {
    if (userProfile && isObject(userProfile)) {
      set({ userProfile });
    } else {
      console.warn("setUserProfile 需要一个对象参数。");
    }
  },

  /**
   * 移除用户信息
   */
  removeUserProfile: () => {
    set({ userProfile: null });
  },
}));
