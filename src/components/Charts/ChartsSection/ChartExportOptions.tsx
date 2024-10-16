import React from 'react';
import { useSelector } from 'react-redux';
import Embed_icon from "../../../assets/images/EN_img/Embed_icon.svg";
import OpenChart from "../../../assets/images/EN_img/OpenChart.svg";
import Share_icon from "../../../assets/images/EN_img/Share_icon.svg";
import { strings } from '@/constants/localizedStrings';
import useChartExportOptions from '@/hooks/useChartExportOptions';
import { showErrorMessage } from '@/helpers/common/ValidationHelper';
import Image from 'next/image';


export  function ChartExportOptions(
    {
        onFullScreen,
        onShare,
        onNotesClick,
        showNotes,
        onImageClick,
        onExcelClick,

        toolsOption,

        onCustomEmbed,
        isFullView = null,



        ...props
    }: any
) {

    const loginUser = useSelector((state: any) => state.user.user);
    const isCpuser = loginUser?.CpUser === "true";
    const hasAccess = loginUser?.HasMacroChartsAccess === "true";
    const isonTrial = loginUser?.isMacroOnFreeTrail !== "False";

    const isPlusSubscriber = loginUser?.IsArgaamSubscriber == "true";
    const analystPkgwithoutTrial = isPlusSubscriber && !isonTrial;



    const [generateExcelExportButton, generateNoteOpenButton, generateImageDownloadButton] = useChartExportOptions({
        isFullView: isFullView,
        onNotesClick: onNotesClick,
        onExcelClick: onExcelClick,
        onImageClick: onImageClick
    });

    return (

        <>
            {
                isFullView == true
                    ?
                    <ul className="d-flex justify-content-center flex-column-reverse align-items-center mb-0 mb-lg-0 p-0 list-unstyled tooltip-container">

                        {toolsOption?.fullView && (
                            <li className="mx-2 mx-lg-1">
                                <span className="tooltip">Full View</span>
                                <a className="d-block" onClick={onFullScreen}>
                                    {/* <img src={image_icon} alt="" className=" w-100" /> */}
                                </a>
                            </li>
                        )}


                        {
                            toolsOption?.note != undefined && toolsOption?.note == true && isCpuser == true
                                ?

                                generateNoteOpenButton()
                                :
                                <>
                                </>
                        }

                        {(toolsOption?.copyEmbed && isCpuser == true) && (

                            <li className="my-2 my-lg-2">
                                <span className="tooltip">{strings.customEmbed}</span>
                                <a className="d-block" onClick={onCustomEmbed}>
                                    <Image src={Embed_icon} alt="" className="img-fluid w-100" />
                                </a>
                            </li>

                        )}



                        {
                        (toolsOption?.share || (isCpuser == true)) && (
                            <li className="my-2 my-lg-2">
                                <span className="tooltip">{strings.share}</span>
                                <a className="d-block"

                                    onClick={
                                        (hasAccess && isPlusSubscriber) || isCpuser
                                            ? onShare
                                            : () =>
                                                showErrorMessage(
                                                    strings[
                                                    analystPkgwithoutTrial
                                                        ? "analystusershareerror"
                                                        : "freeusershareerror"
                                                    ]
                                                )
                                    }

                                >
                                    <Image src={Share_icon} alt="" className="img-fluid w-100" />
                                </a>
                            </li>
                        )}

                        {toolsOption?.imgDownload && (
                            generateImageDownloadButton()
                        )}


                        {toolsOption?.excelDonwload && (
                            generateExcelExportButton()
                        )}


                    </ul>
                    :
                    <div className="d-flex align-items-start align-items-lg-center justify-content-end">
                        <ul className="navbar-nav flex-row-reverse align-items-center chart_btns">
                            {toolsOption?.fullView &&
                                <li className="nav-item p-0 pull-left">
                                    <span className="tooltip">{strings.fullView}</span>
                                    <a onClick={onFullScreen} className="open-button">
                                        {/* <img src={OpenChart} alt="Open Chart" /> */}
                                        <img src="https://argaamplus.s3.eu-west-1.amazonaws.com/OpenChart-55b1c88a.svg" alt="Open Chart" />
                                    </a>
                                </li>
                            }


                            {toolsOption?.imgDownload && (
                                generateImageDownloadButton()
                            )}


                            {toolsOption?.excelDonwload &&
                                generateExcelExportButton()
                            }






                            {
                                toolsOption?.note != undefined && toolsOption?.note == true && loginUser?.CpUser == 'true'
                                    ?
                                    generateNoteOpenButton()
                                    :
                                    <>
                                    </>
                            }



                        </ul>
                    </div>
            }


        </>
    )
}

//const ChartExportOptions = React.memo(ChartExportOptionsInternal);


export default ChartExportOptions;