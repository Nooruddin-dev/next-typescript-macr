
'use client'
import { strings } from "@/constants/localizedStrings";
import { useDispatch, useSelector } from "react-redux";
import Footer from "./Footer";


import { PropsWithChildren, useEffect } from "react";

import { getLocaleFromURL } from "@/Routes/routeHelper";
import { setCategories } from "@/store/home/slice";



function LayoutMain({ children }: PropsWithChildren<{}>) {
  const dispatch: any = useDispatch();

  const selectedLanguage =  getLocaleFromURL();

  // Set the language for localized strings
  strings.setLanguage(selectedLanguage);


  useEffect(() => {
    
    dispatch(setCategories());
  }, []);


  return (
    <div
      className={`argaam-wrapper ${selectedLanguage === "ar" ? "dir_rtl" : "dir_ltr"}`}
    >
      {
         children
      }


      <Footer />
    </div>
  );
}

export default LayoutMain;
