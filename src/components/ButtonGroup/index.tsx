import { View } from "@tarojs/components";
import { Button } from "@nutui/nutui-react-taro";
import "./index.scss";

interface Props {
  onClick?: any;
  size?: any;
}
const ButtonGroup = ({ onClick, size = "small" }: Props) => {
  const handleClick = (key) => {
    onClick && onClick(key);
  };
  return (
    <View className="button-group">
      <Button size={size} onClick={() => handleClick("refund")}>
        退款/售后
      </Button>
      <Button size={size} type="primary" onClick={() => handleClick("book")}>
        立即预约
      </Button>
    </View>
  );
};
export default ButtonGroup;
