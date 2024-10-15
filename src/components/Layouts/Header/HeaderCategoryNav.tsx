"use client"
import { refreshToken, resetUser } from '@/helpers/axios';
import { getPageSeoNameFromUrl } from '@/helpers/chart/ChartCommonHelpers';
import { getPageIdByPageName } from '@/helpers/common/SeoCommonHelper';
import useIsMobile from '@/hooks/useIsMobile';
import useIsVisible from '@/hooks/useIsVisible';
import { getLocaleFromURL } from '@/Routes/routeHelper';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {  useNavigate, useParams } from 'react-router-dom';



const Tab = ({ children, onClick, className, type, id }: any) => {
    const tabref = useRef<any>()
    const isfullVisible = useIsVisible(tabref)

    const handleShowMenu = isfullVisible ? onClick : null

    return (
        <button
            ref={tabref}
            onClick={handleShowMenu}
            onMouseEnter={handleShowMenu}
            className={className}
            type={type}
            id={id}
        >
            {children}
        </button>
    );
}





const HeaderCategoryNavSubEn = ({ filteredCategories }: any) => {
    //filteredCategories = filteredCategories.slice(0,10);
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const [activeSlide, setActiveSlide] = useState(0);
    // const [totalSlides, setTotalSlides] = useState(0);
    const isMobile = useIsMobile();
    const categories = useSelector((state: any) => state.home.categories);

  // Get the full pathname

    const pageSeoName = getPageSeoNameFromUrl(pathname);
    const pageId = getPageIdByPageName(pageSeoName);


    const [categoryId, setCategoryId] = useState(null);
    const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
    const [sliderOverflowClass, setSliderOverflowClass] = useState('');
    const [isMenuClicked, setIsMenuClicked] = useState(false);


    //const slidesToShow = isMobile == true ? 1 : 8;

    const selectedLanguage = getLocaleFromURL();





    const handleMouseDropdownMenu = (event: any, categoryID: any, eventType: any) => {

        event.preventDefault();
        if (eventType == 'click') {
            setHoveredCategoryId(null);
            setTimeout(() => {
                setHoveredCategoryId(categoryID);
            }, 100);
            setSliderOverflowClass('category-slider-overflow');

        } else if (eventType == 'leave') {

            setHoveredCategoryId(null);
            setSliderOverflowClass('');
        }
    }





    //--Below handleMenuClick function will make the display none of drop down menu, will navigate to new url
    const handleMenuClick = (event: any, navUrl: any) => {

        try {

            event.preventDefault();

            if (isMenuClicked == true) {
                return;
            }


            setIsMenuClicked(true);

            refreshToken()
                .then((res) => {
                    router.push(navUrl);
                    setHoveredCategoryId(null);
                    setIsMenuClicked(false);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    });

                })
                .catch((err) => {
                    resetUser(false);
                    router.push(navUrl);
                    setHoveredCategoryId(null);
                    setIsMenuClicked(false);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    });

                });

        } catch (error) {
            console.error(error);
            setIsMenuClicked(false);
            router.push(navUrl);

        }



    }




    useEffect(() => {

        if (
            pageId != undefined &&
            pageId > 0

        ) {
            const filteredPages = categories?.flatMap((itm: { macrocategoryPages: any[]; }) =>
                itm.macrocategoryPages.filter((page) => page.pageId == pageId)
            );
            setCategoryId(filteredPages?.[0]?.categoryId);

            if (isMobile == true) {
                const currentIndexCategory = filteredCategories?.findIndex((category: any) => category.categoryId === filteredPages?.[0]?.categoryId);
                //-- Set the active slide to the index of the current category. I mean bring the active slide to front in mobile view
                if (currentIndexCategory) {
                    setActiveSlide(currentIndexCategory > -1 ? currentIndexCategory : 0);
                }

            }


        }
    }, [pageId])


    const sliderRef = useRef<any>(null);

    const currLeft = useRef<any>(0);

    const lastslideref = useRef<any>()
    const lastelementvisible = useIsVisible(lastslideref)
    const widthToScroll = isMobile == true ? 170 : 205;
    const [disableSliderArrow, setDisableSliderArrow] = useState(false);
    const [isArrowClick, setIsArrowClick] = useState(false);


    const scrollToNextCategory = () => {
        setIsArrowClick(true);

        if (!lastelementvisible) {
            currLeft.current = currLeft.current - widthToScroll;
            sliderRef.current.style.left = `${currLeft.current}px`;
        }
    };





    const scrollToPrevCategory = () => {
        setIsArrowClick(true);

        if (currLeft.current < 0) {
            currLeft.current = currLeft.current + widthToScroll;
            currLeft.current = Math.min(currLeft.current, 0);

            sliderRef.current.style.left = `${currLeft.current}px`;
            sliderRef.current.style.left = `${currLeft.current}px`;

        }
    };


    useEffect(() => {

        //-- disable the next/prev buttons of slide. If last element in category array is visible and if disableSliderArrow is already false and
        //-- if page is loaded, clicked on prev/next and isArrowClick is not true
        if (isMobile == false && lastelementvisible == true) {
            if (disableSliderArrow == false && isArrowClick == false) {
                setDisableSliderArrow(true);
            }
        }

    }, [lastelementvisible])





    return (
        <>




            {
                isMobile == true
                    ?
                    <>
                        <div className='container-fluid ticker_slider px-4 mobile_nav'>
                            <div className="sliders-container">
                                <div
                                    className={`slider ${sliderOverflowClass}`}

                                    ref={sliderRef} style={{ position: 'relative', whiteSpace: 'nowrap' }}>


                                    {filteredCategories?.map((currentCategory: any, index: number) => (
                                        <div key={index + "_nav_ctg"} className="slide" ref={index == filteredCategories.length - 1 ? lastslideref : undefined}>
                                            <div className="btn-group dropdown"
                                                onMouseLeave={(e) => handleMouseDropdownMenu(e, null, 'leave')}
                                            >
                                                <Tab onClick={(e: any) => handleMouseDropdownMenu(e, currentCategory.categoryId, 'click')}
                                                    className={`dropdown-toggle ${categoryId == currentCategory.categoryId ? 'active-catg-page' : ''}`}
                                                    type="button" id="dropdownMenuButton"
                                                >
                                                    <span>
                                                        <img src={`${currentCategory.logoIconUrl}`} alt={selectedLanguage == 'ar' ? currentCategory?.textNameAr : currentCategory?.textNameEn} className='category_menu_img'
                                                            width="20"
                                                            height="20"
                                                            loading="lazy"
                                                        />
                                                        {selectedLanguage == 'ar' ? currentCategory?.textNameAr : currentCategory?.textNameEn}
                                                    </span>

                                                </Tab>


                                                <ul

                                                    className={`dropdown-menu ${(hoveredCategoryId == currentCategory.categoryId) ? "drowdown-menu-click-active" : ""}`}

                                                    aria-labelledby="dropdownMenuButton">

                                                    {currentCategory?.macrocategoryPages?.filter((x: { isActive: boolean; }) => x.isActive == true)?.map((page: any, pageIndex: number) => {

                                                        const categoryName = currentCategory?.textNameEn ? currentCategory?.textNameEn?.toLocaleLowerCase().trim().replace(/\s+/g, '-') : currentCategory?.textNameAr?.trim().replace(/\s+/g, '-');
                                                        const seo_name_en = page?.seo_name_en;


                                                        return <li
                                                            key={page.pageId + "_nav_pg"}
                                                        >
                                                            <Link
                                                                href={`/${selectedLanguage}/${categoryName}/${seo_name_en}`}
                                                                onClick={(e) => handleMenuClick(e, `/${selectedLanguage}/${categoryName}/${seo_name_en}`)}
                                                                className={`dropdown-item ${pageId == page.pageId ? 'active-catg-page' : ''}`}


                                                            >
                                                                {selectedLanguage == 'ar' ? page.textNameAr : page.textNameEn}
                                                            </Link>


                                                        </li>



                                                    })}


                                                </ul>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                                <button id="prev" className={disableSliderArrow == true ? 'slicks-prev d-none' : 'slicks-prev'} onClick={scrollToPrevCategory}>Previous</button>
                                <button id="next" className={disableSliderArrow == true ? 'slicks-next d-none' : 'slicks-next'} onClick={scrollToNextCategory}>Next</button>
                            </div>
                        </div>

                    </>
                    :
                    <>
                        <div className='container-fluid ticker_slider px-4 desktop_nav'>
                            <div className="sliders-container">
                                <div
                                    className={`slider ${sliderOverflowClass}`}

                                    ref={sliderRef} style={{ position: 'relative', whiteSpace: 'nowrap' }}>


                                    {filteredCategories?.map((currentCategory: any, index: number) => (
                                        <div key={index + "_nav_ctg"} className="slide" ref={index == filteredCategories.length - 1 ? lastslideref : undefined}>
                                            <div className="btn-group dropdown"
                                                onMouseLeave={(e) => handleMouseDropdownMenu(e, null, 'leave')}
                                            >
                                                <Tab onClick={(e: any) => handleMouseDropdownMenu(e, currentCategory.categoryId, 'click')}
                                                    className={`dropdown-toggle ${categoryId == currentCategory.categoryId ? 'active-catg-page' : ''}`}
                                                    type="button" id="dropdownMenuButton"
                                                >
                                                    <span>
                                                        <img src={`${currentCategory.logoIconUrl}`} alt={selectedLanguage == 'ar' ? currentCategory?.textNameAr : currentCategory?.textNameEn} className='category_menu_img'
                                                            width="20"
                                                            height="20"
                                                            loading="lazy"
                                                        />
                                                        {selectedLanguage == 'ar' ? currentCategory?.textNameAr : currentCategory?.textNameEn}
                                                    </span>

                                                </Tab>


                                                <ul

                                                    className={`dropdown-menu ${(hoveredCategoryId == currentCategory.categoryId) ? "drowdown-menu-click-active" : ""}`}

                                                    aria-labelledby="dropdownMenuButton">

                                                    {currentCategory?.macrocategoryPages?.filter((x: { isActive: boolean; }) => x.isActive == true).map((page: any, pageIndex: number) => {

                                                        const categoryName = currentCategory?.textNameEn ? currentCategory?.textNameEn?.toLocaleLowerCase().trim().replace(/\s+/g, '-') : currentCategory?.textNameAr?.trim().replace(/\s+/g, '-');
                                                        const seo_name_en = page?.seo_name_en;


                                                        return <li
                                                            key={page.pageId + "_nav_pg"}
                                                        >
                                                            <Link
                                                                href={`/${selectedLanguage}/${categoryName}/${seo_name_en}`}
                                                                onClick={(e) => handleMenuClick(e, `/${selectedLanguage}/${categoryName}/${seo_name_en}`)}
                                                                className={`dropdown-item ${pageId == page.pageId ? 'active-catg-page' : ''}`}


                                                            >
                                                                {selectedLanguage == 'ar' ? page.textNameAr : page.textNameEn}
                                                            </Link>


                                                        </li>



                                                    })}


                                                </ul>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                                <button id="prev" className={disableSliderArrow == true ? 'slicks-prev d-none' : 'slicks-prev'} onClick={scrollToPrevCategory}>Previous</button>
                                <button id="next" className={disableSliderArrow == true ? 'slicks-next d-none' : 'slicks-next'} onClick={scrollToNextCategory}>Next</button>
                            </div>
                        </div>
                    </>

            }
        </>
    );




};

const HeaderCategoryNavSubAr = ({ filteredCategories }: any) => {
    //filteredCategories = filteredCategories.slice(0,10);
    const router = useRouter();
    const params = useParams();
    const [activeSlide, setActiveSlide] = useState(0);
    // const [totalSlides, setTotalSlides] = useState(0);
    const isMobile = useIsMobile();
    const categories = useSelector((state: any) => state.home.categories);
    let seoPageName = params.title;
    let pageId = getPageIdByPageName(seoPageName);
    const [categoryId, setCategoryId] = useState(null);
    const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
    const [sliderOverflowClass, setSliderOverflowClass] = useState('');
    const [isMenuClicked, setIsMenuClicked] = useState(false);


    //const slidesToShow = isMobile == true ? 1 : 8;

    const selectedLanguage =  getLocaleFromURL();





    const handleMouseDropdownMenu = (event: any, categoryID: any, eventType: any) => {

        event.preventDefault();
        if (eventType == 'click') {
            setHoveredCategoryId(null);
            setTimeout(() => {
                setHoveredCategoryId(categoryID);
            }, 100);
            setSliderOverflowClass('category-slider-overflow');

        } else if (eventType == 'leave') {

            setHoveredCategoryId(null);
            setSliderOverflowClass('');
        }
    }





    //--Below handleMenuClick function will make the display none of drop down menu, will navigate to new url
    const handleMenuClick = (event: any, navUrl: any) => {

        try {

            event.preventDefault();

            if (isMenuClicked == true) {
                return;
            }


            setIsMenuClicked(true);

            refreshToken()
                .then((res) => {
                    router.push(navUrl);
                    setHoveredCategoryId(null);
                    setIsMenuClicked(false);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    });

                })
                .catch((err) => {
                    resetUser(false);
                    router.push(navUrl);
                    setHoveredCategoryId(null);
                    setIsMenuClicked(false);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    });

                });

        } catch (error) {
            console.error(error);
            setIsMenuClicked(false);
            router.push(navUrl);

        }



    }




    useEffect(() => {

        if (
            pageId != undefined &&
            pageId > 0

        ) {
            const filteredPages = categories?.flatMap((itm: { macrocategoryPages: any[]; }) =>
                itm.macrocategoryPages.filter((page) => page.pageId == pageId)
            );
            setCategoryId(filteredPages?.[0]?.categoryId);

            if (isMobile == true) {
                const currentIndexCategory = filteredCategories?.findIndex((category: { categoryId: any; }) => category.categoryId === filteredPages?.[0]?.categoryId);
                //-- Set the active slide to the index of the current category. I mean bring the active slide to front in mobile view
                if (currentIndexCategory) {
                    setActiveSlide(currentIndexCategory > -1 ? currentIndexCategory : 0);
                }

            }


        }
    }, [pageId])


    const sliderRef = useRef<any>(null);

    const currLeft = useRef<any>(0);

    const lastslideref = useRef<any>()
    const lastelementvisible = useIsVisible(lastslideref)
    const widthToScroll = isMobile == true ? 170 : 205;
    const [disableSliderArrow, setDisableSliderArrow] = useState(false);
    const [isArrowClick, setIsArrowClick] = useState(false);


    const scrollToNextCategory = () => {
        setIsArrowClick(true);

        if (!lastelementvisible) {
            currLeft.current = currLeft.current - widthToScroll;
            sliderRef.current.style.right = `${currLeft.current}px`;
        }
    };





    const scrollToPrevCategory = () => {
        setIsArrowClick(true);

        if (currLeft.current < 0) {
            currLeft.current = currLeft.current + widthToScroll;
            currLeft.current = Math.min(currLeft.current, 0);
            sliderRef.current.style.left = `${currLeft.current}px`;
            sliderRef.current.style.right = `${currLeft.current}px`;
        }
    };


    useEffect(() => {

        //-- disable the next/prev buttons of slide. If last element in category array is visible and if disableSliderArrow is already false and
        //-- if page is loaded, clicked on prev/next and isArrowClick is not true
        if (isMobile == false && lastelementvisible == true) {
            if (disableSliderArrow == false && isArrowClick == false) {
                setDisableSliderArrow(true);
            }
        }

    }, [lastelementvisible])





    return (

        <>

            {
                isMobile == true
                    ?
                    <>

                        <div className='container-fluid ticker_slider px-4 mobile_AR_nav'>
                            <div className="sliders-container">
                                <div
                                    className={`slider ${sliderOverflowClass}`}

                                    ref={sliderRef} style={{ position: 'relative', whiteSpace: 'nowrap' }}>


                                    {filteredCategories?.map((currentCategory: any, index: number) => (
                                        <div key={index + "_nav_ctg"} className="slide" ref={index == filteredCategories.length - 1 ? lastslideref : undefined}>
                                            <div className="btn-group dropdown"
                                                onMouseLeave={(e) => handleMouseDropdownMenu(e, null, 'leave')}
                                            >
                                                <Tab onClick={(e: any) => handleMouseDropdownMenu(e, currentCategory.categoryId, 'click')}
                                                    className={`dropdown-toggle ${categoryId == currentCategory.categoryId ? 'active-catg-page' : ''}`}
                                                    type="button" id="dropdownMenuButton"
                                                >
                                                    <span>
                                                        <img src={`${currentCategory.logoIconUrl}`} alt={selectedLanguage == 'ar' ? currentCategory?.textNameAr : currentCategory?.textNameEn} className='category_menu_img'
                                                            width="20"
                                                            height="20"
                                                            loading="lazy"
                                                        />
                                                        {selectedLanguage == 'ar' ? currentCategory?.textNameAr : currentCategory?.textNameEn}
                                                    </span>

                                                </Tab>


                                                <ul

                                                    className={`dropdown-menu ${(hoveredCategoryId == currentCategory.categoryId) ? "drowdown-menu-click-active" : ""}`}

                                                    aria-labelledby="dropdownMenuButton">

                                                    {currentCategory?.macrocategoryPages?.filter((x: { isActive: boolean; }) => x.isActive == true)?.map((page: any, pageIndex: number) => {

                                                        const categoryName = currentCategory?.textNameEn ? currentCategory?.textNameEn?.toLocaleLowerCase().trim().replace(/\s+/g, '-') : currentCategory?.textNameAr?.trim().replace(/\s+/g, '-');
                                                        const seo_name_en = page?.seo_name_en;


                                                        return <li
                                                            key={page.pageId + "_nav_pg"}
                                                        >
                                                            <Link
                                                                href={`/${selectedLanguage}/${categoryName}/${seo_name_en}`}
                                                                onClick={(e) => handleMenuClick(e, `/${selectedLanguage}/${categoryName}/${seo_name_en}`)}
                                                                className={`dropdown-item ${pageId == page.pageId ? 'active-catg-page' : ''}`}


                                                            >
                                                                {selectedLanguage == 'ar' ? page.textNameAr : page.textNameEn}
                                                            </Link>


                                                        </li>



                                                    })}


                                                </ul>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                                <button id="prev" className={disableSliderArrow == true ? 'slicks-prev d-none' : 'slicks-prev'} onClick={scrollToPrevCategory}>Previous</button>
                                <button id="next" className={disableSliderArrow == true ? 'slicks-next d-none' : 'slicks-next'} onClick={scrollToNextCategory}>Next</button>
                            </div>
                        </div>
                    </>
                    :
                    <>

                        <div className='container-fluid ticker_slider px-4 desktop_AR_nav'>
                            <div className="sliders-container">
                                <div
                                    className={`slider ${sliderOverflowClass}`}

                                    ref={sliderRef} style={{ position: 'relative', whiteSpace: 'nowrap' }}>


                                    {filteredCategories?.map((currentCategory: any, index: number) => (
                                        <div key={index + "_nav_ctg"} className="slide" ref={index == filteredCategories.length - 1 ? lastslideref : undefined}>
                                            <div className="btn-group dropdown"
                                                onMouseLeave={(e) => handleMouseDropdownMenu(e, null, 'leave')}
                                            >
                                                <Tab onClick={(e: any) => handleMouseDropdownMenu(e, currentCategory.categoryId, 'click')}
                                                    className={`dropdown-toggle ${categoryId == currentCategory.categoryId ? 'active-catg-page' : ''}`}
                                                    type="button" id="dropdownMenuButton"
                                                >
                                                    <span>
                                                        <img src={`${currentCategory.logoIconUrl}`} alt={selectedLanguage == 'ar' ? currentCategory?.textNameAr : currentCategory?.textNameEn} className='category_menu_img'
                                                            width="20"
                                                            height="20"
                                                            loading="lazy"
                                                        />
                                                        {selectedLanguage == 'ar' ? currentCategory?.textNameAr : currentCategory?.textNameEn}
                                                    </span>

                                                </Tab>


                                                <ul

                                                    className={`dropdown-menu ${(hoveredCategoryId == currentCategory.categoryId) ? "drowdown-menu-click-active" : ""}`}

                                                    aria-labelledby="dropdownMenuButton">

                                                    {currentCategory?.macrocategoryPages?.filter((x: { isActive: boolean; }) => x.isActive == true)?.map((page: any, pageIndex: number) => {

                                                        const categoryName = currentCategory?.textNameEn ? currentCategory?.textNameEn?.toLocaleLowerCase().trim().replace(/\s+/g, '-') : currentCategory?.textNameAr?.trim().replace(/\s+/g, '-');
                                                        const seo_name_en = page?.seo_name_en;


                                                        return <li
                                                            key={page.pageId + "_nav_pg"}
                                                        >
                                                            <Link
                                                                href={`/${selectedLanguage}/${categoryName}/${seo_name_en}`}
                                                                onClick={(e) => handleMenuClick(e, `/${selectedLanguage}/${categoryName}/${seo_name_en}`)}
                                                                className={`dropdown-item ${pageId == page.pageId ? 'active-catg-page' : ''}`}


                                                            >
                                                                {selectedLanguage == 'ar' ? page.textNameAr : page.textNameEn}
                                                            </Link>


                                                        </li>



                                                    })}


                                                </ul>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                                <button id="prev" className={disableSliderArrow == true ? 'slicks-prev d-none' : 'slicks-prev'} onClick={scrollToPrevCategory}>Previous</button>
                                <button id="next" className={disableSliderArrow == true ? 'slicks-next d-none' : 'slicks-next'} onClick={scrollToNextCategory}>Next</button>
                            </div>
                        </div>
                    </>

            }



        </>

    );




};


export default function HeaderCategoryNav({ filteredCategories }: any) {
    const selectedLanguage = getLocaleFromURL();

    return (

        <>
            {
                selectedLanguage == 'ar'
                    ?
                    <HeaderCategoryNavSubAr filteredCategories={filteredCategories} key={filteredCategories?.length ?? `category_row_header`} />
                    :
                    <HeaderCategoryNavSubEn filteredCategories={filteredCategories} key={filteredCategories?.length ?? `category_row_header`} />
            }

        </>



    )
}
