import { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import { Tabs } from "@nutui/nutui-react-taro";
import OrderItem from "@/components/OrderItem";
import { getOrderList } from "@/api/order";
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
  const [list, setList] = useState<any>([]);
  const tabs = [
    { title: "全部订单", key: "1", orderStatus: "" },
    { title: "待支付", key: "2", orderStatus: "101" },
    { title: "服务中", key: "3", orderStatus: "201,202" },
    { title: "已完成", key: "4", orderStatus: "203,301,302" },
  ];
  const [activeTab, setActiveTab] = useState<any>("0");
  useEffect(() => {
    getOrderList().then((res: any) => {
      if (res.code === 200) {
        setList(res.data);
      }
    });
  }, []);
  const handleClick = (key, order) => {
    console.log(key, order);
  };
  return (
    <View className="orderList">
      <Tabs
        value={activeTab}
        onChange={(value) => {
          setActiveTab(value);
        }}
      >
        {tabs.map((v) => (
          <Tabs.TabPane title={v.title}>
            {[...list, ...list].map((v, i) => (
              <OrderItem
                info={v}
                key={i}
                onClick={(key) => handleClick(key, v)}
              />
            ))}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </View>
  );
};
export default OrderList;
