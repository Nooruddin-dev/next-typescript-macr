
import { toast } from "react-toastify";
import { checkIfStringIsNotEmtpy } from "./GlobalHelper";
import { getLocaleFromURL } from "@/Routes/routeHelper";
import { validationMessages } from "@/constants/localizedValidationMessages";



export const getValidationMsgText = (key: any, lang: any) => {

    //   If lang is undefined then set 'en' as default
    if (checkIfStringIsNotEmtpy(lang) == false) {
        lang = "en";
    }

    try {
        const languageLabels = validationMessages[lang];

        if (languageLabels && languageLabels[key]) {
            return languageLabels[key];
        }

        //   Fallback to English if translation is not available for the selected language
        return validationMessages.en[key];
    } catch (error) {
        console.error(error);
        return "";
    }

};


export const showSuccessMessage = (msg: any, timer = 20000) => {
    const lang = getLocaleFromURL();
    toast.success(msg, {
      position: "top-center",
      autoClose: timer ,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: 0,
      theme: "light",
      rtl: lang !== "en",
      toastId: "success1",
      style: {
        fontWeight: "bold",
      },
    });
  };

  export const showErrorMessage = (msg: any, timer = 20000) => {
    const lang = getLocaleFromURL();
    toast.error(msg, {
      position: "top-center",
      autoClose: timer ,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: 0,
      theme: "light",
      rtl: lang !== "en",
      toastId: "success1",
      style: {
        fontWeight: "bold",
        width: "400px"  // Adjust the width as needed
      },
    });
  };
  