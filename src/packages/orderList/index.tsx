import { useState, useMemo } from "react";
import { View } from "@tarojs/components";
import Taro, { useRouter, useDidShow } from "@tarojs/taro";
import { Tabs } from "@nutui/nutui-react-taro";
import OrderItem from "@/components/OrderItem";
import { useRequest } from "ahooks";
import { getOrderList, postOrderConfirmOrder } from "@/api/order";
import ConfirmModal from "@/components/ConfirmModal";
import Empty from "./Empty";
import useRequireLogin from "@/hooks/useRequireLogin";
import { loginWithCheckSession } from "@/utils/TTUtil";
import { addressStore } from "@/store/address";
import "./index.scss";

const OrderList = () => {
  // 判断是否是登录状态，如果未登录会跳转到登录页面
  useRequireLogin();

  // 清空多余的地址信息
  const { removeAddress } = addressStore();
  useDidShow(() => {
    removeAddress();
  });
  // 101 待支付
  // 201 待预约
  // 202 待服务
  // 203 服务中
  // 204 已完成
  // 301 退款中
  // 302 退款完成
  // 303 退款失败
  // 401 已取消
  const { params } = useRouter();
  const { type } = params;

  const tabs = [
    { title: "全部订单", key: 0, orderStatus: "" },
    { title: "待支付", key: 1, orderStatus: "101" },
    { title: "服务中", key: 2, orderStatus: "203" },
    { title: "退款", key: 3 },
  ];
  const [currentOrder, setCurrentOrder] = useState<any>({});
  const [activeTab, setActiveTab] = useState<any>(type || 0);
  const [visible, setVisible] = useState<boolean>(false);
  const {
    data,
    loading,
    runAsync: getOrderListRun,
  }: any = useRequest((parmams) => getOrderList(parmams), { manual: true });

  useDidShow(() => {
    getOrderListRun({
      orderStatus:
        activeTab === 3
          ? ""
          : tabs.find((v) => v.key === activeTab)?.orderStatus,
      refund: activeTab === 3 ? 1 : "",
    });
  });

  // {
  //   orderStatus: tabs.find((v) => v.key === activeTab)?.orderStatus,
  // }
  const { runAsync: confirmRun } = useRequest(postOrderConfirmOrder, {
    manual: true,
  });
  const handleClick = (key, order) => {
    setCurrentOrder(order);
    switch (key) {
      // 继续支付
      case "continuePay":
        Taro.showLoading({
          title: "加载中",
          mask: true,
        });
        loginWithCheckSession()?.then(() => {
          tt?.continueToPay({
            outOrderNo: order.outOrderNo,
            success(res) {
              Taro.hideLoading();
              console.log(res);
              getOrderListRun({
                orderStatus:
                  activeTab === 3
                    ? ""
                    : tabs.find((v) => v.key === activeTab)?.orderStatus,
                refund: activeTab === 3 ? 1 : "",
              });
            },
            fail(err) {
              Taro.hideLoading();
              console.log(err);
            },
          });
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

  const handleConfirm = () => {
    confirmRun({
      outOrderNo: currentOrder?.outOrderNo,
    }).then((res) => {
      if (res?.code === 200) {
        getOrderListRun({
          orderStatus:
            activeTab === 3
              ? ""
              : tabs.find((v) => v.key === activeTab)?.orderStatus,
          refund: activeTab === 3 ? 1 : "",
        });
        setVisible(false);
      }
    });
  };

  const handleClickTab = (value) => {
    setActiveTab(value);
    getOrderListRun({
      orderStatus:
        value === 3 ? "" : tabs.find((v) => v.key === value)?.orderStatus,
      refund: value === 3 ? 1 : "",
    });
  };

  const dataSource = useMemo(() => {
    return Array?.isArray(data?.data)
      ? data?.data?.map((v) => ({
          ...v,
          orderStatus: v.refundResult === 2 ? 303 : v.orderStatus,
        }))
      : [];
  }, [data?.data]);

  return (
    <View className="orderList">
      <ConfirmModal
        visible={visible}
        content="确认服务已完成吗？"
        title="确认"
        onConfirm={handleConfirm}
        onCancel={() => setVisible(false)}
      />
      <Tabs value={activeTab} onChange={handleClickTab}>
        {tabs.map((v) => (
          <Tabs.TabPane title={v.title} key={v.key}>
            {dataSource?.length ? (
              dataSource.map((v, i) => (
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
