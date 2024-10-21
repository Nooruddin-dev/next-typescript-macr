import { isBrowserWindow } from "@/helpers/common/GlobalHelper";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { storeSession } from "@/store/store";
import { strings } from "@/constants/localizedStrings";
import { setSelectedLanguage } from "@/store/settings/slice";
import { useRouter } from "next/navigation";




export function getLocaleFromURL() {
  if (isBrowserWindow()) {
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
  } else {
    return "ar";
  }

}



// UrlLanguageDetector.js


export const setApplicationLang = (lang: any) => {

  lang = lang ?? 'ar';

  strings.setLanguage(lang);
  storeSession.dispatch(setSelectedLanguage(lang));

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

};


const UrlLanguageDetector = () => {
  const dispatch = useDispatch();
  const router = useRouter(); // Next.js hook for routing

  const language = useSelector((state: any) => state.settings.selectedLanguage);

  // Function to detect language from URL and set it in Redux
  const detectLanguageFromURL = () => {
    if (isBrowserWindow()) {
      const urlParts = window.location.pathname.split('/');
      if ((urlParts?.length >= 2) && (urlParts[1] === 'en' || urlParts[1] === 'ar')) {
        const langInUrl = urlParts[1];
        if (langInUrl !== language) {
          setApplicationLang(langInUrl);
        }
      } else {
        // Redirect to default language version of the page
        const pathname = window.location.pathname;
        const fullPath = `/${language}${pathname}`;
        window.location.href = fullPath;
      }
    }

  };

  // Call detectLanguageFromURL on component mount
  useEffect(() => {
    detectLanguageFromURL();
  }, [language, router]); // Use router instead of navigate for Next.js

  return null; // UrlLanguageDetector is a utility component, it doesn't render anything
};

export default UrlLanguageDetector;
