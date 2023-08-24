import { useState } from "react";
import { View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { Tabs } from "@nutui/nutui-react-taro";
import OrderItem from "@/components/OrderItem";
import { useRequest } from "ahooks";
import {
  getOrderList,
  postOrderContinuePay,
  postOrderConfirmOrder,
} from "@/api/order";
import useLoading from "@/hooks/useLoading";
import ConfirmModal from "@/components/ConfirmModal";
import Empty from "./Empty";
import "./index.scss";

const OrderList = () => {
  // 101 待支付
  // 201 待预约
  // 202 待服务
  // 203 已完成
  // 204 服务中
  // 301 退款中
  // 302 退款完成
  // 303 退款失败
  // 401 已取消
  const { params } = useRouter();
  const { type } = params;

  const tabs = [
    { title: "全部订单", key: "0", orderStatus: "" },
    { title: "待支付", key: "1", orderStatus: "101" },
    { title: "服务中", key: "2", orderStatus: "203" },
    { title: "退款", key: "3" },
  ];
  const [currentOrder, setCurrentOrder] = useState<any>({});
  const [activeTab, setActiveTab] = useState<any>(type || "0");
  const [visible, setVisible] = useState<boolean>(false);
  const {
    data,
    loading,
    runAsync: getOrderListRun,
  }: any = useRequest(
    () =>
      getOrderList({
        orderStatus:
          activeTab === "3"
            ? ""
            : tabs.find((v) => v.key === activeTab)?.orderStatus,
        refund: activeTab === "3" ? 1 : "",
      }),
    {
      refreshDeps: [activeTab],
    }
  );

  const { runAsync } = useRequest(postOrderContinuePay, {
    manual: true,
  });
  const { runAsync: confirmRun } = useRequest(postOrderConfirmOrder, {
    manual: true,
  });
  const handleClick = (key, order) => {
    setCurrentOrder(order);
    switch (key) {
      // 继续支付
      case "continuePay":
        runAsync({ outOrderNo: order.outOrderNo }).then((res) => {
          if (res?.code === 200) {
            // tt.pay({
            //   orderInfo: res.data.options.orderInfo,
            //   service: 5,
            //   success(res) {
            //     console.log(res);
            //   },
            //   fail(res) {
            //     console.log(res);
            //   },
            // });
            tt.continueToPay({
              outOrderNo: order.outOrderNo,
              success(res) {
                console.log(res);
                getOrderListRun({
                  orderStatus: tabs.find((v) => v.key === activeTab)
                    ?.orderStatus,
                });
              },
              fail(err) {
                console.log(err);
              },
            });
          }
        });
        break;
      // 售后/退款
      case "refund":
        Taro.navigateTo({
          url: `/packages/refund/index?outOrderNo=${order.outOrderNo}`,
        });
        break;
      // 预约
      case "book":
        Taro.navigateTo({
          url: `/packages/book/index?outOrderNo=${order.outOrderNo}`,
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
  const handleDetail = (v) => {
    Taro.navigateTo({
      url: `/packages/orderDetail/index?outOrderNo=${v.outOrderNo}`,
    });
  };

  // 页面加载时显示 loading
  useLoading(loading);

  const handleConfirm = () => {
    confirmRun({
      outOrderNo: currentOrder?.outOrderNo,
    }).then((res) => {
      if (res.code === 200) {
        getOrderListRun();
        setVisible(false);
      }
    });
  };
  return (
    <View className="orderList">
      <ConfirmModal
        visible={visible}
        content="确认服务已完成吗？"
        title="确认"
        onConfirm={handleConfirm}
        onCancel={() => setVisible(false)}
      />
      <Tabs
        value={activeTab}
        onChange={(value) => {
          setActiveTab(String(value));
        }}
      >
        {tabs.map((v) => (
          <Tabs.TabPane title={v.title} key={v.key}>
            {data?.data && data?.data.length ? (
              data.data.map((v, i) => (
                <OrderItem
                  info={v}
                  key={i}
                  onAction={(key) => handleClick(key, v)}
                  onClick={() => handleDetail(v)}
                />
              ))
            ) : loading ? null : (
              <View className="orderListEmpty">
                <Empty />
              </View>
            )}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </View>
  );
};
export default OrderList;
