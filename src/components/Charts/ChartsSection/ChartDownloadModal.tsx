"use client"
import React, { useEffect } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";

import loaderImage from '../../../assets/images/EN_img/loading_img.svg'
import { getLocaleFromURL } from "@/Routes/routeHelper";
import useScrollbarVisibility from "@/hooks/useScrollbarVisibility";
import { isEmptyEntity } from "@/helpers/common/GlobalHelper";
import Image from "next/image";


export const ChartDownloadModal = ({ visible, finalUrl, customSetting, onRequestClose }: any) => {
  const iframeHeight = customSetting?.height ?? "600px";
  const iframeWidth = customSetting?.width ?? "1000px";

  const onReqClose = () => {
    onRequestClose();
  }

  const selectedLanguage = getLocaleFromURL();
  useScrollbarVisibility(visible)


  return (
    <Modal
      isOpen={false}
      ariaHideApp={false}
      className={`${selectedLanguage == "en"
        ? "chart-download-modal loading_modal"
        : "chart-download-modal loading_modal"
        }`}
      style={{
        content: {
          zIndex: 9999999,
          width: "30%",
          height: "700px",
          direction: selectedLanguage == "en" ? "ltr" : "rtl",
          top: "30% !important",
        },
      }}
      onRequestClose={onReqClose}
    >
      <div className="row">
        <div className="col-lg-12">
          <div> <h4>
            {/* {strings.downloadImageLoading} */}
          
            <Image src={loaderImage} className="loading-width-100" alt="Image Downloading"/>
            </h4>  </div>

          {
            (visible == true && isEmptyEntity(finalUrl) == false) &&
            <embed
              id='chart_download_iframe'
              style={{
                position: "absolute",
                height: iframeHeight,
                width: iframeWidth,
                opacity: 0,
                zIndex: -1,
              }}
              onLoad={() =>
                setTimeout(() => {
                  onReqClose()
                }, 5500)
              }
              src={finalUrl}
            />
          }




        </div>
      </div>
    </Modal >
  );
};
