'use client'

import { useState } from "react";
// import facebookIcon from "../../assets/images/EN_image/facebook-icon.svg";
// import linkedInIcon from "../../assets/images/EN_image/linkedin-icon.svg";
// import twitterIcon from "../../assets/images/EN_image/twitter-icon.svg";
// import youtubeInIcon from "../../assets/images/EN_image/youtube-icon.svg";

import { useSelector } from 'react-redux';



// import PrivacyPolicy from "../User/PrivacyPolicy";
// import TermsConditions from "../User/TermsConditions";
import Link from "next/link";
import { getLocaleFromURL } from "@/Routes/routeHelper";
import { getCurrentYear } from "@/helpers/common/GlobalHelper";
import { strings } from "@/constants/localizedStrings";


const ContactSection = () => {
  const lang =  getLocaleFromURL();

  const handleClick = (event: any) => {
    event.preventDefault();
    // Add any additional logic here
  };


  return (
    <>
      <div className="d-flex flex-column mx-0 mx-lg-5 lastfooter_sm">
        <ul className="list-unstyled footer_links footer_nav w-100 m-0 ar_width">
          <li className="mb-3">
            <h3 className="heading_text d-lg-inline d-block">{strings?.footerSocialMedia}
            </h3>
          </li>
        </ul>

        <ul className="list-unstyled d-flex footer_links footer_nav w-100 dir_ico">

          <li className="mar_dir">
            <Link href="https://www.facebook.com/argaamplus/" target="_blank">
              {/* <img
                src={instagramIcon}
                alt="Icon"
              /> */}
              <img
                src={""}
                alt="Icon"
              />
            </Link>
          </li>
          <li className="mar_dir">
            <Link href="https://www.linkedin.com/company/argaam-fz-llc/" target="_blank">
              <img
                src={""}
                alt="Icon"
              />
            </Link>
          </li>
          <li className="mar_dir twitter_icon">
            <Link href="https://twitter.com/argaamplus" target="_blank">
              <img
                src={""}
                alt="Icon"
              />
            </Link>
          </li>
          <li className="mar_dir">
            <Link href="https://www.youtube.com/@argaam" target="_blank">
              <img
                src={""}
                alt="Icon"
              />
            </Link>
          </li>
        </ul>





        <ul className="list-unstyled footer_links footer_nav w-100 mx-0 mt-1 ar_display state_ar_en">
          <li className="mb-2">
            <h3 className="heading_text d-lg-inline d-block">{strings.footerHotLine}</h3>
          </li>
          {/* <li className="m-0">
                <h2>
                  {lang == "ar" ? 11596 : 16201}
                 
                </h2>
              </li> */}
        </ul>


       
      </div>
    </>
  );
};

const CopyrightSection = () => {
  const [privacymodal, setprivacymodal] = useState(false);
  const [termsModal, settermsModal] = useState(false);

  return (
    <>
      <div className="col-12 col-lg-4">
        {/* <p className="heading_text text-center fs-6 my-2 m-lg-0 ">
        {strings?.copyright}
      </p> */}



        <ul className="heading_text text-center fs-6 my-2 m-lg-0 copyright mb-4">


          <li>{strings.formatString(strings.copyright, getCurrentYear())}</li>
          <li>-</li>
          <li>{strings.argaamdotcom}</li>
          <li>-</li>
          <li>{strings.allrightsreserved}</li>


        </ul>
      </div>
      <div className="col-12 col-lg-4">
        <p className="text-center m-0">

          {strings.formatString(
            strings.powereddevelopedby,
            <span>{strings.argaam}</span>,
            // getCurrentYear()
          )}


        </p>
      </div>
      <div className="col-12 col-lg-4">

        {/* <PrivacyPolicy
          visible={privacymodal}
          onClose={(e: any) => {
            e.preventDefault();
            setprivacymodal(false);
          }}
        /> */}

        {/* <TermsConditions
          visible={termsModal}
          onClose={(e: any) => {
            e.preventDefault();
            settermsModal(false);
          }}
        /> */}


        <ul className="bottom-links">
          <li>
            <Link href="" onClick={() => setprivacymodal(true)}>{strings.privacyPolicyFooter}</Link>
          </li>

          <li>
            <Link href="" onClick={() => settermsModal(true)}>   {strings.termsconditions}</Link>
          </li>
        </ul>
      </div>
    </>
  );
};
const LogoSection = () => {
  return (

    <Link href="/" className="dir-float d-lg-block d-flex justify-content-center my-4 my-lg-0 footer_logo"
      style={{ cursor: "pointer", fontSize: '0px' }}
      aria-label=" Argaam Macro"

      title=" Argaam Macro"
    >
      {/* <img
            src={Footer_LOGO_EN}
            alt="footer Logo"
            className="w-lg-15 float-end"
          /> */}
      Argaam Macro
    </Link>

  );
};

function Footer() {


  const handleClick = (event: any) => {
    event.preventDefault();
    // Add any additional logic here
  };



  //const lang = strings.getLanguage();
  const selectedLanguage = 'en'

  return (
    <div className="container-fluid">
      <div className="row my-0 pt-5 pb-2 footer_bg px-5 justify-content-between d-flex align-items-center flex-column">
        <div className="col-11 p-0 d-flex flex-column">
          <div className="col-12 col-lg-12 py-0 dir_mar_b">
            <LogoSection />




          </div>
          <div className="col-12 col-lg-12 px-0 mb-2 mb-lg-2">
            <div className="d-flex justify-content-between flex-lg-row flex-column">



              <ul className="list-unstyled footer_links footer_nav w-100">
                <li className="mb-3">
                  <h3 className="heading_text d-lg-inline d-block">Quick links </h3>
                </li>
                <li className="mb-1">
                  <Link href={`/${selectedLanguage}`}
                    onClick={() => {
                      if(typeof window != undefined){
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }
                    
                    }}
                  >
                    {strings.home}
                  </Link>
                </li>
                <li className="mb-1">
                  <Link href={`/${selectedLanguage}/AboutUs`}
                    onClick={() => {
                      if(typeof window != undefined){
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }
                    
                    }}
                  >  {strings.about}
                  </Link>
                </li>
                <li className="mb-1">
                  <Link href={`/${selectedLanguage}/contactus`}
                    onClick={() => {
                      if(typeof window != undefined){
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }
                     
                    }}
                  >
                    {strings.contactus}
                  </Link>
                </li>
              </ul>

              <ul className="list-unstyled footer_links footer_nav w-100">
                <li className="mb-3">
                  <h3 className="heading_text d-lg-inline d-block"> {strings.footerContactDetails}
                  </h3>
                </li>
                <li className="mb-1">
                  <Link href="#" onClick={handleClick}>{strings.footerTell} <span>+966920007759</span></Link>
                </li>
                <li className="mb-1">
                  <Link href="#" onClick={handleClick}>{strings.footerFax} <span>+966112293429</span></Link>
                </li>
                <li className="mb-1">
                  <Link href="#" onClick={handleClick}>{strings.footerAddress} </Link>
                </li>
                <li className="mb-1">
                  <Link href="mailto:macro@argaam.com" className="custom-pointer">{strings.footerEmail} macro@argaam.com</Link>
                </li>
              </ul>

              <ul className="list-unstyled footer_links footer_nav w-100">
                <li className="mb-3">
                  <h3 className="heading_text d-lg-inline d-block">{strings.footerNeedHelp}
                  </h3>
                </li>
                <li className="mb-1">
                  <Link href={`https://www.argaam.com/${selectedLanguage}`} target="_blank">
                    {strings.argaamWebsite}
                  </Link>
                </li>
                {/* <li className="mb-1 point_none">
                  <Link >{strings.faq}</Link>
                </li> */}
              </ul>
              <ContactSection />





            </div>
          </div>

          <hr></hr>
          <div className='d-flex align-items-center justify-content-between flex-lg-row flex-column footer_contact mb-lg-2 py-3'>

            <CopyrightSection />

          </div>
        </div>
      </div>
      {/* <ScrollToTopButton /> */}
    </div>

  );
}

export default Footer;
