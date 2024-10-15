"use client"
import { getPageSeoNameFromUrl, isValidSectorPageId } from "@/helpers/chart/ChartCommonHelpers";
import { checkIfStringIsNotEmtpy, getCurrentFormattedDate, removeStartEndSpacesFromString } from "@/helpers/common/GlobalHelper";
import { getPageIdByPageName } from "@/helpers/common/SeoCommonHelper";
import { getLocaleFromURL } from "@/Routes/routeHelper";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LayoutMain from "../Layouts/LayoutMain";
import HeaderSectorPage from "../Layouts/Header/HeaderSectorPage";
import SectorMacroArea from "./SectorMacroArea";



function SectorPageSub() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname(); 
  const [pageName, setPagename] = useState(params.title ?? 0);


  const pageSeoName = getPageSeoNameFromUrl(pathname);
  const pageId = getPageIdByPageName(pageSeoName);

  //const lang = strings.getLanguage();
  const lang = getLocaleFromURL();
  const categories = useSelector((state: any) => state.home.categories);

  const filteredPagesBase = categories?.flatMap((itm: any) =>
    itm.macrocategoryPages.filter((page: any) => page.pageId == (pageId ?? 0))
  );
  const pageInfoBasic = filteredPagesBase?.length > 0 ? filteredPagesBase[0] : null;
  const categoryBasicInfo = categories?.find((x: { categoryId: any; }) => x.categoryId == pageInfoBasic?.categoryId);


  const currentEnglishDate = getCurrentFormattedDate("en-US");
  const currentArabicDate = getCurrentFormattedDate("ar-EG");



  const sectorBasicParams = {
    categoryID: categoryBasicInfo?.categoryId,
    categoryTitleEn: categoryBasicInfo?.textNameEn,
    categoryTitleAr: categoryBasicInfo?.textNameAr,
    categorySeoNameEn: categoryBasicInfo?.seo_name_en,

    pageId: pageId ?? 0,
    pageTitleEn: pageInfoBasic?.textNameEn,
    pageTitleAr: pageInfoBasic?.textNameAr,
    pageLogoIcon: "",
    logoIconHoverUrl: "",
    logoIconUrl: "",
    charttooltipIcon: "",
  };


  const paramsSearch = new URLSearchParams(window.location.search);

  const sectionId = paramsSearch.get('sectionId');
  const secChartId = paramsSearch.get('secChartId');
  const isArgaamEmbed = paramsSearch.get('isArgaamEmbed');


  let queryParams = {
    categoryID: sectorBasicParams.categoryID,
    pageId: sectorBasicParams.pageId,
    sectionId: sectionId,
    secChartId: secChartId,
    pageTitleEn: sectorBasicParams.pageTitleEn,
    pageTitleAr: sectorBasicParams.pageTitleAr,
    categoryTitleEn: sectorBasicParams.categoryTitleEn,
    categoryTitleAr: sectorBasicParams.categoryTitleAr,
    categorySeoNameEn: sectorBasicParams.categorySeoNameEn,

    pageLogoIcon: sectorBasicParams.pageLogoIcon,
    logoIconHoverUrl: sectorBasicParams.logoIconHoverUrl,
    logoIconUrl: sectorBasicParams.logoIconUrl,
    charttooltipIcon: sectorBasicParams.charttooltipIcon,
    isArgaamEmbed: isArgaamEmbed

  };

  //page redirection
  useEffect(() => {


    if (!isValidSectorPageId(sectorBasicParams.pageId)) {
      router.push("/404/not-found");
      return;
    }

    if (categories?.length < 1) {
      return;
    }

    if (
      sectorBasicParams.pageId &&
      checkIfStringIsNotEmtpy(pageName) &&
      categories &&
      categories.length > 0
    ) {
      const filteredPages = categories.flatMap((itm: any) =>
        itm.macrocategoryPages.filter((page: any) => page.pageId == sectorBasicParams.pageId)
      );

      if (filteredPages && filteredPages.length > 0) {
        const page = filteredPages[0];
        sectorBasicParams.categoryID = page.categoryId;
        sectorBasicParams.pageTitleEn = page.textNameEn;
        sectorBasicParams.pageTitleAr = page.textNameAr;
        sectorBasicParams.pageLogoIcon = page.logoIcon;
        sectorBasicParams.logoIconHoverUrl = page.logoIconHoverUrl;
        sectorBasicParams.logoIconUrl = page.logoIconUrl;
        sectorBasicParams.charttooltipIcon = page.charttooltipIcon;

        const category = categories.find((c: { categoryId: any; }) => c.categoryId == sectorBasicParams.categoryID);
        sectorBasicParams.categoryTitleEn = removeStartEndSpacesFromString(category.textNameEn);
        sectorBasicParams.categoryTitleAr = removeStartEndSpacesFromString(category.textNameAr);

        //update query params
        queryParams.categoryID = sectorBasicParams.categoryID;
        queryParams.pageId = sectorBasicParams.pageId;
        queryParams.pageTitleEn = sectorBasicParams.pageTitleEn;
        queryParams.pageTitleAr = sectorBasicParams.pageTitleAr;
        queryParams.categoryTitleEn = sectorBasicParams.categoryTitleEn;
        queryParams.categoryTitleAr = sectorBasicParams.categoryTitleAr;
        queryParams.categorySeoNameEn = sectorBasicParams.categorySeoNameEn;

        queryParams.pageLogoIcon = sectorBasicParams.pageLogoIcon;
        queryParams.logoIconHoverUrl = sectorBasicParams.logoIconHoverUrl;
        queryParams.logoIconUrl = sectorBasicParams.logoIconUrl;
        queryParams.charttooltipIcon = sectorBasicParams.charttooltipIcon;


      } else {
        console.error("The page is not valid that you are searching for.");
        router.push("/404/not-found");
      }
    } else {
      router.push("404/not-found");
    }
  }, [categories, router, pageName, sectorBasicParams]);




  //const searchParams = new URLSearchParams(decodeURIComponent(location.search));



  function handleScrollToSectionDiv(targetSectionId: any) {

    if (typeof document != "undefined") {
      const headerHeight: any = document.getElementById("header_section_top")?.offsetHeight;
      const sectorSectionNavHeight = document.getElementById("sector_section_slider")?.offsetHeight;
      const section: any = document.querySelector(`[data-section-id="${targetSectionId}"]`);

      if (section) {
        const scrollOptions: any = {
          // behavior: "auto",
          behavior: 'smooth', block: 'start'
        };

        const offset = (headerHeight + sectorSectionNavHeight) * 1;
        section.style.scrollMarginTop = `${offset}px`;
        section.scrollIntoView(scrollOptions);
        setTimeout(() => {
          section.style.scrollMarginTop = "";
        }, 500);
      }
    }
  }


  return (
    <>
     

      {isArgaamEmbed === '1' ? (
        // <LayoutSectorArgaamEmbed>

        //   <SectorPageBreadcrumb
        //     categoryTitle={lang == 'ar' ? sectorBasicParams.categoryTitleAr : sectorBasicParams.categoryTitleEn}
        //     pageTitle={lang == 'ar' ? sectorBasicParams.pageTitleAr : sectorBasicParams.pageTitleEn}
        //   />

        //   <SectorArgaamEmbedArea
        //     lang={lang}
        //     queryParams={queryParams}
        //     currentEnglishDate={currentEnglishDate}
        //     currentArabicDate={currentArabicDate}

        //     handleScrollToSectionDiv={handleScrollToSectionDiv}

        //   />

        // </LayoutSectorArgaamEmbed>

        <></>

      ) : (

        <LayoutMain>

          <HeaderSectorPage propsQueryParam={queryParams} />

          {/* <SectorPageBreadcrumb
            categoryTitle={lang == 'ar' ? sectorBasicParams.categoryTitleAr : sectorBasicParams.categoryTitleEn}
            pageTitle={lang == 'ar' ? sectorBasicParams.pageTitleAr : sectorBasicParams.pageTitleEn}

          /> */}

          <SectorMacroArea
            lang={lang}
            queryParams={queryParams}

            currentEnglishDate={currentEnglishDate}
            currentArabicDate={currentArabicDate}

            handleScrollToSectionDiv={handleScrollToSectionDiv}
          />

        </LayoutMain>

      )}


    </>
  );
}
export default SectorPageSub;

