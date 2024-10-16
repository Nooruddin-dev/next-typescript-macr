


"use client"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getActiveCategoriesPages, isBrowserWindow, isEmptyEntity } from "@/helpers/common/GlobalHelper";
import { getLocaleFromURL } from "@/Routes/routeHelper";
import { strings } from "@/constants/localizedStrings";
import HeaderCategoryNav from "../Header/HeaderCategoryNav";
import SearchComponent from "@/components/common/SearchComponent";
import useIsMobile from "@/hooks/useIsMobile";


function Header({ hideSearch, hideCategoryNav }: any) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [visibleAskQuestion, setVisibleAskQuestion] = useState(false);
  const user = useSelector((state: any) => state.user.user);
  const isLoggedin = !isEmptyEntity(user);
  const isonTrial = user?.HasMacroChartsAccess === "true" && user?.isMacroOnFreeTrail !== "False";
  const selectedLanguage = getLocaleFromURL();
  let filteredCategories = useSelector((state: any) => state.home.categories);
  filteredCategories = getActiveCategoriesPages(filteredCategories);

  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false); // State to manage toggle

  const registericon = "/assets/images/EN_image/credential_icon.svg";

  const isMobile = useIsMobile();


  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleClick = (event: any) => {
    event.preventDefault();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };





  const handleLanguageChange = (language: string, event: any) => {
    event.preventDefault();
    // changeLanguageInUrl(language);
    //setApplicationLang(language);
  };

  const handleRedirectUrlAfterLogin = () => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("redirectUrlAfterLogin", "");
    }

  };

  const handleToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleLogoClick = (e: any) => {
    if (location?.pathname === `/${selectedLanguage}` || location?.pathname === '/') {
      e?.preventDefault();
      if (isBrowserWindow()) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

    }
  };

  const closeMenu = (e: any) => {
    if (isMenuOpen && e.target.classList.contains("close-menu")) {
      setMenuOpen(false);
    }
  };

  const toggleAccordion = () => {
    setAccordionOpen(!isAccordionOpen);
  };

  useEffect(() => {
    if (typeof document != "undefined") {
      document.documentElement.lang = selectedLanguage;
      document.documentElement.dir = selectedLanguage === "ar" ? "rtl" : "ltr";
    }

  }, [selectedLanguage]);

  useEffect(() => {
    if (typeof document != "undefined") {
      if (isMenuOpen === true) {
        document.documentElement.classList.add("site-mobile-view");
      } else {
        document.documentElement.classList.remove("site-mobile-view");
      }
    }



  }, [isMenuOpen]);

  return (
    <>
      <section className="header px-lg-0 px-0" id="header_section_top">
        <nav className="navbar py-lg-0 py-2 navbar-expand-lg">
          <div className="container-fluid">
            <div
              className={`bg-menu close-menu ${isMenuOpen ? "active" : ""}`}
              onClick={closeMenu}
            ></div>
            <button
              onClick={handleToggle}
              className={`navbar-toggler border-1 text-white ${isMenuOpen ? "" : "collapsed"}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon d-flex flex-column justify-content-evenly">
                <span className="hamburger"></span>
                <span className="hamburger"></span>
                <span className="hamburger"></span>
              </span>
            </button>
            <div className="col-8 col-lg-3 col-md-6">
              <Link className="navbar-brand"
                onClick={handleLogoClick} href={`/${selectedLanguage}`}
                aria-label="Argaam Macro"
                title="Argaam Macro"
              >
                Argaam Macro
                {/* <img src={logo} alt="Logo" className="d-inline-block align-text-top" /> */}
              </Link>
            </div>

            {/* This widget for Tablet View */}
            <div className="col-md-5 d-tablet">
              <div className="d-flex justify-content-end align-items-center search_lang_cont">
                <SearchComponent filteredCategories={filteredCategories} />
                <Link
                  href=""
                  className="nav-link lang_link d-inline-flex"
                  aria-current="page"
                  onClick={(e) => handleLanguageChange((selectedLanguage === "en" ? "ar" : "en"), e)}
                >
                  {selectedLanguage === "en" ? "AR" : "EN"}
                </Link>
              </div>
            </div>

            {
              isMobile == true
                ?
                <>
                  <div className="mobile_search_lang">
                    <div>
                      <Link
                        href=""
                        className="nav-link  lang_link d-flex"
                        aria-current="page"
                        onClick={(e) => handleLanguageChange((selectedLanguage === "en" ? "ar" : "en"), e)}
                      >
                        {selectedLanguage === "en" ? "AR" : "EN"}
                      </Link>
                    </div>
                    <div className="searchico_mobile" onClick={() => setIsOpenSearch(true)}></div>
                    <SearchComponent filteredCategories={filteredCategories} setIsOpenSearch={setIsOpenSearch} isOpenSearch={isOpenSearch} />
                  </div>
                </>
                :
                <></>

            }


            <div
              className={`collapse navbar-collapse justify-content-lg-end mar-rl ${isMenuOpen ? "show" : ""}`}
              id="navbarNav"
            >


              {
                isMobile == true
                  ?
                  <>

                    <div className="col-lg-3 m-menu lang_container mobile_s_lang">
                      <div className="container-fluid p-lg-0 d-flex justify-content-end flex-lg-row flex-column">
                        <ul className="mobile_menu_ul mb-2 mt-0 p-0">
                          <li
                            className="nav-item m-0 p-3"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                          >
                            {user != undefined && user != null && Object.keys(user).length !== 0 ? (
                              <>
                                <Link
                                  className="nav-link credential_link d-flex align-items-center logedin"
                                  href={""}
                                >
                                  <Image
                                    src={isEmptyEntity(user?.PictureCreativeURL) ? registericon : user?.PictureCreativeURL}
                                    height="30"
                                    width="31"
                                    className="register_icon"
                                    alt=""
                                  />
                                  <span className="ellipsis px-3 mb-0">{user.Email}</span>
                                </Link>
                                <a
                                  className={`accordion_nav ${isAccordionOpen ? "open" : ""}`}
                                  onClick={toggleAccordion}
                                >
                                </a>

                              </>
                            ) : (
                              <>
                                <Link
                                  href={""}
                                  className="nav-link credential_link d-flex align-items-center"

                                // onClick={() => (!isLoggedin ? handleRedirectToLogin() : null)}

                                >
                                  <div>
                                    <Image
                                      src={registericon}
                                      height="30"
                                      width="31"
                                      className="register_icon"
                                      alt=""
                                    />
                                    <span className="mx-2">{strings.loginMobileHeader}</span>
                                  </div>
                                </Link>
                                <a
                                  className={`accordion_nav ${isAccordionOpen ? "open" : ""}`}
                                  onClick={toggleAccordion}
                                >
                                </a>
                              </>
                            )}
                          </li>

                          <li className={`accordion_item ${isAccordionOpen ? "open" : ""}`}>
                            <ul className="px-3 mb-0">
                              {user != undefined && user != null && Object.keys(user).length !== 0 ? (
                                <>
                                  <li className="dropdown-header-user">
                                    <ul className="p-0">
                                      <li className="ask_q" onClick={() => setVisibleAskQuestion(true)}>{strings.anyQuestion}</li>
                                      <li className="sign_out">
                                        {/* <Link href={""} onClick={() => handleLogoutUser()}>
                                          <span className="ellipsis">{strings.logout}</span>
                                        </Link> */}
                                        <Link href={""} >
                                          <span className="ellipsis">{strings.logout}</span>
                                        </Link>
                                      </li>
                                    </ul>
                                  </li>
                                </>
                              ) : (
                                <></>
                              )}
                            </ul>
                          </li>

                        </ul>
                        <ul className="navbar-nav text-center p-0 text-bold secondary-links d-flex flex-lg-row flex-column justify-content-start mx-lg-4 mx-3 align-items-center position-relative">


                          <>
                            <li className="nav-item mx-2">
                              <Link

                                href={`/${selectedLanguage}`}
                                className={` nav-link `}
                                aria-current="page"
                              >
                                {strings.home}
                              </Link>
                            </li>
                            <li className="menu_sep mx-2"></li>
                          </>
                          <li className="nav-item mx-2">
                            <Link
                              href={`/${selectedLanguage}/AboutUs`}
                              className={`nav-link`}
                              aria-current="page"
                            >
                              {strings.about}
                            </Link>
                          </li>
                          <li className="menu_sep mx-2"></li>
                          <li className="nav-item mx-2">
                            <Link
                              href={`/${selectedLanguage}/contactus`}
                              className={`nav-link`}
                              aria-current="page"
                            >
                              {strings.contactus}
                            </Link>
                          </li>

                          <li className="menu_sep mx-2"></li>
                          <li className="nav-item mx-2">
                            <a href={`https://www.argaam.com/${selectedLanguage}`} className="nav-link" target="_blank">{strings.argaam}</a>
                          </li>
                          <li className="menu_sep mx-2"></li>
                          <li className="nav-item mx-2">
                            <a href={`https://www.argaamcharts.com/${selectedLanguage}`} className="nav-link" target="_blank">Charts</a>
                          </li>
                          <li className="menu_sep mx-2"></li>

                          <li className="nav-item mx-2">





                            {isonTrial ?
                              <a href="#" className="btn_free_trail nav-link">{strings.freeTrialLabel}</a>
                              :
                              (
                                user?.HasMacroChartsAccess != 'true'
                                  ?
                                  <Link href={`/${getLocaleFromURL()}/request`} className="nav-link">{strings.requestProductHeaderLbl}</Link>
                                  :
                                  null
                              )


                            }




                          </li>
                          <li className="menu_sep mx-2 d-none"></li>

                          <li
                            className="nav-item ms-2 me-0"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                          >
                            {user != undefined && user != null && Object.keys(user).length !== 0 ? (
                              <>
                                <Link
                                  href=""
                                  className="nav-link credential_link d-flex align-items-center logedin"
                                >
                                  <Image
                                    src={registericon}
                                    height="30"
                                    width="31"
                                    className="register_icon"
                                    alt=""
                                  />
                                </Link>

                                {isHovered && (
                                  <div className="dropdown-header-user">
                                    <ul className="p-0">
                                      <li><span className="ellipsis">{user.Email}</span></li>
                                      <li className="ask_q" onClick={() => setVisibleAskQuestion(true)}>{strings.anyQuestion}</li>
                                      <li className="sign_out">
                                        <Link href="" >
                                          <span className="ellipsis">{strings.logout}</span>
                                        </Link>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </>
                            ) : (
                              <Link
                                href=""
                                className="nav-link credential_link d-flex align-items-center"

                              // onClick={() => (!isLoggedin ? handleRedirectToLogin() : null)}
                              >
                                <Image
                                  src={registericon}
                                  height="30"
                                  width="31"
                                  className="register_icon"
                                  alt=""
                                />
                              </Link>
                            )}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </>
                  :
                  <>




                    <div className="d-flex col-lg-3 d-menu col-12 flex-lg-row flex-column justify-content-between search_widget">
                      {/* <ul className="navbar-nav text-center mx-lg-5 p-0 text-bold secondary-links mob_links d-flex flex-lg-row flex-column justify-content-start mx-lg-5 mx-3 align-items-center position-relative">

                        
                      </ul> */}
                      <SearchComponent filteredCategories={filteredCategories} />
                    </div>
                    <div className="col-lg-7 d-menu lang_container">
                      <div className="container-fluid p-lg-0 d-flex justify-content-end flex-lg-row flex-column">
                        <ul className="navbar-nav text-center p-0 text-bold secondary-links d-flex flex-lg-row flex-column justify-content-start mx-lg-4 mx-3 align-items-center position-relative">

                          <li className="nav-item mx-2">
                            <Link
                              // onClick={() => handleLinkGoogleAnalytics(`/${selectedLanguage}`)}
                              href={`/${selectedLanguage}`}
                              className={` nav-link`}
                              aria-current="page"
                            >
                              {strings.home}
                            </Link>
                          </li>
                          <li className="menu_sep mx-2"></li>


                          <li className="nav-item mx-2">
                            <Link
                              href={`/${selectedLanguage}/AboutUs`}
                              className={`nav-link`}
                              aria-current="page"
                            >
                              {strings.about}
                            </Link>
                          </li>
                          <li className="menu_sep mx-2"></li>
                          <li className="nav-item mx-2">
                            <Link
                              href={`/${selectedLanguage}/contactus`}
                              className={`nav-link`}
                              aria-current="page"
                            >
                              {strings.contactus}
                            </Link>
                          </li>

                          <li className="menu_sep mx-2"></li>
                          <li className="nav-item mx-2">
                            <a href={`https://www.argaam.com/${selectedLanguage}`} className="nav-link" target="_blank">{strings.argaam}</a>

                          </li>
                          <li className="menu_sep mx-2"></li>
                          <li className="nav-item mx-2">
                            <a href={`https://www.argaamcharts.com/${selectedLanguage}`} className="nav-link" target="_blank">Charts</a>
                          </li>
                          <li className="menu_sep mx-2"></li>
                          <li className="nav-item mx-2">
                            <Link
                              href={""}
                              className="nav-link  lang_link d-flex"
                              aria-current="page"
                              onClick={(e) => handleLanguageChange((selectedLanguage === "en" ? "ar" : "en"), e)}
                            >
                              {selectedLanguage === "en" ? "AR" : "EN"}
                            </Link>
                          </li>
                          <li className="menu_sep mx-2"></li>
                          <li
                            className="nav-item mx-2 position-relative"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                          >
                            {user != undefined && user != null && Object.keys(user).length !== 0 ? (
                              <>
                                <Link
                                  href={""}
                                  className="nav-link credential_link d-flex align-items-center logedin"
                                >
                                  <img

                                    src={isEmptyEntity(user?.PictureCreativeURL) ? registericon : user?.PictureCreativeURL}
                                    height="30"
                                    width="31"
                                    className="register_icon"
                                    alt=""
                                  />
                                </Link>

                                {isHovered && (
                                  <div className="dropdown-header-user">
                                    <ul className="p-0">
                                      <li><span className="ellipsis">{user.Email}</span></li>



                                      {!isEmptyEntity(user) && (
                                        <li className="ask_q"
                                          onClick={() => setVisibleAskQuestion(true)}
                                        >
                                          {strings.anyQuestion}
                                        </li>

                                      )}
                                      <li className="sign_out">
                                        <Link href={""}
                                        // onClick={() => handleLogoutUser()}
                                        >
                                          <span className="ellipsis">{strings.logout}</span>
                                        </Link>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </>
                            ) : (
                              <Link
                                href={""}
                                className="nav-link credential_link d-flex align-items-center"

                              // onClick={() => (!isLoggedin ? handleRedirectToLogin() : null)}
                              >
                                <img
                                  src={registericon}
                                  height="30"
                                  width="31"
                                  className="register_icon"
                                  alt=""
                                />
                              </Link>
                            )}
                          </li>
                          <li className="nav-item ms-2 me-0 request-btn ">



                            {isonTrial ?
                              <a href="#" className="btn_free_trail">{strings.freeTrialLabel}</a>
                              :
                              (
                                user?.HasMacroChartsAccess != 'true'
                                  ?
                                  <Link href={`/${getLocaleFromURL()}/request`}>{strings.requestProductHeaderLbl}</Link>
                                  :
                                  null
                              )


                            }

                            {/* <Link to={`/${getLocaleFromURL()}/request`}>{strings.requestProductHeaderLbl}</Link> */}


                          </li>
                        </ul>
                      </div>
                    </div>
                  </>

              }

            </div>
          </div>
        </nav>

        {hideCategoryNav ? <></> : <HeaderCategoryNav filteredCategories={filteredCategories} />}
      </section>

      {/* {visibleAskQuestion != undefined && visibleAskQuestion == true ? (
        <>
          <AskQuestion
            isOpen={visibleAskQuestion}

            onRequestClose={() => setVisibleAskQuestion(false)}

          />
        </>
      ) : (
        <></>
      )} */}


    </>
  );
}

export default Header;
