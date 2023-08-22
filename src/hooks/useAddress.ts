import { message } from "@/assets/public/message.svg";
import { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import {
  Input,
  Checkbox,
  Address,
  TextArea,
  Button,
} from "@nutui/nutui-react-taro";
import { getAvailableAddressList, postAddressAdd } from "@/api/address";
import { useSetState } from "ahooks";
import "./index.scss";
interface FormState {
  name: string;
  tel: string;
  province: string;
  city: string;
  county: string;
  addressDetail: string;
  isDefault: number;
}

const useAddress = () => {
  const [formState, setFormState] = useSetState<FormState>({
    name: "",
    tel: "",
    province: "",
    city: "",
    county: "",
    addressDetail: "",
    isDefault: 0,
  });

  const handleChange = (key, value) => {
    setFormState({ [key]: value } as any);
  };
  const handleAddressChange = (value) => {
    const [province, city, county] = value;
    setFormState({ province, city, county } as any);
  };

  const validate = () => {
    const { name, tel, province, city, county, addressDetail } = formState;
    if (!name) {
      return {
        status: "error",
        message: "请填写姓名",
      };
    }
    if (!tel) {
      return {
        status: "error",
        message: "请填写手机号码",
      };
    }
    if (!/^1[3-9]\d{9}$/g.test(tel)) {
      return {
        status: "error",
        message: "手机号码格式不正确",
      };
    }
    if (!province || !city || !county) {
      return {
        status: "error",
        message: "请选择省市区",
      };
    }
    if (!addressDetail) {
      return {
        status: "error",
        message: "请填写详细地址",
      };
    }
    return {
      status: "success",
      message: "校验通过",
      data: formState,
    };
  };

  return {
    formState,
    handleChange,
    handleAddressChange,
    validate,
  };
};
export default useAddress;
