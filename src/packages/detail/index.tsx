import { useState } from "react";
import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { Swiper, SwiperItem, Divider, Button } from "@nutui/nutui-react-taro";
import { Button as TaroButton } from "@tarojs/components";
import { CUSTOMER_SERVICE_DY_ID } from "@/config/base";
import right from "@/assets/public/right.svg";
import message from "@/assets/public/message.svg";
import useRequireLogin from "@/hooks/useRequireLogin";
import GoodModal from "./GoodModal";
import "./index.scss";

function Detail() {
  // 判断是否是登录状态，如果未登录会跳转到登录页面
  useRequireLogin();

  const [visible, setVisible] = useState<boolean>(false);
  return (
    <View className="detail-container">
      <GoodModal
        visible={visible}
        onClose={() => setVisible(false)}
        onConfirm={() => {
          Taro.navigateTo({
            url: "/packages/settlement/index",
          });
        }}
      />
      <Swiper defaultValue={0} indicator height={224}>
        <SwiperItem>
          <Image
            mode="heightFix"
            src="https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg"
          />
        </SwiperItem>
        <SwiperItem>
          <Image
            mode="heightFix"
            src="https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg"
          />
        </SwiperItem>
      </Swiper>
      <View className="detail-intro">
        <View className="detail-intro-top">
          <Text className="detail-intro-price">￥1980</Text>
          <Text className="detail-intro-price-u">¥2080</Text>
        </View>
        <View className="detail-intro-bottom">
          【抖音专属】电热水器全拆洗 美的家电清洗上门服务 家政保洁
        </View>
      </View>
      <View className="detail-selected">
        <Text className="detail-selected-left">已选服务</Text>
        <View
          className="detail-selected-right"
          onClick={() => setVisible(true)}
        >
          <Text>【全拆洗】 1台电热水器清洗</Text>
          <Image
            src={right}
            className="detail-selected-right-img"
            mode="widthFix"
          />
        </View>
      </View>
      <View className="detail-service">
        <Divider className="detail-divider">
          <Text style={{ color: "#333" }}>服务详情</Text>
        </Divider>
        <img
          style={{ width: "100%" }}
          src="https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg"
          alt=""
        />
        <img
          style={{ width: "100%" }}
          src="https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg"
          alt=""
        />
        <img
          style={{ width: "100%" }}
          src="https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg"
          alt=""
        />
      </View>
      <View className="detail-bottom">
        <TaroButton
          className="detail-bottom-service"
          open-type="im"
          dataImId={CUSTOMER_SERVICE_DY_ID}
        >
          <Image
            src={message}
            mode="widthFix"
            className="detail-bottom-message"
          />
          <Text>联系客服</Text>
        </TaroButton>

        <Button
          className="detail-bottom-btn"
          type="primary"
          onClick={() => setVisible(true)}
        >
          立即购买
        </Button>
      </View>
    </View>
  );
}

export default Detail;
