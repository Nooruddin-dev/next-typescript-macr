"use client"
import { getLocaleFromURL } from '@/Routes/routeHelper';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { isBrowserWindow } from '@/helpers/common/GlobalHelper';
import Header from '../Home/Header';
import useIsMobile from '@/hooks/useIsMobile';

function HeaderSectorPage({
  propsQueryParam

}: any) {

  

  const dispatch = useDispatch();
  const selectedLanguage = getLocaleFromURL()

  const isMobile = useIsMobile();



  const handleLanguageChange = (language: string) => {
    //setApplicationLang(language);

    
    if(isBrowserWindow()){
      window.location.reload(); 
    }


  };


  useEffect(() => {

    document.documentElement.lang = selectedLanguage;

    document.documentElement.dir = selectedLanguage === "ar" ? "rtl" : "ltr";

    // Perform any code that should run when 'count' changes
  }, [selectedLanguage]);

  return (
    < >
      {/* <TopNavigation
        onSelectLanguage={handleLanguageChange}
        selectedLanguage={selectedLanguage}
      /> */}


      <Header hideCategoryNav={isMobile == true ? true : false}/>


      {/* <NavigationMenu props={propsQueryParam} /> */}
    </>
  );
}

export default HeaderSectorPage;