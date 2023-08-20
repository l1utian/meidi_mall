import { useState } from "react";
import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import bg from "@/assets/user/bg.png";
import OrderStatus from "@/components/OrderStatus";
import "./index.scss";

const OrderList = () => {
  return (
    <View className="orderDetail">
      <OrderStatus status={1} />
      <View className="orderDetail-content">
        <View></View>
        <View></View>
        <View
          className="orderDetail-good"
          onClick={() => {
            Taro.navigateTo({
              url: "/packages/orderDetail/index",
            });
          }}
        >
          <Image src={bg} className="orderDetail-good-img" />
          <View className="orderDetail-good-detail">
            <Text className="orderDetail-good-name">【全拆洗】波轮洗衣机</Text>
            <View className="orderDetail-good-info">
              <Text className="orderDetail-good-price">￥39.00</Text>
              <Text className="orderDetail-good-num">×1</Text>
            </View>
          </View>
        </View>
        <View></View>
        <View></View>
      </View>
    </View>
  );
};
export default OrderList;
