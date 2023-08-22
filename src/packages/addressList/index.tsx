import { useMemo } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import AddressItem from "@/components/AddressItem";
import { Button, Dialog } from "@nutui/nutui-react-taro";
import { postAddressRemove, getAddressList } from "@/api/address";
import { useRequest } from "ahooks";
import "./index.scss";

const fakerData = [
  {
    id: 3,
    name: "张静",
    phone: "123****4567",
    isDefault: true,
    location: "北京亦庄经济技术开发区科创十一街18号院",
  },
  {
    id: 4,
    name: "张静",
    phone: "123****4567",
    isDefault: false,
    location: "北京亦庄经济技术开发区科创十一街18号院",
  },
  {
    id: 5,
    name: "张静",
    phone: "123****4567",
    isDefault: false,
    location: "北京亦庄经济技术开发区科创十一街18号院",
  },
  {
    id: 6,
    name: "张静",
    phone: "123****4567",
    isDefault: false,
    location: "北京亦庄经济技术开发区科创十一街18号院",
  },
];
function AddressList() {
  const { data, loading, runAsync } = useRequest(getAddressList);

  const list = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  const handleClick = ({ key, id }) => {
    console.log(key, id);

    switch (key) {
      case "edit":
        Taro.navigateTo({
          url: `/packages/editAddress/index?id=${id}`,
        });
        break;
      case "delete":
        Dialog.open("delete", {
          title: "确定删除该地址吗？",
          onConfirm: () => {
            return postAddressRemove({ id })?.then((res) => {
              if (res?.code === 200) {
                runAsync();
                Dialog.close("delete");
              }
              return res;
            });
          },
          onCancel: () => {
            Dialog.close("delete");
          },
        });
        break;
      default:
        break;
    }
  };
  return (
    <View className="address-list-container">
      {fakerData?.map((v, i) => (
        <AddressItem info={v} key={i} onClick={handleClick} />
      ))}
      <View className="address-list-bottom">
        <Button
          block
          type="primary"
          onClick={() => {
            Taro.navigateTo({
              url: "/packages/addAddress/index",
            });
          }}
        >
          新增地址
        </Button>
      </View>
      <Dialog id="delete" />
    </View>
  );
}

export default AddressList;
