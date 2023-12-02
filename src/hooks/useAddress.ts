import { getAvailableAddressList } from "@/api/address";
import { isValidChineseEnglishInput } from "@/utils/tool";
import { useSetState } from "ahooks";

interface FormState {
  name: string;
  tel: string;
  province: string;
  provinceCode: number;
  city: string;
  cityCode: number;
  county: string;
  countyCode: number;
  street: string;
  streetCode: number;
  addressDetail: string;
  isDefault: number;
}

const setAddressList = (data: any[], leaf = false) => {
  return data?.map((v) => {
    return {
      value: v?.regName,
      text: v?.regName,
      id: v?.regionId,
      leaf,
    };
  });
};

const useAddress = () => {
  const [formState, setFormState] = useSetState<FormState>({
    name: "",
    tel: "",
    province: "",
    provinceCode: 0,
    city: "",
    cityCode: 0,
    county: "",
    countyCode: 0,
    street: "",
    streetCode: 0,
    addressDetail: "",
    isDefault: 0,
  });

  const handleChange = (key, value) => {
    if (key === "isDefault") {
      setFormState({ [key]: value ? 1 : 0 } as any);
    } else {
      setFormState({ [key]: value } as any);
    }
  };

  const handleAddressChange = (selectValue, value) => {
    const [province, city, county, street] = value;
    setFormState({
      province: province?.text,
      provinceCode: province?.id,
      city: city?.text,
      cityCode: city?.id,
      county: county?.text,
      countyCode: county?.id,
      street: street?.text,
      streetCode: street?.id,
    } as any);
  };

  const validate = () => {
    return new Promise<any>((resolve, reject) => {
      const { name, tel, province, city, county, street, addressDetail } =
        formState;
      if (!name) {
        reject({
          status: "error",
          message: "请填写姓名",
        });
      }
      if (!isValidChineseEnglishInput(name)) {
        reject({
          status: "error",
          message: "姓名只能包含中文或英文字母",
        });
      }
      if (!tel) {
        reject({
          status: "error",
          message: "请填写手机号码",
        });
      }
      if (!/^1[3-9]\d{9}$/g.test(tel)) {
        reject({
          status: "error",
          message: "手机号码格式不正确",
        });
      }
      if (!province || !city || !county || !street) {
        reject({
          status: "error",
          message: "请选择所在地区",
        });
      }
      if (!addressDetail) {
        reject({
          status: "error",
          message: "请填写详细地址",
        });
      }
      resolve({
        status: "success",
        message: "校验通过",
        data: formState,
      });
    });
  };

  const handleLoad = (node: any, resolve: (children: any) => void) => {
    if (node.root) {
      getAvailableAddressList("")?.then((res) => {
        if (res?.code === 200) {
          resolve(setAddressList(res?.data));
        }
      });
    } else {
      const { id, level } = node;

      getAvailableAddressList(id)?.then((res) => {
        if (res?.code === 200) {
          resolve(setAddressList(res?.data, level >= 4));
        }
      });
    }
  };
  return {
    formState,
    setFormState,
    handleChange,
    handleAddressChange,
    validate,
    handleLoad,
  };
};
export default useAddress;
