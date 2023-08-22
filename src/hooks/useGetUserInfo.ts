import { getUserInfo } from "@/api/login";
import { useRequest } from "ahooks";
import { userStore } from "@/store/user";

const useGetUserInfo = () => {
  const { setUserProfile, userProfile } = userStore.getState();

  const { loading, runAsync } = useRequest(getUserInfo, {
    manual: true,
    onSuccess: (res) => {
      if (res?.code === 200) {
        res?.data && setUserProfile(res?.data);
      }
    },
  });

  const fetchUserInfo = async () => {
    // 用户值存在，不需要重复请求
    if (!userProfile?.phone) {
      return runAsync();
    }
    return Promise.resolve();
  };

  return {
    loading,
    fetchUserInfo,
  };
};
export default useGetUserInfo;
