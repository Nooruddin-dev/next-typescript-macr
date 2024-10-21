
'use client'
import { strings } from "@/constants/localizedStrings";
import { useDispatch, useSelector } from "react-redux";
import Footer from "./Footer";


import { PropsWithChildren, useEffect, useState } from "react";

import UrlLanguageDetector, { getLocaleFromURL } from "@/Routes/routeHelper";
import { setCategories } from "@/store/home/slice";



function LayoutMain({ children }: PropsWithChildren<{}>) {
  const dispatch: any = useDispatch();
  const [apploader, setapploader] = useState(true);

  // const selectedLanguage =  getLocaleFromURL();
  const selectedLanguage = useSelector(
    (state: any) => state.settings.selectedLanguage
  );

  // Set the language for localized strings
  strings.setLanguage(selectedLanguage);


  useEffect(() => {
    dispatch(setCategories());

    setapploader(false);
  }, []);




  return (
    <>

      {apploader ? null : (
        <div
          className={`argaam-wrapper ${selectedLanguage === "ar" ? "dir_rtl" : "dir_ltr"}`}
        >

          <UrlLanguageDetector />


          {
            children
          }


          <Footer />
        </div>
      )}
    </>

  );
}

export default LayoutMain;
