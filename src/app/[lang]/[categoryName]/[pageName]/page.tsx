import MainSectorPage from '@/components/Views/MainSectorPage';
import { getSectorPageSeoInfo } from '@/helpers/apiService';
import { Metadata } from 'next';
import React from 'react';


// Dynamic metadata function
export async function generateMetadata({ params }: { params: { lang: string; pageId: string } }): Promise<Metadata> {
  const pageIdApi = params.pageId;
  const lang = params.lang;
  let titleLocal = 'Argaam Macro'; // Default title
  let description = 'Argaam Macro'; // Default description
  let seoImage = 'https://ichef.bbci.co.uk/images/ic/1200xn/p0jv314s.jpg'; // Default image

  try {
    const res = await getSectorPageSeoInfo(26);
    console.log(res);
    if (res?.data !== undefined) {
      const isArabic = lang == 'ar' ? true : false; // Set your logic for detecting language
      titleLocal = isArabic ? res?.data?.seoTitleAr : res?.data?.seoTitleEn;
      description = isArabic ? res?.data?.seoDscAr : res?.data?.seoDscEn;
      seoImage = isArabic ? res?.data?.seo_icon_ar : res?.data?.seo_icon_en || seoImage; // Fallback to default image
    }
  } catch (err) {
    console.log(err, "Error fetching SEO data");
  }

  return {
    title: titleLocal,
    description: description,
    openGraph: {
      type: 'website',
      url: 'https://yourwebsite.com/contact', // Replace with your site's URL
      title: titleLocal,
      description: description,
      images: [
        {
          url: seoImage,
          width: 800,
          height: 600,
          alt: 'Contact Us Image',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titleLocal,
      description: description,
      images: [seoImage],
    },
  };
}




export default function page({ params }: { params: { lang: string; pageId: string } }) {
  const { lang } = params; // Access the lang parameter
    

  return (
    <MainSectorPage />
  )
}
