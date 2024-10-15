
import OpenChart from "../../../assets/images/EN_img/OpenChart.png";
import DownloadChart from "../../../assets/images/EN_img/DownloadChart.png"

import { useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";
import { strings } from "@/constants/localizedStrings";
import { chartTypesConfig } from "@/services/config";
import useIsMobile from "@/hooks/useIsMobile";
import { getLocaleFromURL } from "@/Routes/routeHelper";
import { checkIfStringIsNotEmtpy } from "@/util/helper";
import { makeChartTitleLength, showChartTitleToolTip } from "@/helpers/chart/ChartCommonHelpers";
import MacroInfoIcon from "@/components/common/MacroInfoIcon";
import ChartChangeInPercentage from "./ChartChangeInPercentage";


function ChartWidgetHeader(props: any) {

    const {
        showsubtitle = false,
        title = "",
        subtitle = "",
        value = null,
        hasCloseIcon = true,
        percentage = null,
        currency = null,
        isFullView = false,
        chartId,
        chartInfoName,
        fiscalConfiguration,
        chartType,
        selectedFiscalYear
    } = props;


    const isDev = process.env.NODE_ENV == "development";
    let sub_title = showsubtitle && subtitle ? subtitle : strings.unitbillion;
    const parent_div_id_view = isFullView == true ? `parent_div_full_view_${chartId}` : `parent_div_normal_view_${chartId}`;

    const isChangeInPercentage = (fiscalConfiguration?.changePercentage != undefined && fiscalConfiguration?.changePercentage == 1)
        && (chartType != chartTypesConfig.PIE) ? true : false;

    const [tempTitle, setTempTitle] = useState('');
    const [tempSubTitle, setTempSubTitle] = useState('');
    const selectedLanguage = getLocaleFromURL();

    const isMobile = useIsMobile();
    const [hoveredTitle, setHoveredTitle] = useState(false);
    const [hoveredUnit, setHoveredUnit] = useState(false);
    const [allowHover, setAllowHover] = useState(false);



    const chartTitleLength = isMobile == true ? (selectedLanguage == "ar" ? 25 : 20) : (isFullView != undefined && isFullView == true ? 95 : 75);
    const chartMeasuringUnitLength = isMobile == true ? (selectedLanguage == "ar" ? 16 : 9) : 55;
    const titleAndUnit = title + (subtitle ?? "");
    const infoIconToCenter = (isMobile == true && (selectedLanguage == "ar" ? titleAndUnit.length < 15 : titleAndUnit.length < 16)) ? true : false;
    const otherClasses  = isMobile == false && titleAndUnit.length > 60 ? 'allow-center-desktop' : "";
    
    

    const createTempTitleSubTitle = () => {
        setTempTitle(title);
        setTempSubTitle(sub_title);
    }

    const handleMouseOver = (titleType: any) => {
        if (titleType == "title") {
            if (allowHover) {
                setHoveredTitle(true);
            }
        } else if (titleType == "unit") {
            if (allowHover) {
                setHoveredUnit(true);
            }
        } else {
            setHoveredTitle(false);
            setHoveredUnit(false);
        }
    };

    const handleMouseOut = (titleType: any) => {
        if (titleType == "title") {
            setHoveredTitle(false);
        } else if (titleType == "unit") {
            setHoveredUnit(false);
        } else {
            setHoveredTitle(false);
            setHoveredUnit(false);
        }

    };



    //--temp use Effect for creating title and sub title. We have to remove it later after 2023-08-24 demo
    useEffect(() => {
        createTempTitleSubTitle()
    }, [title]);


    useEffect(() => {
        const handleResizeForTitle = () => {

            // const parentDiv = parentDivRef?.current;
            // if (parentDiv) {
            //     const parentDivWidth = parentDiv.offsetWidth;

            //     const parentDiv2 = parentDivRef.current;
            //     const ellipsisElement = parentDiv.querySelector('.ellipsis-tooltip');

            //     if (parentDiv2 && ellipsisElement) {
            //         const isEllipsisApplied = ellipsisElement.scrollWidth > ellipsisElement.clientWidth;
            //         if (isEllipsisApplied) {
            //             setAllowHover(true);
            //         } else {
            //             console.log('Ellipsis is not applied.');
            //         }
            //     }
            // }



            const parentDiv = document.getElementById(parent_div_id_view);

            if (parentDiv) {

                const ellipsisElement: any = parentDiv.querySelector('.ellipsis-tooltip');

                if (ellipsisElement) {


                    const isEllipsisApplied = ellipsisElement.scrollWidth > ellipsisElement.clientWidth;

                    if (isEllipsisApplied) {
                        //--Decreaese the font size a little in case of ellipsis-tooltip
                        ellipsisElement.style.fontSize = '16px';
                        const isEllipsisAppliedAfterFontSize = (ellipsisElement.scrollWidth > ellipsisElement.clientWidth)// || ellipsisElement.scrollWidth == ellipsisElement.clientWidth;
                        if (isEllipsisAppliedAfterFontSize) {
                            setAllowHover(true); // Assuming setAllowHover is a function in your code
                        }

                    } else {

                        if (isDev) {
                            console.log('Ellipsis is not applied.');
                        }

                    }
                }
            }


        };

        handleResizeForTitle();

        // if (isFullView == true) {
        //     // Initial check on mount
        //     handleResizeForTitle();
        //     // Event listener for window resize
        //     // window.addEventListener('resize', handleResizeForTitle);
        //     // return () => {
        //     //     // Cleanup the event listener on component unmount
        //     //     window.removeEventListener('resize', handleResizeForTitle);
        //     // };
        // }



    }, [tempTitle, isFullView]);

    return (

        <>

            {

                isFullView != undefined && isFullView != null && isFullView == true
                    ?

                    <>

                        <h5 className="heading_text text_bold fs-4 fs-sm-6 m-0 head-d-flex">
                            <div className={`heading_ellipsis d-inline-block ${showChartTitleToolTip(tempTitle, chartTitleLength) == true ? 'tooltip_head' : ''}`} data-tooltip={tempTitle}>  {makeChartTitleLength(tempTitle, chartTitleLength)} </div>
                            <div>
                                <div className={`heading_gray unit_text text_semibold mx-2 mx-lg-2 text-nowrap  ${showChartTitleToolTip(tempSubTitle, chartMeasuringUnitLength) == true ? 'unit_tooltip' : ''}`} data-tooltip={tempSubTitle}>
                                    {
                                        checkIfStringIsNotEmtpy(tempSubTitle)
                                            ?
                                            `${makeChartTitleLength(tempSubTitle, chartMeasuringUnitLength)}`
                                            :
                                            ''
                                    }

                                </div>
                                <div className="hover_unit">
                                    {tempSubTitle}
                                </div>

                            </div>

                            {
                                chartInfoName && checkIfStringIsNotEmtpy(chartInfoName) == true
                                    ?
                                    <MacroInfoIcon
                                        infoName={chartInfoName}
                                    />
                                    :
                                    <></>
                            }

                        </h5>



                    </>
                    :

                    <div
                        className={`w-100 ${isChangeInPercentage ? 'exist-change-percent' : ''}`}
                    >
                        <div className="d-flex chart_head_dots">


                            <h3 className="heading_text text_bold fs-4 fs-sm-6 m-0 head-d-flex parent_div-tip"  id={parent_div_id_view} >
                                <div
                                    onMouseOver={() => handleMouseOver("title")} onMouseOut={() => handleMouseOut("title")}
                                    className={`heading_ellipsis ellipsis-tooltip`}
                                    data-tooltip={tempTitle}
                                >
                                    {tempTitle}
                                </div>


                                {
                                    //--If length is greater than 5 then apply ellipsis logic on unit, other wise enslode spane in div like in if condition so that no ellipsis showing with unit
                                    tempSubTitle && tempSubTitle.length > 10 ? (
                                        <span

                                            onMouseOver={() => handleMouseOver("unit")} onMouseOut={() => handleMouseOut("unit")}
                                            className="heading_gray unit_text text_semibold mx-2 mx-lg-2 ellipsis-tooltip-unit">

                                            <div className={`tool_tip_chart tool-tip-right ${hoveredUnit ? 'tooltip_active' : 'tooltip_in_active'}`}> {tempSubTitle}
                                            </div>

                                            {tempSubTitle}
                                        </span>
                                    ) : (
                                        <div>
                                            <span
                                                className="heading_gray unit_text text_semibold mx-2 mx-lg-2 ellipsis-tooltip-unit">
                                                {tempSubTitle}
                                            </span>
                                        </div>

                                    )
                                }



                            </h3>

                            {
                                chartInfoName && checkIfStringIsNotEmtpy(chartInfoName) == true
                                    ?
                                    <MacroInfoIcon
                                        infoName={chartInfoName}
                                        allowLeftTooltip = {allowHover == true ? true : false}
                                        infoIconToCenter = {infoIconToCenter}
                                        otherClasses ={otherClasses}
                                    />
                                    :
                                    <></>
                            }

                        </div>

                        <div className={`tool_tip_chart ${hoveredTitle ? 'tooltip_active' : 'tooltip_in_active'}`}> {tempTitle}
                        </div>

                        {
                            isChangeInPercentage == true
                                ?
                                <ChartChangeInPercentage
                                    changePercentageFieldId={fiscalConfiguration?.changePercentageFieldId}
                                    selectedFiscalYear={selectedFiscalYear}
                                />
                                :
                                <>
                                </>
                        }




                    </div>




            }
        </>





    );
}

export default ChartWidgetHeader;
