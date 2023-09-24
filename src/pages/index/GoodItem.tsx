import { View, Text } from "@tarojs/components";
import { Image } from "@nutui/nutui-react-taro";
import "./index.scss";
import useThumbnailDimension from "@/hooks/useThumbnailDimension";

const GoodItem = ({ src, name, retailPrice, counterPrice }) => {
  const size = useThumbnailDimension();

  return (
    <View className="goodItem">
      <Image
        className="goodItem-img"
        src={src}
        mode="widthFix"
        radius={4}
        fadeIn
        lazyLoad
        height={size}
      />
      <Text className="goodItem-name">{name}</Text>
      <View className="goodItem-price">
        <View>
          <Text className="goodItem-price-symbol">￥</Text>
          <Text className="goodItem-price-origin">{retailPrice}</Text>
        </View>
        <Text className="goodItem-price-count">￥{counterPrice}</Text>
      </View>
    </View>
  );
};
export default GoodItem;
