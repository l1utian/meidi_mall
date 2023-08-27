import { Divider, Button } from "@nutui/nutui-react-taro";
import { View, Image, Text } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { getOrderInfo, postOrderContinuePay } from "@/api/order";
import { useRequest } from "ahooks";
import OrderStatus from "@/components/OrderStatus";
import useLoading from "@/hooks/useLoading";
import location from "@/assets/user/location.svg";
import ButtonGroup from "@/components/ButtonGroup";
import "./index.scss";
import useRequireLogin from "@/hooks/useRequireLogin";
import { useMemo } from "react";
import { getRemainingMilliseconds } from "@/utils/tool";
import { loginWithCheckSession } from "@/utils/TTUtil";

const OrderList = () => {
  // 判断是否是登录状态，如果未登录会跳转到登录页面
  useRequireLogin();

  const { params } = useRouter();
  const { outOrderNo } = params;
  const { data, refresh } = useRequest(() => getOrderInfo({ outOrderNo }), {
    refreshDeps: [outOrderNo],
  });
  const { runAsync, loading } = useRequest(postOrderContinuePay, {
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
          if (res?.code === 200) {
            loginWithCheckSession()?.then(() => {
              tt?.continueToPay({
                outOrderNo: outOrderNo,
                success(res) {
                  console.log(res);
                },
                fail(err) {
                  console.log(err);
                },
              });
            });
          }
        });
        break;
      // 售后/退款
      case "refund":
        Taro.navigateTo({
          url: `/packages/refund/index?outOrderNo=${outOrderNo}`,
        });
        break;
      // 预约
      case "book":
        Taro.navigateTo({
          url: `/packages/book/index?outOrderNo=${outOrderNo}`,
        });
        break;
      // 确认完成
      case "confirm":
        break;
      default:
        break;
    }
  };
  return (
    <View className="orderDetail">
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
          <Image src={data?.data.picUrl} className="orderDetail-good-img" />
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
        data?.data.orderStatus === 203) && (
        <View className="orderDetail-bottom">
          <ButtonGroup
            onClick={handleClick}
            size="normal"
            status={data?.data?.orderStatus}
          />
        </View>
      )}
    </View>
  );
};
export default OrderList;
