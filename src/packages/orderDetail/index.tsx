import { Divider, Button } from "@nutui/nutui-react-taro";
import { useState } from "react";
import { View, Image, Text } from "@tarojs/components";
import Taro, { useDidShow, useRouter } from "@tarojs/taro";
import { getOrderInfo, postOrderConfirmOrder } from "@/api/order";
import { useRequest } from "ahooks";
import OrderStatus from "@/components/OrderStatus";
import location from "@/assets/user/location.svg";
import ConfirmModal from "@/components/ConfirmModal";
import ButtonGroup from "@/components/ButtonGroup";
import useRequireLogin from "@/hooks/useRequireLogin";
import { useMemo } from "react";
import {
  completeImageUrl,
  getRemainingMilliseconds,
  onContinueToPayCallback,
} from "@/utils/tool";
import { loginWithCheckSession } from "@/utils/TTUtil";
import { BASE_API_URL } from "@/config/base";
import { addressStore } from "@/store/address";
import "./index.scss";

const OrderDetail = () => {
  // 判断是否是登录状态，如果未登录会跳转到登录页面
  useRequireLogin();

  // 清空多余的地址信息
  const { removeAddress } = addressStore();
  useDidShow(() => {
    removeAddress();
  });

  const { params } = useRouter();
  const route = useRouter();
  console.log(route);

  const { outOrderNo } = params;
  const [visible, setVisible] = useState<boolean>(false);
  const { data, refresh } = useRequest(() => getOrderInfo({ outOrderNo }), {
    refreshDeps: [outOrderNo],
  });

  const info = useMemo(() => {
    if (data?.data) {
      return {
        ...data?.data,
      };
    }

    return {};
  }, [data]);

  const { runAsync: confirmRun, loading: confirmResLoading } = useRequest(
    postOrderConfirmOrder,
    {
      manual: true,
    }
  );

  // 剩余的支付有效期
  const validPayTime = useMemo(() => {
    if (info.orderStatus === 101 && info.validTime && info?.orderTime) {
      return getRemainingMilliseconds(info?.orderTime, info.validTime);
    }
    return 0;
  }, [info]);

  const handleClick = (key) => {
    switch (key) {
      // 继续支付
      case "continuePay":
        Taro.showLoading({
          title: "加载中",
          mask: true,
        });

        loginWithCheckSession()?.then(() => {
          tt?.continueToPay({
            outOrderNo,
            success(res) {
              const { outOrderNo } = res;
              if (outOrderNo) {
                Taro.showToast({
                  title: "支付成功",
                  icon: "success",
                  duration: 1000,
                });
                setTimeout(() => {
                  Taro.hideLoading();
                  refresh();
                }, 1300);
              }
            },
            fail() {
              Taro.hideLoading();
            },
          });
          // tt.pay({
          //   orderInfo: {
          //     order_id: info?.payId,
          //     order_token: info?.payToken,
          //   },
          //   service: 5,
          //   success: function (res: any) {
          //     onContinueToPayCallback({
          //       code: res.code,
          //       success() {
          //         Taro.hideLoading();
          //         refresh();
          //       },
          //       fail() {
          //         Taro.hideLoading();
          //       },
          //     });
          //   },
          //   fail: function (err) {
          //     console.log("支付失败", err);
          //     Taro.hideLoading();
          //   },
          // });
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
      if (res?.code === 200) {
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
        confirmLoading={confirmResLoading}
        onConfirm={handleConfirm}
        onCancel={() => setVisible(false)}
      />
      <OrderStatus
        status={info?.orderStatus}
        validPayTime={validPayTime}
        onRefresh={refresh}
      />
      <View className="orderDetail-content">
        {info?.orderStatus !== 101 &&
          info?.orderStatus !== 201 &&
          info?.consignee &&
          info?.mobile &&
          info?.address && (
            <View className="orderDetail-address">
              <Image
                src={location}
                mode="widthFix"
                className="orderDetail-address-img"
              />
              <View className="orderDetail-address-info">
                <View className="orderDetail-address-top">
                  <Text className="orderDetail-address-name">
                    {info?.consignee}
                  </Text>
                  <Text>{info?.mobile}</Text>
                </View>
                <Text>{info?.address}</Text>
              </View>
            </View>
          )}
        {info?.orderStatus !== 101 &&
          info?.orderStatus !== 201 &&
          info?.appointmentDate &&
          info?.appointmentTime && (
            <View className="orderDetail-time">
              <Text>预约服务时间</Text>
              <Text>{`${info?.appointmentDate} ${info?.appointmentTime}`}</Text>
            </View>
          )}
        <View className="orderDetail-good">
          <Image
            src={completeImageUrl(info?.picUrl, BASE_API_URL)}
            className="orderDetail-good-img"
          />
          <View className="orderDetail-good-detail">
            <Text className="orderDetail-good-name">{info?.productName}</Text>
            <View className="orderDetail-good-info">
              <View>
                <Text className="orderDetail-good-symbol">￥</Text>
                <Text className="orderDetail-good-price">{info?.price}</Text>
              </View>
              <View>
                <Text className="orderDetail-good-num">×{info?.number}</Text>
              </View>
            </View>
          </View>
        </View>
        <View className="orderDetail-info">
          <View className="orderDetail-info-item">
            <View className="orderDetail-info-label">订单编号</View>
            <View className="orderDetail-info-content">
              <Text>{info?.outOrderNo}</Text>
              <Button
                size="small"
                className="orderDetail-info-content-copy"
                onClick={() => {
                  Taro.setClipboardData({
                    data: info?.outOrderNo,
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
            <View className="orderDetail-info-content">{info?.orderTime}</View>
          </View>
          <View className="orderDetail-info-item">
            <View className="orderDetail-info-label">支付方式</View>
            <View className="orderDetail-info-content">在线支付</View>
          </View>
          <View className="orderDetail-info-item">
            <View className="orderDetail-info-label">备注留言</View>
            <View className="orderDetail-info-content">{info?.message}</View>
          </View>
        </View>
        <View className="orderDetail-price">
          <View className="orderDetail-price-top">
            <Text>商品总额</Text>
            <Text className="orderDetail-price-top-num">
              ¥{info?.orderPrice || 0}
            </Text>
          </View>
          <Divider className="orderDetail-price-middle" />
          <View className="orderDetail-price-bottom">
            <Text className="orderDetail-price-bottom-total">总计：</Text>
            <Text className="orderDetail-price-bottom-num">
              ¥{info?.orderPrice || 0}
            </Text>
          </View>
        </View>
      </View>
      {(info?.orderStatus === 101 ||
        info?.orderStatus === 201 ||
        info?.orderStatus === 202 ||
        info?.orderStatus === 203 ||
        info?.orderStatus === 204) && (
        <View className="orderDetail-bottom">
          <ButtonGroup
            size="normal"
            onClick={handleClick}
            isDetail={true}
            status={info?.orderStatus}
          />
        </View>
      )}
    </View>
  );
};
export default OrderDetail;
