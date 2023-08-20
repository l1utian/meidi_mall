import { View, Text, Image } from "@tarojs/components";
import { Checkbox, Button } from "@nutui/nutui-react-taro";
import logo from "@/assets/public/logo.png";
import "./index.scss";

const Login = () => {
  return (
    <View className="login">
      <View className="login-content">
        <Image src={logo} mode="widthFix" className="login-content-logo" />
        <Text className="login-content-title">美的洗悦家</Text>
        <Text className="login-content-slogen">深度精洗，惊喜你家</Text>
      </View>
      <Button block type="primary">
        抖音手机号授权快捷登录
      </Button>
      <Checkbox
        className="test"
        label="已阅读并同意《洗悦家用户注册协议》、《洗悦家隐私政策》，若您的手机号未注册，将为您直接注册苏宁账号"
        defaultChecked={false}
      />
    </View>
  );
};
export default Login;
