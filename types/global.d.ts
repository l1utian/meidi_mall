/// <reference types="@tarojs/taro" />

declare module "*.png";
declare module "*.gif";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.css";
declare module "*.less";
declare module "*.scss";
declare module "*.sass";
declare module "*.styl";

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV:
      | "weapp"
      | "swan"
      | "alipay"
      | "h5"
      | "rn"
      | "tt"
      | "quickapp"
      | "qq"
      | "jd";
  }
}

declare namespace tt {
  export function login(obj: {
    force?: boolean;
    success: (res: { code: string }) => void;
    fail: (err: any) => void;
  }): void;
  export function getPhoneNumber(obj: {
    success: (res: { encryptedData: string; iv: string }) => void;
    fail: (err: any) => void;
  }): void;
  export function pay(obj: {
    orderInfo?: any;
    service: number;
    success: (res: { code: string }) => void;
    fail: (err: any) => void;
  }): void;
  export function getSystemInfo(p: any): void;
  export function downloadFile(obj: {
    url: string;
    success: (res: any) => void;
    fail?: (err: any) => void;
  }): void;
  export function continueToPay(obj: {
    orderId?: any;
    outOrderNo?: any;
    success: (res: any) => void;
    fail: (err: any) => void;
  }): void;
  export function openDocument(obj: {
    filePath: string;
    fileType: string;
    fileName: string;
    success: (res: { code: string }) => void;
    fail?: (err: any) => void;
  }): void;
  export function checkSession(obj: {
    success: (res: { code: string }) => void;
    fail?: (err: any) => void;
  }): void;
  export function createOrder(obj: {
    success: (res: any) => void;
    fail?: (err: any) => void;
    [key: string]: any;
  }): void;

  export function applyRefund(obj: {
    success: (res: any) => void;
    fail?: (err: any) => void;
    [key: string]: any;
  }): void;
}
