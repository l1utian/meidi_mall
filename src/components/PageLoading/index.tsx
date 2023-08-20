import { View, Image, Text } from "@tarojs/components";
import logo from "@/assets/public/logo.png";
import "./index.scss";

const PageLoading = () => {
  return (
    <View className="container">
      <View className="logo-wrapper">
        <View className="logo-box">
          <Image src={logo} className="logo"></Image>
        </View>
      </View>
      <Text className="text">美的洗悦家</Text>
    </View>
  );
};

export default PageLoading;
