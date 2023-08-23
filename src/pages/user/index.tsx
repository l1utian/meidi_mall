import { View, Image, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import {
  CellGroup,
  Cell,
  Avatar,
  Grid,
  GridItem,
} from "@nutui/nutui-react-taro";
import { userStore } from "@/store/user";
import location from "@/assets/user/location.svg";
import kefu from "@/assets/user/kefu.svg";
import safe from "@/assets/user/safe.svg";
import about from "@/assets/user/about.svg";
import all from "@/assets/user/all.svg";
import pay from "@/assets/user/pay.svg";
import service from "@/assets/user/service.svg";
import back from "@/assets/user/back.svg";
import right from "@/assets/public/right.svg";
import "./index.scss";
import { maskPhoneNumber } from "@/utils/tool";

function User() {
  const { userProfile } = userStore();
  const handleClick = (key) => {
    switch (key) {
      case "address":
        Taro.navigateTo({
          url: `/packages/addressList/index`,
        });
        break;
      default:
        break;
    }
  };
  const handleClickGrid = (type) => {
    Taro.navigateTo({
      url: `/packages/orderList/index?type=${type}`,
    });
  };
  return (
    <View className="user-container">
      <View
        className="user-bg"
        style={{
          backgroundImage: `url(./assets/user/bg.png)`,
        }}
      >
        <View className="user-info">
          <Avatar
            size="large"
            icon="https://img12.360buyimg.com/imagetools/jfs/t1/143702/31/16654/116794/5fc6f541Edebf8a57/4138097748889987.png"
          />
          <Text className="user-info-name">
            {userProfile?.phone
              ? maskPhoneNumber(String(userProfile?.phone))
              : ""}
          </Text>
        </View>
      </View>
      <View className="user-grid">
        <View className="user-grid-title">商城订单</View>
        <Grid>
          <GridItem text="全部" onClick={() => handleClickGrid("0")}>
            <Image src={all} mode="widthFix" style={{ width: "32px" }} />
          </GridItem>
          <GridItem text="待支付" onClick={() => handleClickGrid("1")}>
            <Image src={pay} mode="widthFix" style={{ width: "32px" }} />
          </GridItem>
          <GridItem text="服务中" onClick={() => handleClickGrid("2")}>
            <Image src={service} mode="widthFix" style={{ width: "32px" }} />
          </GridItem>
          <GridItem text="退款" onClick={() => handleClickGrid("3")}>
            <Image src={back} mode="widthFix" style={{ width: "32px" }} />
          </GridItem>
        </Grid>
      </View>

      <CellGroup>
        <Cell
          title={
            <View className="user-group-title">
              <Image
                src={location}
                className="user-group-icon"
                mode="widthFix"
              />
              <Text className="user-group-text">服务地址</Text>
            </View>
          }
          extra={
            <Image src={right} className="user-right-icon" mode="widthFix" />
          }
          onClick={() => handleClick("address")}
        />
        <Cell
          title={
            <View className="user-group-title">
              <Image src={kefu} className="user-group-icon" mode="widthFix" />
              <Text className="user-group-text">联系客服</Text>
            </View>
          }
          extra={
            <Image src={right} className="user-right-icon" mode="widthFix" />
          }
        />
        <Cell
          onClick={() => {
            Taro.navigateTo({
              url: "/packages/aboutPage/index",
            });
          }}
          title={
            <View className="user-group-title">
              <Image src={about} className="user-group-icon" mode="widthFix" />
              <Text className="user-group-text">关于我们</Text>
            </View>
          }
          extra={
            <Image src={right} className="user-right-icon" mode="widthFix" />
          }
        />
        <Cell
          onClick={() => {
            Taro.navigateTo({
              url: "/packages/qualificationPage/index",
            });
          }}
          title={
            <View className="user-group-title">
              <Image src={safe} className="user-group-icon" mode="widthFix" />
              <Text className="user-group-text">资质展示</Text>
            </View>
          }
          extra={
            <Image src={right} className="user-right-icon" mode="widthFix" />
          }
        />
      </CellGroup>
      <Cell align="center" className="user-exit">
        退出登录
      </Cell>
    </View>
  );
}

export default User;
