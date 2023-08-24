import { useMemo, useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import AddressItem from "@/components/AddressItem";
import { Button } from "@nutui/nutui-react-taro";
import { postAddressRemove, getAddressList } from "@/api/address";
import { useRequest } from "ahooks";
import { formatLocation } from "@/utils/tool";
import ConfirmModal from "@/components/ConfirmModal";
import Empty from "./Empty";
import "./index.scss";

function AddressList() {
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState(null);
  const { data, runAsync, loading } = useRequest(getAddressList);

  const { runAsync: removeRun, loading: removeLoading } = useRequest(
    postAddressRemove,
    {
      manual: true,
    }
  );

  const list = useMemo(() => {
    return (data?.data ?? [])?.map((v) => {
      return {
        ...v,
        location: formatLocation(
          [v?.province, v?.city, v?.county, v?.addressDetail],
          ""
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
        setVisible(true);
        setId(id);

        break;
      default:
        break;
    }
  };
  const handleCancel = () => {
    setVisible(false);
    setId(null);
  };
  const handleConfirm = () => {
    if (id) {
      removeRun({ id })?.then((res) => {
        if (res?.code === 200) {
          runAsync();
          setVisible(false);
        }
      });
    }
  };

  useEffect(() => {
    if (loading) {
      Taro.showLoading({
        title: "加载中",
      });
    } else {
      Taro.hideLoading();
    }
  }, [loading]);

  return (
    <View className="address-list-container">
      {list?.length ? (
        list?.map((v, i) => (
          <AddressItem info={v} key={i} onClick={handleClick} />
        ))
      ) : (
        <View className="address-list-empty">
          <Empty />
        </View>
      )}

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
      <ConfirmModal
        visible={visible}
        onCancel={handleCancel}
        confirmLoading={removeLoading}
        onConfirm={handleConfirm}
        title="删除确认"
        content="确定删除该地址吗？"
      />
    </View>
  );
}

export default AddressList;
