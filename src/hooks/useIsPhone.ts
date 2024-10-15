
"use client"
import { useState, useEffect } from 'react';

//-- Custom hook to check if the user is accessing from a mobile phone (iPhone or Android)
const useIsPhone = () => {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    //-- Get the user agent string from the browser's navigator object
    const userAgent = navigator.userAgent;


    if (userAgent.match(/iPhone|Android/i)) {
      setIsMobile(true); 
    }
  }, []); //-- The empty dependency array means this effect only runs once, when the component is first rendered


  return isMobile;
}

export default useIsPhone; 
