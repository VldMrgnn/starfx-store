import { useState, useEffect } from "react";
import * as appConst from "@app/state/constants";

export function useWindowDimensions() {
  const hasWindow = typeof window !== "undefined";
  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    const drawerHeight = height
      ? height - (appConst.SIZES.headerHeight + appConst.SIZES.footerHeight)
      : null;
    return {
      width,
      height,
      drawerHeight: drawerHeight || 0,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );
  function handleResize() {
    setWindowDimensions(getWindowDimensions());
  }
  useEffect(() => {
    if (hasWindow) {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
}
