
"use client"
import { useState, useEffect } from 'react';

const useBrowserInfo = () => {
  const [browserInfo, setBrowserInfo] = useState('');

  useEffect(() => {
    const userAgent = navigator.userAgent;

    if ((userAgent.indexOf("Opera") || userAgent.indexOf('OPR')) !== -1) {
      setBrowserInfo('Opera');
    } else if (userAgent.indexOf("Edg") !== -1) {
      setBrowserInfo('Edge');
    } else if (userAgent.indexOf("Chrome") !== -1) {
      setBrowserInfo('Chrome');
    } else if (userAgent.indexOf("Safari") !== -1) {
      setBrowserInfo('Safari');
    } else if (userAgent.indexOf("Firefox") !== -1) {
      setBrowserInfo('Firefox');
    } 
    else {
      setBrowserInfo('Unknown');
    }
  }, []);

  return browserInfo;
};

export default useBrowserInfo;
