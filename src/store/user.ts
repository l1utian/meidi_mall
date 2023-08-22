import { create } from "zustand";
import { isObject } from "lodash-es";

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
  isLoggedIn: boolean;
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
  isLoggedIn: false,

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
