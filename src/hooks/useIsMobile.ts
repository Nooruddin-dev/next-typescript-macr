'use client'
import { useState, useEffect } from "react";
import { isBrowserWindow } from "@/helpers/common/GlobalHelper";




export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window?.innerWidth <= 500);

  const handleWindowSizeChange = () => {
    if (isBrowserWindow()) {
      setIsMobile(window?.innerWidth <= 500);
    }

  };

  useEffect(() => {
    if (isBrowserWindow()) {
      window?.addEventListener("resize", handleWindowSizeChange);
      return () => {
        window?.removeEventListener("resize", handleWindowSizeChange);
      };
    }

  }, []);

  return isMobile;
}
