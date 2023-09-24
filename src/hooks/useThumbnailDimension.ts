import { useEffect, useState } from "react";

const useThumbnailDimension = () => {
  const [size, setSize] = useState(0);
  useEffect(() => {
    tt.getSystemInfo({
      success(res) {
        const size = res.screenWidth - 18 * 2 - 8 * 2;
        setSize(size / 2);
      },
    });
  }, []);

  return size;
};

export default useThumbnailDimension;
