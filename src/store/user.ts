import { create } from "zustand";
import { isObject } from "lodash-es";
import { createJSONStorage, persist } from "zustand/middleware";
import Taro from "@tarojs/taro";
import type { StateStorage } from "zustand/middleware";

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

export const storage: StateStorage = {
  getItem: (name: string): any => {
    return Taro.getStorageSync(name) || null;
  },
  setItem: (name: string, value: string): void => {
    Taro.setStorageSync(name, value);
  },
  removeItem: (name: string): void => {
    Taro.removeStorageSync(name);
  },
};
/**
 * 创建并暴露用户状态存储对象
 */
export const userStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: "USER_INFO",
      partialize: (state) => ({ userProfile: state.userProfile }),
      storage: createJSONStorage(() => storage),
    }
  )
);
