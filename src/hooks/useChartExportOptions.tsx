
"use client"
import React from 'react';
import download_icon_full from "../assets/images/EN_img/download_icon_full.svg";
import NotesIcon from "../assets/images/EN_img/notes_icon.svg";
import calender_icon from "../assets/images/EN_img/calender_icon.svg";
import { useSelector } from 'react-redux';
import { API_ARGAAM_PLUS_URL, ENDPOINTS } from '@/services/config';
import { apiRequest } from '@/helpers/axios';
import { strings } from '@/constants/localizedStrings';
import { showErrorMessage } from '@/helpers/common/ValidationHelper';
import { isEmptyEntity } from '@/helpers/common/GlobalHelper';



function useChartExportOptions({ isFullView, onNotesClick, onExcelClick, onImageClick }: any) {

    const user = useSelector((state: any) => state.user.user);
    const isCpuser = user?.CpUser === "true";
    const hasAccess = user?.HasMacroChartsAccess === "true";
    const isonTrial = user?.isMacroOnFreeTrail !== "False";
    const isExcelAllowed = user?.isMacroExcelAllowed == "true";

    const isPlusSubscriber = user?.IsArgaamSubscriber == "true";
    const analystPkgwithoutTrial = isPlusSubscriber && !isonTrial;

    const downloadExcel = "https://argaamplus.s3.eu-west-1.amazonaws.com/DownloadChart-d8667ca9.svg";
    const downloadImage = "https://argaamplus.s3.eu-west-1.amazonaws.com/ImageDownload_icon-280cf448.svg";


    const updateExcelDownloadCount = (callback: any) => {

        // override the base url
        const config = {
            baseURL: API_ARGAAM_PLUS_URL,
        };

        let urlSub = `${ENDPOINTS.updateExcelDownloadCount}?userId=${user?.UserId}`;
        apiRequest.post(urlSub, null, config)
            .then((res) => {
                const allowed = res.data;
                if (allowed) {
                    callback();
                } else {
                    showErrorMessage(strings.excelDownloadError);
                }
            })
            .catch((err) => {
                showErrorMessage(strings.commonErrorAlert);
                console.error("Excel downloading error", err);
            });
    };



    const generateExcelExportButton = () => {
        if (isFullView == true) {
            return (
                <li className="my-2 my-lg-2 ms-lg-0">
                    <span className="tooltip">{strings.excel}</span>
                    <div className="btn-group d-block">
                        <img

                            id="downloadwidget"
                            src={download_icon_full}
                            alt=""
                            className="w-100"
                            onClick={() => {
                              
                                if (isCpuser) {
                                    onExcelClick();
                                } else {
                                    !isEmptyEntity(user) &&
                                        hasAccess &&
                                        isPlusSubscriber &&
                                        isExcelAllowed
                                        ? updateExcelDownloadCount(onExcelClick)
                                        : showErrorMessage(
                                            strings[
                                            analystPkgwithoutTrial
                                                ? "analystuserexcelerror"
                                                : "freeuserexcelerror"
                                            ]
                                        );
                                }
                            }}
                        />

                    </div>
                </li>
            )
        } else {
            return (
                <li className="nav-item p-0 pull-left" >
                    <span className="tooltip">{strings.download}</span>
                    <a

                        className=""
                        onClick={() => {
                          
                            if (isCpuser) {
                                onExcelClick();
                            } else {
                                !isEmptyEntity(user) &&
                                    hasAccess &&
                                    isPlusSubscriber &&
                                    isExcelAllowed
                                    ? updateExcelDownloadCount(onExcelClick)
                                    : showErrorMessage(
                                        strings[
                                        analystPkgwithoutTrial
                                            ? "analystuserexcelerror"
                                            : "freeuserexcelerror"
                                        ]
                                    );
                            }
                        }}

                    >
                        {/* <img src={DownloadChart} alt="Download Chart 2" /> */}
                        <img src={downloadExcel} alt="Download Chart 2" />
                    </a>
                </li>
            )

        }
    }

    const generateNoteOpenButton = () => {
        if (isFullView == true) {
            return (
                <li className="my-2 my-lg-2">
                    <span className="tooltip">{strings.notesToolTip}</span>
                    <a className="d-block" onClick={onNotesClick}>
                        <img src={NotesIcon} alt="" className="img-fluid note-icon w-100" />
                    </a>
                </li>
            )
        } else {
            return (
                <li className="nav-item p-0 pull-left">
                    <span className="tooltip">{strings.notesToolTip}</span>
                    <a onClick={onNotesClick} className="">
                        <img src={NotesIcon} alt="Notes" />
                    </a>
                </li>
            )

        }
    }

    const generateImageDownloadButton = () => {

        if (isFullView == true) {
            return (

                <li className="my-2 my-lg-2">
                    <span className="tooltip">{strings.imageDownload}</span>
                    <a className="d-block"
                        onClick={() => {
                          
                            if (isCpuser) {
                                onImageClick();
                            } else {
                                !isEmptyEntity(user) &&
                                    hasAccess &&
                                    isPlusSubscriber &&
                                    isExcelAllowed
                                    ? updateExcelDownloadCount(onImageClick)
                                    : showErrorMessage(
                                        strings[
                                        analystPkgwithoutTrial
                                            ? "analystuserimageerror"
                                            : "freeuserimageerror"
                                        ]
                                    );
                            }
                        }}
                    >
                        <img src={calender_icon} alt="" className="img-fluid w-100" />
                    </a>
                </li>
            );
        } else {
            return (
                <>
                    <li className="nav-item p-0 pull-left" >
                        <span className="tooltip">{strings.imageDownload}</span>
                        <a 
                         className=""
                         onClick={() => {
                           
                            if (isCpuser) {
                                onImageClick();
                            } else {
                                !isEmptyEntity(user) &&
                                    hasAccess &&
                                    isPlusSubscriber &&
                                    isExcelAllowed
                                    ? updateExcelDownloadCount(onImageClick)
                                    : showErrorMessage(
                                        strings[
                                        analystPkgwithoutTrial
                                            ? "analystuserimageerror"
                                            : "freeuserimageerror"
                                        ]
                                    );
                            }
                        }}
                         >
                            {/* <img src={DownloadImage} alt="Download Chart 2" /> */}
                            <img src={downloadImage} alt="Download Chart 2" />
                        </a>
                    </li>
                </>

            );
        }

    }




    return [generateExcelExportButton, generateNoteOpenButton, generateImageDownloadButton];
}

export default useChartExportOptions;