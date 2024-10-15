"use client"
import React, { useEffect, useRef, useState } from 'react';

import { BrowserConfig } from '@/constants/GlobalEnums';
import { isBrowserWindow } from '@/helpers/common/GlobalHelper';
import useBrowserInfo from '@/hooks/useBrowserInfo';
import { getMacroPageSectionsApi } from '@/helpers/apiService';
import Section from '../common/Section';

export default function SectorMacroArea(
    {
        lang,
        queryParams,
        currentEnglishDate,
        currentArabicDate,
        handleScrollToSectionDiv

    }: any
) {

    const [dataFetched, setDataFetched] = useState(true);
    const browserInfo = useBrowserInfo();

    const [count, setCount] = useState(0);
    const observerTarget = useRef(null);

    const [sectionData, setSectionData] = useState<any>([]);
    const [filteredSectionData, setFilteredSectionData] = useState<any>([]);
    const [headerSliderTotalSections, setHeaderSliderTotalSections] = useState(0);


    const [visibleSection, setVisibleSection] = useState("");
    const [pageSectionTitleEn, setPageSectionTitleEn] = useState("");
    const [pageSectionTitleAr, setPageSectionTitleAr] = useState("");

    const paramsSearch = new URLSearchParams(window.location.search);
    const isPreview = paramsSearch.get('isPreview');




    const clearData = () => {
        setDataFetched(false);
        setSectionData([]);
        setFilteredSectionData([]);
        setCount(0);
        setDataFetched(true);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    if (dataFetched) {
                        setTimeout(() => {
                            fetchMacroSectionData(null, null);
                        }, 100); //-- Delay of 100 milliseconds
                    }
                    // setCount((prevCount) => prevCount + 1);
                }
            },
            { threshold: 1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [observerTarget, count, dataFetched]);

    useEffect(() => {
        clearData();
    }, [queryParams.pageId, queryParams.sectionId, queryParams.secChartId]);





    const fetchMacroSectionData = (indexSectionSlider: any, targetSectionId: any) => {

        //--if all sections loaded
        if (headerSliderTotalSections > 0 && filteredSectionData?.length > 0 && (headerSliderTotalSections == filteredSectionData?.length)) {
            setDataFetched(false);
            return false;
        }



        const sectionPromises = [];
        const isSliderSectionClick = indexSectionSlider && targetSectionId && indexSectionSlider > 0 ? true : false;
        if (isSliderSectionClick) {
            for (let page = count; page <= indexSectionSlider; page++) {
                sectionPromises.push(getMacroPageSectionsApi(page, queryParams.pageId, queryParams.sectionId, queryParams.secChartId, isPreview));
            }
        } else {
            sectionPromises.push(getMacroPageSectionsApi(count, queryParams.pageId, queryParams.sectionId, queryParams.secChartId, isPreview));
        }


        Promise.all(sectionPromises)
            .then((responses) => {

                if (responses) {

                    responses.forEach((res: any) => {

                        if (res) {
                            const newSections: any = [];
                            if (
                                res?.data != undefined &&
                                res?.data?.categoryPageSections != undefined
                            ) {


                                const sectionsSlider = res.data.categoryPageSections;
                                sectionsSlider.forEach(function (sect: any) {
                                    if (filteredSectionData?.some((x: { sectionId: any; }) => x.sectionId == sect?.sectionId)?.sectionId == undefined) {
                                        newSections.push(sect);
                                    }
                                });


                            }

                            if (newSections != undefined && newSections.length > 0) {
                                setSectionData((prevSections: any) => [...prevSections, ...newSections]);
                                setFilteredSectionData((prevFilterSections: any) => [
                                    ...prevFilterSections,
                                    ...newSections,
                                ]);

                                setCount((prevPage) => prevPage + 1);

                            }

                        }
                    });

                    if (isSliderSectionClick) {
                        setTimeout(() => {
                            const targetElement = document.querySelector(`[data-section-id="${targetSectionId}"]`);
                            if (targetElement) {
                                handleScrollToSectionDiv(targetSectionId)
                            }
                        }, indexSectionSlider > 4 ? 5500 : 3000);
                    }

                }

            })
            .catch((err) => {
                console.error("error", err);
            });


    }





    //   Note: do not add any other logic in below useEffect as its only use for appending section title with page title
    useEffect(() => {
        if (filteredSectionData?.length > 0) {
            const handleScroll = () => {
                //-- Get all the sections you want to track
                const sectionsObservable = document.querySelectorAll(
                    ".section_class_observeable"
                );

                let currentSectionId: any = "";

                //-- Loop through the sectionsObservable to find the one in the viewport
                sectionsObservable?.forEach((section) => {

                    const sectionTop = section?.getBoundingClientRect()?.top;
                    const sectionBottom = section?.getBoundingClientRect()?.bottom;




                    if (isBrowserWindow()) {

                        if (
                            sectionTop < window.innerHeight / (browserInfo == BrowserConfig.FIREFOX ? 3.5 : 2.5) &&  //--initial value was 2. I updated to 3.5 due to scroll issue on firefox. Note that if header height is less than this value should be greater
                            sectionBottom > window.innerHeight / (browserInfo == BrowserConfig.FIREFOX ? 3.5 : 2.5)
                        ) {
                            //-- Adjust the window.innerHeight / 2 condition as needed for your use case

                            currentSectionId = section?.getAttribute("data-section-id");
                        }
                    }



                });

                if (currentSectionId !== visibleSection) {
                    setVisibleSection(currentSectionId);

                }
            };

            //-- Add the scroll event listener
            window.addEventListener("scroll", handleScroll);

            //-- Clean up the event listener when the component unmounts
            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        }
    }, [visibleSection, filteredSectionData]);







    return (
        <>

            {
                filteredSectionData && filteredSectionData.length > 0
                    ?
                    <section className="d-flex w-100 chart_widgets">
                        <div className="container-fluid category-section theme-gradient-bg section-border pt-2 pb-0 mb-0">
                            <div className="row align-items-center ">
                                <div className="inner_page col-12 col-lg-95 mb-2 p-lg-0">
                                    {filteredSectionData != undefined &&
                                        filteredSectionData.length ? (
                                        filteredSectionData?.map((section: any, index: number) => (
                                            <div
                                                className="section_class_observeable"
                                                key={index}
                                                data-title-en={section?.textNameEn}
                                                data-title-ar={section?.textNameAr}
                                                data-section-id={`${section?.sectionId}`}

                                            >
                                                <Section
                                                    key={section?.sectionId}
                                                    sectionId={section?.sectionId}
                                                    title={
                                                        lang == "ar" ? section?.textNameAr : section?.textNameEn
                                                    }
                                                    sectionInfoName={
                                                        lang == "ar" ? section?.infoNameAr : section?.infoNameEn
                                                    }

                                                    data={section?.macroSectionCharts}
                                                    numberOfCharts={section?.numberOfCharts}
                                                    currentPageInfo={queryParams}

                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                    :
                    <></>
            }



            {/* <div ref={observerTarget}></div> */}
            {dataFetched && (
                <div className="data-fetch-observable" ref={observerTarget}></div>
            )}

        </>
    )
}
