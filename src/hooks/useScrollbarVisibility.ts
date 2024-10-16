// useScrollbarVisibility.js
"use client"
import { useEffect } from 'react';

const useScrollbarVisibility = (isVisible: any) => {
  useEffect(() => {
    const handleScrollbar = () => {
      if (isVisible) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'visible';
      }
    };

    handleScrollbar();

    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isVisible]);
};

export default useScrollbarVisibility;
