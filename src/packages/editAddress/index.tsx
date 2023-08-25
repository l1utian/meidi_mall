import { useEffect, useMemo, useState } from "react";
import { View, Text } from "@tarojs/components";
import {
  Input,
  Checkbox,
  Address,
  TextArea,
  Button,
} from "@nutui/nutui-react-taro";
import Taro, { useRouter } from "@tarojs/taro";
import {
  getAddressInfo,
  getAvailableAddressList,
  postAddressEdit,
} from "@/api/address";
import { useRequest } from "ahooks";
import { formatLocation } from "@/utils/tool";
import useAddress from "@/hooks/useAddress";
import { ArrowRight } from "@nutui/icons-react-taro";
import "../addAddress/index.scss";
import useRequireLogin from "@/hooks/useRequireLogin";
import { optionsDemo1 } from "../addAddress/data";

function EditAddress() {
  // 判断是否是登录状态，如果未登录会跳转到登录页面
  useRequireLogin();
  const router = useRouter();
  const id = router?.params?.id;
  const {
    formState,
    handleChange,
    handleAddressChange,
    validate,
    setFormState,
  } = useAddress();

  useRequest(() => getAddressInfo(id), {
    refreshDeps: [id],
    onSuccess(res) {
      if (res?.code === 200 && res?.data) {
        setFormState({
          name: res?.data?.name,
          tel: res?.data?.tel,
          province: res?.data?.province,
          city: res?.data?.city,
          county: res?.data?.county,
          addressDetail: res?.data?.addressDetail,
          isDefault: res?.data?.isDefault,
        });
      }
    },
  });

  const { runAsync, loading } = useRequest(postAddressEdit, {
    manual: true,
  });

  const address = useMemo(() => {
    return formState?.province
      ? formatLocation(
          [formState.province, formState.city, formState.county],
          " "
        )
      : "请选择";
  }, [formState]);

  const handleSave = () => {
    validate()
      .then((res) => {
        if (res?.data) {
          runAsync({
            ...formState,
            id,
          }).then((res) => {
            console.log(res);
            if (res?.code === 200) {
              Taro.navigateBack();
            }
          });
        }
      })
      ?.catch((err) => {
        if (err?.message) {
          Taro.showToast({
            title: err.message,
            icon: "none",
          });
        }
      });
  };

  useEffect(() => {
    getAvailableAddressList().then((res) => {
      console.log(res);
    });
  }, []);

  const [visible, setVisible] = useState<boolean>(false);

  return (
    <View className="addAddress">
      <View className="addAddress-input">
        <Text className="addAddress-input-label">收货人</Text>
        <Input
          placeholder="请输入"
          align="right"
          maxLength={25}
          value={formState?.name}
          onChange={(value) => handleChange("name", value)}
        />
      </View>
      <View className="addAddress-input">
        <Text className="addAddress-input-label">联系电话</Text>
        <Input
          placeholder="请输入"
          align="right"
          type="digit"
          value={formState?.tel}
          onChange={(value) => handleChange("tel", value)}
        />
      </View>
      <View className="addAddress-input" onClick={() => setVisible(true)}>
        <Text className="addAddress-input-label">所在地区</Text>
        <View className="addAddress-input-value">
          <Text className="addAddress-input-label">{address}</Text>
          <ArrowRight size="small" />
        </View>
      </View>
      <TextArea
        onChange={(value) => handleChange("addressDetail", value)}
        value={formState?.addressDetail}
        maxLength={200}
      />
      <View
        className="addAddress-textarea"
        onClick={() => {
          handleChange("isDefault", formState.isDefault ? 0 : 1);
        }}
      >
        <View className="addAddress-textarea-top">
          <Text className="addAddress-textarea-label">设为默认地址</Text>
          <Checkbox checked={!!formState.isDefault} />
        </View>
        <Text className="addAddress-textarea-desc">
          提醒：每次下单时会使用该地址，实际下单地址会根据您的历史订单进行智能判断，请在下单时确认哦！
        </Text>
      </View>
      <Button block type="primary" onClick={handleSave} loading={loading}>
        保存
      </Button>
      <Address
        visible={visible}
        options={optionsDemo1}
        title="详细地址"
        onChange={handleAddressChange}
        onClose={() => setVisible(false)}
      />
    </View>
  );
}

export default EditAddress;
