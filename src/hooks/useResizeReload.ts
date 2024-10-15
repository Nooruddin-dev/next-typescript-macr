"use client"

import { useState, useEffect } from "react";
import useIsMobile from "./useIsMobile";
import { isBrowserWindow } from "@/helpers/common/GlobalHelper";


// Custom hook to reload an embedded component on window resize for non-mobile devices
const useResizeReload = () => {
  const [embedKey, setEmbedKey] = useState(0);
  const isMobile = useIsMobile();



  const reloadEmbed = () => {
    setEmbedKey((prevKey) => prevKey + 1); // Increment the key by 1
  };

  useEffect(() => {
    //-- Only set up the resize event listener if the device is not mobile
    if (!isMobile) {
      const handleResize = () => {
        reloadEmbed(); //-- Reload the embedded component on window resize
      };


      if (isBrowserWindow()) {

        //-- Add the resize event listener to the window
        window.addEventListener("resize", handleResize);

        //-- Cleanup function to remove the event listener when the component unmounts or when dependencies change
        return () => {
          window.removeEventListener("resize", handleResize);
        };

      }



    }
  }, [isMobile]); //-- Dependency array to re-run the effect when 'isMobile' changes


  return embedKey;
};

export default useResizeReload; 
