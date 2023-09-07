import { useMemo, useState } from "react";
import { View, Text } from "@tarojs/components";
import {
  Input,
  Checkbox,
  TextArea,
  Button,
  Cascader,
} from "@nutui/nutui-react-taro";
import Taro, { useRouter } from "@tarojs/taro";
import { getAddressInfo, postAddressEdit } from "@/api/address";
import { useRequest } from "ahooks";
import { formatLocation } from "@/utils/tool";
import useAddress from "@/hooks/useAddress";
import { ArrowRight } from "@nutui/icons-react-taro";
import "../addAddress/index.scss";
import useRequireLogin from "@/hooks/useRequireLogin";

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
    handleLoad,
  } = useAddress();

  useRequest(() => getAddressInfo(id), {
    refreshDeps: [id],
    onSuccess(res) {
      if (res?.code === 200 && res?.data) {
        setFormState({
          name: res?.data?.name,
          tel: res?.data?.tel,
          province: res?.data?.province,
          provinceCode: res?.data?.provinceCode,
          city: res?.data?.city,
          cityCode: res?.data?.cityCode,
          county: res?.data?.county,
          countyCode: res?.data?.countyCode,
          street: res?.data?.street,
          streetCode: res?.data?.streetCode,
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
          [
            formState.province,
            formState.city,
            formState.county,
            formState.street,
          ],
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
          maxLength={11}
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
        maxLength={64}
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
      <Cascader
        visible={visible}
        title="详细地址"
        closeable
        onClose={() => setVisible(false)}
        onChange={handleAddressChange}
        lazy
        onLoad={handleLoad}
      />
    </View>
  );
}

export default EditAddress;
