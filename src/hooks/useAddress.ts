import { useSetState } from "ahooks";
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
    if (key === "isDefault") {
      setFormState({ [key]: value ? 1 : 0 } as any);
    } else {
      setFormState({ [key]: value } as any);
    }
  };
  const handleAddressChange = (value) => {
    const [province, city, county] = value;
    setFormState({ province, city, county } as any);
  };

  const validate = () => {
    return new Promise<any>((resolve, reject) => {
      const { name, tel, province, city, county, addressDetail } = formState;
      if (!name) {
        reject({
          status: "error",
          message: "请填写姓名",
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
      if (!province || !city) {
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

  return {
    formState,
    setFormState,
    handleChange,
    handleAddressChange,
    validate,
  };
};
export default useAddress;
