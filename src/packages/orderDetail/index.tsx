import { Divider, Button } from "@nutui/nutui-react-taro";
import { useState } from "react";
import { View, Image, Text } from "@tarojs/components";
import Taro, { useDidShow, useRouter } from "@tarojs/taro";
import {
  getOrderInfo,
  postOrderContinuePay,
  postOrderConfirmOrder,
} from "@/api/order";
import { useRequest } from "ahooks";
import OrderStatus from "@/components/OrderStatus";
import useLoading from "@/hooks/useLoading";
import location from "@/assets/user/location.svg";
import ConfirmModal from "@/components/ConfirmModal";
import ButtonGroup from "@/components/ButtonGroup";
import "./index.scss";
import useRequireLogin from "@/hooks/useRequireLogin";
import { useMemo } from "react";
import { completeImageUrl, getRemainingMilliseconds } from "@/utils/tool";
import { loginWithCheckSession } from "@/utils/TTUtil";
import { BASE_API_URL } from "@/config/base";
import { addressStore } from "@/store/address";

const OrderList = () => {
  // 判断是否是登录状态，如果未登录会跳转到登录页面
  useRequireLogin();

  // 清空多余的地址信息
  const { removeAddress } = addressStore();
  useDidShow(() => {
    removeAddress();
  });

  const { params } = useRouter();
  const { outOrderNo } = params;
  const [visible, setVisible] = useState<boolean>(false);
  const { data, refresh } = useRequest(() => getOrderInfo({ outOrderNo }), {
    refreshDeps: [outOrderNo],
  });
  const { runAsync, loading } = useRequest(postOrderContinuePay, {
    manual: true,
  });
  const { runAsync: confirmRun } = useRequest(postOrderConfirmOrder, {
    manual: true,
  });
  // 页面加载时显示 loading
  useLoading(loading);

  // 剩余的支付有效期
  const validPayTime = useMemo(() => {
    if (
      data?.data.orderStatus === 101 &&
      data?.data.validTime &&
      data?.data?.orderTime
    ) {
      return getRemainingMilliseconds(
        data?.data?.orderTime,
        data?.data.validTime
      );
    }
    return 0;
  }, [data]);

  const handleClick = (key) => {
    switch (key) {
      // 继续支付
      case "continuePay":
        runAsync({ outOrderNo }).then((res) => {
          const orderId = res?.data?.options?.orderInfo?.order_id;
          if (res?.code === 200) {
            loginWithCheckSession()?.then(() => {
              tt?.continueToPay({
                // outOrderNo: outOrderNo,
                orderId,
                success(res) {
                  console.log(res);
                  refresh();
                },
                fail(err) {
                  refresh();
                  console.log(err);
                },
              });
            });
          }
        });
        break;
      // 售后/退款
      case "refund":
        Taro.redirectTo({
          url: `/packages/refund/index?outOrderNo=${outOrderNo}`,
        });
        break;
      // 预约
      case "book":
        Taro.redirectTo({
          url: `/packages/book/index?outOrderNo=${outOrderNo}`,
        });
        break;
      // 确认完成
      case "confirm":
        setVisible(true);
        break;
      default:
        break;
    }
  };
  const handleConfirm = () => {
    confirmRun({
      outOrderNo: outOrderNo,
    }).then((res) => {
      if (res.code === 200) {
        setVisible(false);
        refresh();
      }
    });
  };
  return (
    <View className="orderDetail">
      <ConfirmModal
        visible={visible}
        content="确认服务已完成吗？"
        title="确认"
        onConfirm={handleConfirm}
        onCancel={() => setVisible(false)}
      />
      <OrderStatus
        status={data?.data?.orderStatus}
        validPayTime={validPayTime}
        onRefresh={refresh}
      />
      <View className="orderDetail-content">
        {data?.data.orderStatus !== 101 &&
          data?.data.orderStatus !== 201 &&
          data?.data.consignee &&
          data?.data.mobile &&
          data?.data.address && (
            <View className="orderDetail-address">
              <Image
                src={location}
                mode="widthFix"
                className="orderDetail-address-img"
              />
              <View className="orderDetail-address-info">
                <View className="orderDetail-address-top">
                  <Text className="orderDetail-address-name">
                    {data?.data.consignee}
                  </Text>
                  <Text>{data?.data.mobile}</Text>
                </View>
                <Text>{data?.data.address}</Text>
              </View>
            </View>
          )}
        {data?.data.orderStatus !== 101 &&
          data?.data.orderStatus !== 201 &&
          data?.data.appointmentDate &&
          data?.data.appointmentTime && (
            <View className="orderDetail-time">
              <Text>预约服务时间</Text>
              <Text>{`${data?.data.appointmentDate} ${data?.data.appointmentTime}`}</Text>
            </View>
          )}
        <View className="orderDetail-good">
          <Image
            src={completeImageUrl(data?.data.picUrl, BASE_API_URL)}
            className="orderDetail-good-img"
          />
          <View className="orderDetail-good-detail">
            <Text className="orderDetail-good-name">
              {data?.data.productName}
            </Text>
            <View className="orderDetail-good-info">
              <View>
                <Text className="orderDetail-good-symbol">￥</Text>
                <Text className="orderDetail-good-price">
                  {data?.data.price}
                </Text>
              </View>
              <View>
                <Text className="orderDetail-good-num">
                  ×{data?.data.number}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="orderDetail-info">
          <View className="orderDetail-info-item">
            <View className="orderDetail-info-label">订单编号</View>
            <View className="orderDetail-info-content">
              <Text>{data?.data.outOrderNo}</Text>
              <Button
                size="small"
                className="orderDetail-info-content-copy"
                onClick={() => {
                  Taro.setClipboardData({
                    data: data?.data.outOrderNo,
                    success() {
                      Taro?.showToast({
                        title: "订单编号已复制",
                        icon: "success",
                        duration: 1000,
                      });
                    },
                  });
                }}
              >
                复制
              </Button>
            </View>
          </View>
          <View className="orderDetail-info-item">
            <View className="orderDetail-info-label">下单时间</View>
            <View className="orderDetail-info-content">
              {data?.data?.orderTime}
            </View>
          </View>
          <View className="orderDetail-info-item">
            <View className="orderDetail-info-label">支付方式</View>
            <View className="orderDetail-info-content">在线支付</View>
          </View>
          <View className="orderDetail-info-item">
            <View className="orderDetail-info-label">备注留言</View>
            <View className="orderDetail-info-content">
              {data?.data?.message}
            </View>
          </View>
        </View>
        <View className="orderDetail-price">
          <View className="orderDetail-price-top">
            <Text>商品总额</Text>
            <Text className="orderDetail-price-top-num">
              ¥{data?.data?.orderPrice || 0}
            </Text>
          </View>
          <Divider className="orderDetail-price-middle" />
          <View className="orderDetail-price-bottom">
            <Text className="orderDetail-price-bottom-total">总计：</Text>
            <Text className="orderDetail-price-bottom-num">
              ¥{data?.data?.orderPrice || 0}
            </Text>
          </View>
        </View>
      </View>
      {(data?.data.orderStatus === 101 ||
        data?.data.orderStatus === 201 ||
        data?.data.orderStatus === 202 ||
        data?.data.orderStatus === 203 ||
        data?.data.orderStatus === 204) && (
        <View className="orderDetail-bottom">
          <ButtonGroup
            size="normal"
            onClick={handleClick}
            isDetail={true}
            status={data?.data?.orderStatus}
          />
        </View>
      )}
    </View>
  );
};
export default OrderList;
