import { useEffect, useState } from "react";

const useImageDimension = (width, height) => {
  const [dimension, setDimension] = useState({
    screenWidth: 0,
    calculatedHeight: 0,
  });

  useEffect(() => {
    tt.getSystemInfo({
      success(res) {
        const screenWidth = res.screenWidth;
        const calculatedHeight = (height / width) * screenWidth;
        setDimension({ screenWidth, calculatedHeight });
      },
    });
  }, [width, height]);

  return dimension;
};

export default useImageDimension;
