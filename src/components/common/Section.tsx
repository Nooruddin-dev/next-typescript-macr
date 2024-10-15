"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";


import { getLocaleFromURL } from "@/Routes/routeHelper";
import { createChartMainDivCssClass } from "@/helpers/chart/ChartCommonHelpers";
import { checkIfStringIsNotEmtpy, isBrowserWindow } from "@/helpers/common/GlobalHelper";
import Link from "next/link";
import { strings } from "@/constants/localizedStrings";
import getLangID, { getCurrentYear } from "@/util/helper";
import MacroInfoIcon from "./MacroInfoIcon";
import Charts from "../Charts/ChartsMain/Charts";


export default function Section({ sectionId, title, sectionInfoName, data, numberOfCharts, currentPageInfo }: any) {
  const lang = getLocaleFromURL();
  const [title_sticky, setScrolled] = useState(false);
  
  let  paramsSearch: any = null;
  if(isBrowserWindow()){
    paramsSearch= new URLSearchParams(window.location.search);
  }
 
  const isArgaamEmbed = paramsSearch.get('isArgaamEmbed');
  const chartMainClass = createChartMainDivCssClass(numberOfCharts);


  const selectedLanguage = getLocaleFromURL();





  const [currentSliceIndex, setCurrentSliceIndex] = useState(0);
  const sliceSize = 2; //-- Number of items per slice


  // Scroll offset value (in pixels)
  const scrollOffset = 100;
  // Function to handle the scroll event
  const handleScroll = () => {
    if(isBrowserWindow()){
      if (window.scrollY > scrollOffset) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }
    
  };

  const renderNextSlice = () => {
    if (currentSliceIndex * sliceSize < data?.length) {
      setCurrentSliceIndex(currentSliceIndex + 1);
    }
  };

  // Add scroll event listener when the component mounts
  useEffect(() => {
    if(isBrowserWindow()){
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  
  }, []);

  const createCategoryName = () => {
    let categoryNameForLink = currentPageInfo?.categoryTitleEn
    categoryNameForLink = categoryNameForLink?.trim();
    categoryNameForLink = categoryNameForLink?.replaceAll(' ', '-')?.toLowerCase();
    return categoryNameForLink;
  };





  //--Note: Following slice implementation is only for slow loading of 'Consumer goods' Line charts very slow loading.
  //--If the performance slow loading solved by other mechanism then we have to directly loop the data over chart without any alice implementation
  useEffect(() => {
    let delay = 0;

    if (currentPageInfo?.categoryTitleEn === 'Consumer Goods') {
      const delays = [200, 500, 800, 1000];

      delay = currentSliceIndex < delays.length ? delays[currentSliceIndex] : 200;
    } else {
      //--For other category pages
      delay = 200;
    }

    const timer = setTimeout(() => {
      renderNextSlice();
    }, delay);

    return () => {
      clearTimeout(timer);
    };

  }, [currentSliceIndex]);





  return (
    <>

      <div className="d-flex flex-column chart-container">
        <div className="heading_bg w-100 d-flex mt-1 mb-1 mt-lg-3 mb-lg-3 justify-content-between flex-lg-row flex-column align-items-lg-center align-items-start">
          <div className="d-flex top_c_head">
            <h2 className="category_head">

              {title}
              {/* <div className="head_bottom_b mt-2 sector_p">
                <span></span>
              </div> */}
            </h2>

            {
              sectionInfoName && checkIfStringIsNotEmtpy(sectionInfoName) == true
                ?
                <MacroInfoIcon
                  infoName={sectionInfoName}
                />
                :
                <></>
            }
          </div>
          {/* <nav className='nav_breadcrumb' aria-label="breadcrumb">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item active" aria-current="page">
                  <h1 className="m-0">
                    <a  className="active">
                    {selectedLanguage === 'ar' ? currentPageInfo?.pageTitleAr : currentPageInfo?.pageTitleEn}
                    </a>
                  </h1>  
                </li>
              </ol>
            </nav> */}

          {
            isArgaamEmbed != 1 && (
              <nav className='nav_breadcrumb' aria-label="breadcrumb">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <Link href={`/${selectedLanguage}`} style={{ cursor: 'pointer' }}>{strings.sectorBreadcrumbHome}</Link>

                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    <Link href={`/${selectedLanguage}#${createCategoryName()}`} style={{ cursor: 'pointer' }}>
                      {selectedLanguage === 'ar' ? currentPageInfo?.categoryTitleAr : currentPageInfo?.categoryTitleEn}
                    </Link>

                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <h1 className="m-0">
                      <a className="active">
                        {selectedLanguage === 'ar' ? currentPageInfo?.pageTitleAr : currentPageInfo?.pageTitleEn}
                      </a>
                    </h1>
                  </li>
                </ol>
              </nav>
            )
          }



        </div>

        <div className="row mt-1 mob-less-mar">


          {
            // data?.slice(0, currentSliceIndex * sliceSize)?.map((item, index) => { //--remove the data slice for performance
            data?.map((item: any, index: number) => {
              const configuration = JSON.parse(
                item?.configuration == undefined ? "{}" : item?.configuration
              );
              const isTrading = configuration?.dataSource == "trading";

              return isTrading ?
              <></> 
              :
                <Charts
                  titleEn={item.nameEn?.trim()}
                  titleAr={item.nameAr?.trim()}
                  subtitle={selectedLanguage === 'ar' ? item.measuringUnitNameAr : item.measuringUnitNameEn}
                  key={item.chartId + index}
                  urlconfig={{
                    language: getLangID(lang),
                    toYear: getCurrentYear(0)
                  }}
                  section={item}
                  chartMainClass={chartMainClass}
                  hasCionId={sectionId}
                  mainomparision={false}
                  charttooltipIcon={currentPageInfo?.charttooltipIcon}
                  pageTitle={selectedLanguage === 'ar' ? currentPageInfo?.pageTitleAr : currentPageInfo?.pageTitleEn}
                  sectionTitle={title}
                  isArgaamEmbed={currentPageInfo?.isArgaamEmbed ?? '0'}
                />

              
            })
          }




        </div>
      </div>

    </>
  );
}
