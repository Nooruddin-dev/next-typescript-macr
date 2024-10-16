import { strings } from '@/constants/localizedStrings';
import { getGlobalSearchDataApi } from '@/helpers/apiService';
import { refreshToken, resetUser } from '@/helpers/axios';
import { isGlobalSearchDataExpired } from '@/helpers/common/GlobalHelper';
import useIsMobile from '@/hooks/useIsMobile';
import { getLocaleFromURL } from '@/Routes/routeHelper';
import { setGlobalSearch } from '@/store/global-search/slice';
import { checkIfStringIsNotEmtpy } from '@/util/helper';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';


export default function SearchComponent({ filteredCategories , setIsOpenSearch, isOpenSearch}: any) {
    const router = useRouter();
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState<any>();
    const globalSearchData = useSelector(
        (state: any) => state.globalSearch.globalSearch
    );

    const isMobile = useIsMobile();

    const lastUpdatedGlobalSearch = useSelector((state: any) => state.globalSearch.lastUpdated);
    const selectedLanguage = getLocaleFromURL();

    const lang = getLocaleFromURL();

    function normalizeArabicText(text: any) {
        try {
            
            // Remove diacritics (zabar, zer, pesh, etc.)
            let normalizedText = text?.replace(/[\u064B-\u065F]/g, '');

            // normalizedText?.replace(/\ا/g, "أ")
            //     .replace(/\أ/g, "ا")
            //     .replace(/\ى/g, "ي")
            //     .replace(/\ه/g, "ة")
            //     .replace(/\ا/g, "آ")
            //     .replace(/\عِ/g, "ع")
            //     .replace(/\آ/g, "ا")
            //     .replace(/\إ/g, "ا")

            normalizedText = normalizedText
            .replace(/\ا/g, "أ")    // Replace all Alif to Hamza Alif
            .replace(/\أ/g, "أ")   // Normalize all Hamza Alif to a single form
            .replace(/\إ/g, "أ")   // Normalize all Hamza Alif with Hamza on top
            .replace(/\ى/g, "ي")   // Normalize Alif Maqsura to Ya
            .replace(/\ه/g, "ة")   // Normalize Heh to Teh Marbuta
            .replace(/\آ/g, "أ")   // Normalize Alif Madda to Hamza Alif
            .replace(/\عِ/g, "ع")  // Normalize Kasra under Ain

            return normalizedText;

        } catch (error) {
            console.error(error);
            return text;
        }
    }



    const makeFinalSearchData = (globalSearchData: any, textTitle: any) => {
        textTitle = textTitle?.toLowerCase();

        let filteredPages = [];
        let filteredSections = [];
        let filteredCharts = [];

        if (lang == 'ar') {
            textTitle = normalizeArabicText(textTitle);

            filteredPages =
                globalSearchData.pages?.filter(
                    (page: any) =>
                        normalizeArabicText(page?.pageNameAr?.toLowerCase())?.includes(textTitle)
                ) || [];
            filteredSections =
                globalSearchData.sections?.filter(
                    (section: any) =>
                        normalizeArabicText(section?.secNameAr?.toLowerCase())?.includes(textTitle)
                ) || [];
            filteredCharts =
                globalSearchData.charts?.filter(
                    (chart: any) =>
                        normalizeArabicText(chart?.chartNameAr?.toLowerCase())?.includes(textTitle)
                ) || [];

        } else {
            
            filteredPages =
                globalSearchData.pages?.filter(
                    (page: any) =>
                        page?.pageNameEn?.toLowerCase()?.includes(textTitle)
                ) || [];
            filteredSections =
                globalSearchData.sections?.filter(
                    (section: any) =>
                        section?.secNameEn?.toLowerCase()?.includes(textTitle)
                ) || [];
            filteredCharts =
                globalSearchData.charts?.filter(
                    (chart: any) =>
                        chart?.chartNameEn?.toLowerCase()?.includes(textTitle)
                ) || [];
        }

   

        // Create a new filtered object
        const filteredFinalData = {
            pages: filteredPages,
            sections: filteredSections,
            charts: filteredCharts,
        };

        return filteredFinalData;
    };

    const handleSearch = (searchTxt: any) => {
        try {
            
            //--check if global search data expired
            const isExpired = isGlobalSearchDataExpired(lastUpdatedGlobalSearch);
            if (isExpired) {
                dispatch(setGlobalSearch(undefined));
            }

            if (checkIfStringIsNotEmtpy(searchTxt) == true) {
                setSearchText(searchTxt);

                searchTxt = searchTxt?.toLowerCase();
                if (
                    globalSearchData &&
                    (globalSearchData?.pages?.length > 0 ||
                        globalSearchData?.sections?.length > 0 ||
                        globalSearchData?.charts?.length > 0)
                ) {
                    let filteredFinalData = makeFinalSearchData(globalSearchData, searchTxt);

                    setSearchResults(filteredFinalData);
                } else {
                    try {
                        getGlobalSearchDataApi()
                            .then((res: any) => {
                                const { data } = res;

                                if (data != undefined) {
                                    dispatch(setGlobalSearch(data));

                                    let filteredFinalData = makeFinalSearchData(data, searchTxt);
                                    setSearchResults(filteredFinalData);
                                }
                            })
                            .catch((err: any) => {
                                console.error("error", err);
                            });
                    } catch (error) {
                        console.error("Error fetching data from API", error);
                        setSearchResults(null);
                    }
                }

            } else {
                setSearchText("");
                setSearchResults(null);
            }

        } catch (error: any) {
            console.error('An error occurred:', error.message);
            return null;
        }
    };

    const createTitleForUrl = (title: any) => {
        return title?.toLocaleLowerCase()?.trim()?.replace(/\s+/g, "-");
    };

    const handleNavigateBySection = (event: any) => {
        // event.preventDefault();

        refreshToken()
            .then((hasExpired: any) => {

                if (hasExpired == true) {
                    resetUser(false);
                }
            })
            .catch((err) => {
                resetUser(false);
            });

        setSearchResults(null);
        setSearchText("");
        setSearchText("");

        if (isMobile === true) {
            setIsOpenSearch(false);
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    const navigateBySection = (entityName: any, record: any) => {


        const filteredPages = filteredCategories?.flatMap((itm: any) => itm.macrocategoryPages.filter((page: any) => page.pageId == record?.pageId));
        let pageInfo = null;
        if (filteredPages && filteredPages.length > 0) {
            pageInfo = filteredPages[0];
        }



        let navigateUrl = "";
        if (entityName == "page") {
            let cateName = record.catNameEn;
            let pageNameUrl = pageInfo?.seo_name_en;
            navigateUrl = `/${selectedLanguage}/${createTitleForUrl(cateName)}/${createTitleForUrl(pageNameUrl)}`;
        } else if (entityName == "section") {
            let cateName = filteredCategories?.find(
                (x: any) => x.categoryId == record?.categoryId
            )?.textNameEn;
            let pageNameUrl = pageInfo?.seo_name_en;
            let sectionId = record?.secId;
            navigateUrl = `/${selectedLanguage}/${createTitleForUrl(cateName)}/${createTitleForUrl(pageNameUrl)}?sectionId=${sectionId ?? 0}`;
        } else if (entityName == "chart") {
            let cateSearch = filteredCategories?.find(
                (x: any) => x.categoryId == record?.categoryId
            );
            let cateName = cateSearch?.textNameEn;
            let pageNameUrl = pageInfo?.seo_name_en
            let sectionId = record?.sectionId;
            let secChartId = record?.secChartId;
            navigateUrl = `/${selectedLanguage}/${createTitleForUrl(cateName)}/${createTitleForUrl(pageNameUrl)}?sectionId=${sectionId ?? 0}&secChartId=${secChartId ?? 0}`;
        }
        if (checkIfStringIsNotEmtpy(navigateUrl) == true) {
            return navigateUrl;
        } else {
            return `/${getLocaleFromURL()}`
        }


    };



    const handleClickOutsideSearch = (event: any) => {
        const searchContainer = document.getElementById("search-container");
        const searchInput = document.querySelector(".search-input-field");

        if (
            searchContainer &&
            !searchContainer.contains(event.target) &&
            searchInput &&
            !searchInput.contains(event.target)
        ) {
            setSearchText("");
            setSearchResults(null);
        }
    };

    const handleMobileSearchClick = () => {
        setIsOpenSearch(!isOpenSearch);  // Toggle the state
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutsideSearch);

        return () => {
            document.removeEventListener("click", handleClickOutsideSearch);
        };
    }, []);

    return (
        <>


            <div className={`side_search ${isOpenSearch ? 'opensearch' : ''}`}>
                <input type="search"
                    value={searchText}
                    autoComplete="off"
                    className='search-input-field'
                    name="بحث"
                    placeholder={strings?.searchPlaceholder}
                    onChange={(event) => handleSearch(event.target.value)}
                />
                {
                    isMobile == true
                        ?
                        <div className='mobile_search' onClick={handleMobileSearchClick}></div>
                        :
                        <></>

                }
            </div>





            {searchResults && (
                <div className="search-results" id="search-container">
                    <div className="row w-100 m-auto header_search">
                        <div className="col-md-4">
                            <div className="search-column">
                                <h3 className="pb-2 mb-3">
                                    {strings.searchTitlePage}
                                </h3>

                                <ul className="p-0">
                                    {searchResults?.pages?.length > 0 ? (
                                        searchResults?.pages
                                            ?.slice(0, 20)
                                            ?.map((page: any, index: number) => (
                                                <li key={(page.pageId ?? 0) + (index ?? 0)}>
                                                    <Link
                                                        style={{
                                                            color: "#8b8b8b",
                                                            textDecoration: "none",
                                                        }}
                                                        href={navigateBySection("page", page)}
                                                        onClick={(e) =>
                                                            handleNavigateBySection(e)
                                                        }
                                                    >
                                                        <h5>
                                                            {selectedLanguage === "ar"
                                                                ? page.catNameAr
                                                                : page.catNameEn}
                                                        </h5>
                                                        {selectedLanguage === "ar"
                                                            ? page.pageNameAr
                                                            : page.pageNameEn}
                                                    </Link>
                                                </li>
                                            ))
                                    ) : (
                                        <p>{strings.nodata}</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="search-column">
                                <h3 className="pb-2 mb-3">
                                    {strings.searchTitleSection}
                                </h3>

                                <ul className="p-0">
                                    {searchResults?.sections?.length > 0 ? (
                                        searchResults?.sections
                                            ?.slice(0, 20)
                                            ?.map((section: any, index: number) => (
                                                <li key={(section.secId ?? 0) + (index ?? 0)}>
                                                    <Link
                                                        href={navigateBySection("section", section)}
                                                        onClick={(e) =>
                                                            handleNavigateBySection(e)
                                                        }
                                                        style={{
                                                            color: "#8b8b8b",
                                                            textDecoration: "none",
                                                        }}
                                                    >
                                                        <h5>
                                                            {selectedLanguage === "ar"
                                                                ? section.pageNameAr
                                                                : section.pageNameEn}
                                                        </h5>
                                                        {selectedLanguage === "ar"
                                                            ? section.secNameAr
                                                            : section.secNameEn}
                                                    </Link>
                                                </li>
                                            ))
                                    ) : (
                                        <p>{strings.nodata}</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="search-column">
                                <h3 className="pb-2 mb-3">
                                    {strings.searchTitleCharts}
                                </h3>

                                <ul className="p-0">
                                    {searchResults?.charts?.length > 0 ? (
                                        searchResults?.charts
                                            ?.slice(0, 20)
                                            ?.map((chart: any, index: number) => (
                                                <li key={(chart.chartId ?? 0) + (index ?? 0)}>
                                                    <Link
                                                        href={navigateBySection("chart", chart)}
                                                        onClick={(e) =>
                                                            handleNavigateBySection(e)
                                                        }
                                                        style={{
                                                            color: "#8b8b8b",
                                                            textDecoration: "none",
                                                        }}
                                                    >
                                                        <h5>
                                                            {selectedLanguage === "ar"
                                                                ? chart.secNameAr
                                                                : chart.secNameEn}
                                                        </h5>
                                                        {selectedLanguage === "ar"
                                                            ? chart.chartNameAr
                                                            : chart.chartNameEn}
                                                    </Link>
                                                </li>
                                            ))
                                    ) : (
                                        <p>{strings.nodata}</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
