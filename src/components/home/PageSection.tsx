import React, { useState } from 'react'


import PageDescriptionImg from "../../assets/images/EN_image/page_description.svg"
import close_icon from "../../assets/images/EN_img/close_icon.svg";
import ReactModal from 'react-modal';
import {freeTrialPages} from '../../util/freeTrialPages';
import { refreshToken, resetUser } from '@/helpers/axios';
import { strings } from '@/constants/localizedStrings';
import { getChartCountTitleAr } from '@/helpers/common/GlobalHelper';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';


export default function PageSection(
    {
        page,
        selectedLanguage,
        categorySeoName,
        title
    }: any
) {
    const router = useRouter();;
    const [showPageDescription, setShowPageDescription] = useState(false);

    const isFreeTrialPage = (pageId: number) => {
        return freeTrialPages?.some(element => element.pageId == pageId);
    }

    const onModalClose = () => {
        setShowPageDescription(false);
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


    return (

        <>
            <div className='d-flex flex-column'>
                <Link
                    className="box_category"
                    href={`/${selectedLanguage}/${categorySeoName}/${title}`}
                    onClick={(e) => handlePageClick(e, `/${selectedLanguage}/${categorySeoName}/${title}`)}


                >
                    <div className="widget_head d-flex align-items-center px-4 pt-3 pb-1">
                        <div className="widget_icon category_image">

                        </div>
                        <h4 className="mx_3 my-0">
                            {selectedLanguage == "en"
                                ? page.textNameEn
                                : page.textNameAr}
                        </h4>

                    </div>
                    </Link>
                    {/* <div className="sep"></div> */}

                    <div className="d-flex align-items-center px-4 py-1 chart_count pb-3">
                   <div className='describtion_widget'>
                   <span className="tooltip">{strings.pageDescHover}</span>
                   <Image onClick={(e) => setShowPageDescription(true)} height={24} width={22} src={PageDescriptionImg} alt="page description" role="button"/>
                  
                   </div>
                        <Link
                    className="box_category d-flex category_info"
                    href={`/${selectedLanguage}/${categorySeoName}/${title}`}
                    onClick={(e) => handlePageClick(e, `/${selectedLanguage}/${categorySeoName}/${title}`)}


                >
                        <p>
                            <span>{page.totalPageCharts}</span>
                            {
                                selectedLanguage === "ar"
                                    ?
                                    getChartCountTitleAr(page.totalPageCharts)

                                    : "Charts"
                            }
                        </p>
                        {
                            isFreeTrialPage(page.pageId) == true
                                ?
                                <span className="common_newtag available_package">{strings.availableForAll}</span>
                                :
                                null
                        }
                        </Link>
                    </div>


            </div>


            {showPageDescription && (
                <ReactModal
                    isOpen={showPageDescription}
                    className={"page_desc_modal note_modal"}
                    onRequestClose={onModalClose}
                    style={{
                        content: {
                            zIndex: 999999,
                            width: "30%",
                            height: "100px",

                        },
                    }}
                >



                    <div className="container p-3 sm-scroll" style={{ background: 'white' }}>
                        <div className='row align-item-center modal_header mb-3 mb-lg-4'>
                            <div className='col-lg-12 col-12'>
                                <a
                                    onClick={onModalClose}
                                >
                                    <img src={close_icon} alt="" className="" />
                                </a>

                            </div>
                            <div className='col-lg-12 col-12 text_bold mt-1 mt-lg-2 px-lg-4 px-3'>
                                <h2 className='m-0'>
                                {selectedLanguage == "ar"
                                ? page.textNameAr
                                : page.textNameEn}
                                </h2>
                            </div>

                        </div>
                        <div className='row'>
                            <div className='col-lg-12 col-md-12 px-4'>

                                <p>{selectedLanguage == "ar" ? page.descriptionAr : page.descriptionEn}</p>

                            </div>
                        </div>







                    </div>



                </ReactModal>
            )}
        </>


    )
}
