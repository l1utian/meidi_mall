import { View, Image, Text } from "@tarojs/components";
import address_empty from "@/assets/user/address_empty.svg";
import "./Empty.scss";

const Empty = () => {
  return (
    <View className="address-empty">
      <Image src={address_empty} className="address-empty-icon"></Image>
      <Text className="address-empty-text">您还没有添加地址</Text>
    </View>
  );
};
export default Empty;
