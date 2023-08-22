import { create } from "zustand";
import { isObject } from "lodash-es";
import Taro from "@tarojs/taro";
export interface User {
  avatarUrl: string;
  nickName: string;
  gender: number;
  city: null;
  province: null;
  country: null;
  language: null;
  phone: string;
}

export type UserState = {
  userProfile: User | null;
};

export type UserActions = {
  setUserProfile(userProfile: any): void;
  removeUserProfile(): void;
  isLoggedIn: () => boolean;
};

/**
 * 创建并暴露用户状态存储对象
 */
export const userStore = create<UserState & UserActions>((set, get) => ({
  // 用户的信息
  userProfile: null,
  isLoggedIn: () => {
    return !!get()?.userProfile?.phone && !!Taro.getStorageSync("token");
  },

  /**
   * 设置用户信息
   * @param {Object} userProfile - 用户信息对象
   */
  setUserProfile: (userProfile: User) => {
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
