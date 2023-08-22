import { useMemo } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import AddressItem from "@/components/AddressItem";
import { Button, Dialog } from "@nutui/nutui-react-taro";
import { postAddressRemove, getAddressList } from "@/api/address";
import { useRequest } from "ahooks";
import { formatLocation } from "@/utils/tool";
import "./index.scss";

function AddressList() {
  const { data, runAsync } = useRequest(getAddressList);

  const list = useMemo(() => {
    return (data?.data ?? [])?.map((v) => {
      return {
        ...v,
        location: formatLocation(
          [v?.province, v?.city, v?.county, v?.addressDetail],
          " "
        ),
      };
    });
  }, [data]);

  const handleClick = ({ key, id }) => {
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
                Dialog.close("delete");
                return runAsync();
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
      {list?.map((v, i) => (
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
