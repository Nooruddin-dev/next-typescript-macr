"use client"
import { refreshToken, resetUser } from "@/helpers/axios";
import { getActiveCategoriesPages, isBrowserWindow } from "@/helpers/common/GlobalHelper";
import { getLocaleFromURL } from "@/Routes/routeHelper";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import CategoriesSideNav from "./CategoriesSideNav";
import PageSection from "./PageSection";
import SiteLoader from "../common/SiteLoader";




function CategorySection(props: any) {

  const router = useRouter(); // useRouter instead of useNavigate
  const pathname = usePathname();

  const selectedLanguage = getLocaleFromURL()

  // const isMobile = useIsMobile();
  const isMobile = false;

  const {  searchText } = props;

  let macroCategories =   useSelector(
    (state: any) => state.home.categories
  );



  let filteredCategories = useMemo(() => {
    if (!searchText) {
      return macroCategories;
    }

    const normalizedSearchText = searchText.toLowerCase();

    return macroCategories
      ?.map((category: any) => {
        const categoryNameEn = category.textNameEn.toLowerCase();
        const categoryNameAr = category.textNameAr.toLowerCase();

        const showAllCategoryPages =
          categoryNameEn.includes(normalizedSearchText) ||
          categoryNameAr.includes(normalizedSearchText);

        const filteredPages = category.macrocategoryPages?.filter((x: { isActive: boolean; }) => x.isActive == true)?.filter((page: any) => {
          const pageTitle =
            selectedLanguage === "en" ? page.textNameEn : page.textNameAr;

          return pageTitle.toLowerCase().includes(normalizedSearchText);
        });

        return {
          ...category,
          macrocategoryPages: showAllCategoryPages
            ? category.macrocategoryPages
            : filteredPages,
          showCategory: showAllCategoryPages || filteredPages.length > 0,
        };
      })
      .filter((category: any) => category.showCategory);
  }, [macroCategories, searchText, selectedLanguage]);


  filteredCategories = getActiveCategoriesPages(filteredCategories);



  const [activeCategory, setActiveCategory] = useState(
    filteredCategories && filteredCategories.length > 0 && filteredCategories[0]?.categoryId
      ? filteredCategories[0]?.categoryId
      : 0
  );
  //only check in pages
  //   return macroCategories.filter(category =>
  //     category.macrocategoryPages.some(page =>
  //       selectedLanguage === 'en'
  //         ? page.textNameEn.toLowerCase().includes(searchText.toLowerCase())
  //         : page.textNameAr.includes(searchText)
  //     )
  //   );
  // }, [macroCategories, searchText, selectedLanguage]);

  const handleScrollToActiveCategory = (categoryId: number) => {
    // Scroll to the active category
    const element = document.getElementById(`category-${categoryId}`);



    const headerHeight: any = document.getElementById("header_section_top")?.offsetHeight;
    // const sectorSectionNavHeight = document.getElementById("sector_section_slider")?.offsetHeight;

    if (element) {
      const scrollOptions: any = {
        // behavior: "auto",
        behavior: 'smooth', block: 'start'
      };

      //const offset = (headerHeight + sectorSectionNavHeight) * 1;
      const offset = (headerHeight) * 1;
      element.style.scrollMarginTop = `${offset}px`;
      element.scrollIntoView(scrollOptions);
      setTimeout(() => {
        element.style.scrollMarginTop = "";
      }, 500);
    }
  }


  const handleActiveCategory = (e: any, categoryId: number) => {
    e.preventDefault();
    setActiveCategory(categoryId);

    handleScrollToActiveCategory(categoryId);

  }




  const handlePageClick = (e: any, navUrl: string) => {
    e.preventDefault();

    refreshToken()
      .then((res: any) => {
   
        router.push(navUrl);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

      })
      .catch((err: any) => {
        resetUser(false);
        setTimeout(() => {
          router.push(navUrl);
        }, 200);

      });

  }




  // handle if category name is with hash and also normal scroll
  useEffect(() => {

    if (isBrowserWindow()) {
      const hash = window.location.hash;
      if (hash) {

        const category = hash.replace("#", "")?.replaceAll('-', ' ')?.toLowerCase()?.trim();
        const categoryIdByName = filteredCategories?.find((x: { textNameEn: string; }) => x.textNameEn?.toLowerCase()?.trim() == category)?.categoryId;

        if (categoryIdByName && parseInt(categoryIdByName) > 0) {
          setActiveCategory(categoryIdByName);

          setTimeout(() => {
            handleScrollToActiveCategory(categoryIdByName);
          }, 200);
        }

      } else { //--hanlde normal scroll to top of the page

        window.scrollTo(0, 0);
        window.history.scrollRestoration = 'manual'
      }
    }

  }, [pathname]);





  return (
    <section className="category_main_section">

      <div

        className="container-fluid category-section theme-gradient-bg section-border pt-0 pb-0 mb-0"
      >
        <div className="row h_page_mr_t">

          <div className="col-12 col-lg-2 data_target_menu">
            <CategoriesSideNav
              filteredCategories={filteredCategories}
              activeCategory={activeCategory}
              selectedLanguage={selectedLanguage}
              handleActiveCategory={handleActiveCategory}
            />
          </div>


          <div className="home_categories col-12 col-lg-10 ">


            {filteredCategories != undefined &&
              filteredCategories != null &&
              filteredCategories?.length > 0 ? (
              filteredCategories?.map((category: any, index: number) => (
                <div className="mb-4 position-relative" key={index + 'catg_sect'} id={`category-${category.categoryId}`}>

                  <div className="w-100 d-flex">



                    <h3 className={`category_head desktop mb-3 mt-2 ${category.categoryId == activeCategory ? 'active-category' : ''}`}>
                      {/* <img src={general_data_icon} className='category_head_icon' /> */}
                      <img src={`${category.listIcon}`} className='category_head_icon' alt="Category" />
                      <span className="mx-2 cate_txt">
                        {selectedLanguage == "en"
                          ? category.textNameEn
                          : category.textNameAr}
                      </span>
                      <>

                      </>
                      <div className="head_bottom_b mt-2 h_categ_head">
                        <span></span>
                        <span></span>
                      </div>
                    </h3>


                  </div>
                  <div className="row category-hub">
                    {category?.macrocategoryPages?.filter((x: { isActive: boolean; }) => x.isActive == true)?.map((page: any, pageIndex: number) => {
                      const categoryName = category?.textNameEn

                        ? category?.textNameEn
                          ?.toLocaleLowerCase()
                          .trim()
                          .replace(/\s+/g, "-")
                        : category?.textNameAr?.trim().replace(/\s+/g, "-");
                      const title = page?.seo_name_en
                        ? page?.seo_name_en
                        : page?.textNameEn?.trim().replace(/\s+/g, "-");

                      return (
                        <>
                          <div className="col-12 w-lg-25 mt-0"
                            key={page.pageId}
                          >
                            <PageSection
                              page={page}
                              selectedLanguage={selectedLanguage}
                              categorySeoName={categoryName}

                              title={title}

                            />

                          </div>

                        </>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <SiteLoader />
            )}

          </div>

        </div>
      </div>

    </section>
  );
}

export default CategorySection;
