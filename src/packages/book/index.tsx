import { useState, useMemo, useEffect } from "react";
import Taro, { useRouter, useDidShow, useDidHide } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { Button, Dialog } from "@nutui/nutui-react-taro";
import right from "@/assets/public/right.svg";
import { isEmpty } from "lodash-es";

import { useRequest } from "ahooks";
import { getAddressList } from "@/api/address";
import { postOrderAppointment } from "@/api/order";
import TimeSelectModal from "./TimeSelectModal";
import ConfirmModal from "@/components/ConfirmModal";
import location from "@/assets/user/location.svg";
import { Check } from "@nutui/icons-react-taro";
import { formatLocation } from "@/utils/tool";
import "./index.scss";
import useRequireLogin from "@/hooks/useRequireLogin";

const Book = () => {
  // 判断是否是登录状态，如果未登录会跳转到登录页面
  useRequireLogin();
  const { params } = useRouter();
  const { outOrderNo } = params;
  const { data } = useRequest(getAddressList);
  const { runAsync } = useRequest(postOrderAppointment, {
    manual: true,
  });

  const [address, setAddress] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);

  // 新增tip弹窗提示
  const [tipModalVisible, setTipModalVisible] = useState<boolean>(false);

  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const list = useMemo(() => {
    return (data?.data ?? [])?.map((v) => {
      return {
        ...v,
        location: formatLocation(
          [v?.province, v?.city, v?.county, v?.addressDetail],
          " "
        ),
      };
    });
  }, [data]);

  useEffect(() => {
    setAddress(list.find((v) => v.isDefault) ?? {});
  }, [list]);

  const handleSelect = (value) => {
    setAppointmentDate(value[0]?.value);
    setAppointmentTime(value[0]?.children[0].value);
  };

  const handleSubmit = () => {
    if (!appointmentDate && !appointmentTime) {
      Taro.showToast({
        title: "请选择上门时间",
        icon: "error",
        duration: 1000,
      });
      return;
    }
    if (!address && !address?.id) {
      Taro.showToast({
        title: "请选择地址",
        icon: "error",
        duration: 1000,
      });
      return;
    }
    setTipModalVisible(true);
  };
  const handleConfirm = () => {
    setTipModalVisible(false);
    runAsync({
      outOrderNo,
      appointmentDate,
      appointmentTime,
      addressId: address.id,
      message: "",
    }).then((res) => {
      if (res.code === 200) {
        Taro.showToast({
          title: "预约成功",
          icon: "success",
          duration: 2000,
        }).then(() => {
          Taro.redirectTo({
            url: `/packages/orderDetail/index?outOrderNo=${outOrderNo}`,
          });
        });
      }
    });
  };
  useDidShow(() => {
    if (Taro.getStorageSync("address")) {
      setAddress(Taro.getStorageSync("address"));
    }
  });

  useDidHide(() => {
    Taro.removeStorageSync("address");
  });
  return (
    <View className="book-container">
      <View className="book-address">
        <View
          className="book-address-top"
          onClick={() => {
            Taro.navigateTo({
              url: `/packages/addressList/index?fromPage=book`,
            });
          }}
        >
          <View className="book-address-info">
            <Image
              src={location}
              className="book-address-icon"
              mode="widthFix"
            />
            <Text className="book-address-detail">
              {address.location || "请填写上门地址"}
            </Text>
          </View>
          <Image
            src={right}
            mode="widthFix"
            className="book-selected-right-img"
          />
        </View>
        <View className="book-address-bottom">
          <View
            className={
              isEmpty(address)
                ? "book-address-noSelected"
                : "book-address-selected"
            }
          >
            <Text>上门服务</Text>
            <View className="book-address-selected-icon">
              <Check className="book-address-selected-check" />
            </View>
          </View>
        </View>
      </View>
      <View className="book-selected" onClick={() => setVisible(true)}>
        <Text className="book-selected-left">期望上门时间</Text>
        <View className="book-selected-right">
          <Text className="book-selected-right-text">
            {appointmentDate && appointmentTime
              ? `${appointmentDate} ${appointmentTime}`
              : "请选择"}
          </Text>
          <Image
            src={right}
            className="book-selected-right-img"
            mode="widthFix"
          />
        </View>
      </View>
      <View className="book-bottom">
        <Button block type="primary" onClick={handleSubmit}>
          提交
        </Button>
      </View>
      <TimeSelectModal
        visible={visible}
        onConfirm={handleSelect}
        onClose={() => setVisible(false)}
      />
      <Dialog id="tip" />
      <ConfirmModal
        visible={tipModalVisible}
        title="提示"
        content="具体上门服务时间以工程师电话预约为准"
        onConfirm={handleConfirm}
        onCancel={() => setTipModalVisible(false)}
      />
    </View>
  );
};
export default Book;
