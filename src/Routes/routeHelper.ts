import { isBrowserWindow } from "@/helpers/common/GlobalHelper";




export function getLocaleFromURL() {
    if(isBrowserWindow()){
        const path = window?.location?.pathname;
        const segments = path.split("/");
      
        // Check if the second segment in the URL is a valid locale
        if (segments.length >= 2) {
          const locale = segments[1];
          if (locale === "en" || locale === "ar") {
            return locale;
          }
        }
      
        // Default to English if no valid locale found
        return "ar";
    }else{
        return "ar";
    }
   
  }
  