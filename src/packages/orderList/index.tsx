import { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import { useRouter } from "@tarojs/taro";
import { Tabs } from "@nutui/nutui-react-taro";
import OrderItem from "@/components/OrderItem";
import { useRequest } from "ahooks";
import { getOrderList } from "@/api/order";
import Empty from "./Empty";
import "./index.scss";

const OrderList = () => {
  // 101 待支付
  // 201 待预约
  // 202 待服务
  // 203 已完成
  // 301 退款中
  // 302 退款完成
  // 303 退款失败
  // 401 已取消
  const { params } = useRouter();
  const { type } = params;

  const tabs = [
    { title: "全部订单", key: "0", orderStatus: "" },
    { title: "待支付", key: "1", orderStatus: "101" },
    { title: "服务中", key: "2", orderStatus: "201" },
    { title: "退款", key: "3", orderStatus: "301" },
  ];
  const [activeTab, setActiveTab] = useState<any>(type || "0");
  const { data }: any = useRequest(
    () =>
      getOrderList({
        orderStatus: tabs.find((v) => v.key === activeTab)?.orderStatus,
      }),
    {
      refreshDeps: [activeTab],
    }
  );
  const handleClick = (key, order) => {
    console.log(key, order);
  };
  console.log("data", data);
  return (
    <View className="orderList">
      <Tabs
        value={activeTab}
        onChange={(value) => {
          console.log(value);
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
                />
              ))
            ) : (
              //  缺少loading效果
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
