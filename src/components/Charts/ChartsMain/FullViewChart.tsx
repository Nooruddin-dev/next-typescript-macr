"use client"
import React, { useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";

import close_icon from "../../../assets/images/EN_img/close_icon.svg";
import useIsMobile from "@/hooks/useIsMobile";
import { getLocaleFromURL } from "@/Routes/routeHelper";
import { fiscals } from "@/util/fiscals";
import useFiscalFilter from "@/hooks/useFiscalFilter";
import useChartDataGrowthTabs from "@/hooks/useChartDataGrowthTabs";
import useChartCompare from "@/hooks/useChartCompare";
import { getChartType, isBrowserWindow } from "@/helpers/common/GlobalHelper";
import { createChartFromYear, createChartTitleForImageDownload, createChartToYear, generateFiscalPeriodIdForPie, separateSourcesByLanguage } from "@/helpers/chart/ChartCommonHelpers";
import { ARGAAM_SHORTENER_URL, CHARTS_EXCEL_URL, CHARTS_URL, chartToolOptionsKeys, chartTypesConfig } from "@/services/config";
import { showErrorMessage, showSuccessMessage } from "@/helpers/common/ValidationHelper";
import { strings } from "@/constants/localizedStrings";
import ChartExportOptions from "../ChartsSection/ChartExportOptions";
import ChartSource from "../ChartsSection/ChartSource";
import UserCodeChart from "@/components/common/UserCodeChart";
import CustomEmbed from "../ChartsSection/CustomEmbed";
import ChartChangeInPercentage from "../ChartsSection/ChartChangeInPercentage";
import ChartWidgetHeader from "../ChartsSection/RatioWidgetHeader";
import { ChartDownloadModal } from "../ChartsSection/ChartDownloadModal";
import { generateShortUrlApi } from "@/helpers/apiService";
import Image from "next/image";




export default function FullViewChart({
    isOpen,
    onRequestClose,
    children,
    section,
    api,
    gsid,
    bsid,
    fsfieldid,
    hideData,
    dataApi,
    onClose,
    hideComparision,
    title,
    subtitle,
    sectionTitle,
    charttooltipIcon,
    pageTitle,
    selectedYear,
    selectedPeriod,
    selectedGrowth,
    otherFiscalConfig,
    pieChartYearsList,
    selectedCompareFieldIdsInput,
    extraData,
    isPieChart,
    selectedtab,
    lastAttrData,
    className,
    hideDefaultTabs,
    configuration,
    ...props
}: any) {

    const isMobile = useIsMobile();
    const selectedLanguage = getLocaleFromURL();

    const [customEmbedModal, setCustomEmbedModal] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [showChartImgDownloadModal, setShowChartImgDownloadModal] = useState(false);
    const [renderKey, setrenderKey] = useState(0);
    const loginUser = useSelector((state: any) => state.user.user);


    let mainclass = 'col col-lg-4 my-lg-0 mb-lg-0 item popup_view';


    const localConfig = { ...configuration };
    if (localConfig != undefined) {
        if (localConfig?.fiscalYears) {
            localConfig.fiscalYears.IsSelected = selectedYear?.Value ?? 1;
        }
        if (localConfig?.fiscalPeriods) {
            localConfig.fiscalPeriods.IsSelected = selectedPeriod?.Value ?? 1;
        }
        if (localConfig?.dataFilters) {
            localConfig.dataFilters.IsSelected = selectedGrowth?.Value ?? 1;
        }
    }

    const toolsOptions = JSON.parse(section?.toolsOptions ?? '{}');


    let fiscalConfiguration = {
        chartType: section?.chartType,
        isFullView: true,
        fullViewSelectedPieChartYear: otherFiscalConfig?.selectedPieChartYear?.value,
        changePercentage: localConfig?.economicIndicatorField?.placeholders?.changePercentage,
        changePercentageFieldId: localConfig?.economicIndicatorField?.placeholders?.fieldIDs,

        pieChartData: {
            pieChartYearsList: pieChartYearsList,
            pieDefaultQuarterValue: otherFiscalConfig?.selectedFiscalPeriodId?.value ? otherFiscalConfig?.selectedFiscalPeriodId : fiscals.allFiscalPeriods.find(x => x.value == 2), //--2 is Q-1
            pieDefaultMonthValue: otherFiscalConfig?.selectedFiscalPeriodId?.value ? otherFiscalConfig?.selectedFiscalPeriodId : fiscals.allFiscalPeriods.find(x => x.value == 58), //--58 is Q-1
        }

    }
    const { render, selectedFiscalPeriod, selectedFiscalYear, selectedOthereFiscalData } = useFiscalFilter((localConfig?.fiscalYears), localConfig?.fiscalPeriods, fiscalConfiguration)

    const { chartDataGrowthHtml, selectedGrowthButton } = useChartDataGrowthTabs(localConfig?.dataFilters, fiscalConfiguration);
    const isDataGrowthChart = localConfig?.dataFilters != undefined && localConfig?.dataFilters?.tabs != undefined && selectedGrowthButton != undefined ? true : false;



    let compareConfiguration = {
        chartType: section?.chartType,
        showTitle: false,
        defaultComparable: localConfig?.defaultComparable ?? false
    }
    const { renderChartCompare, selectedCompareField, selectedCompareFieldIds, selectedOtherCompareData } = useChartCompare(localConfig?.comparableFields, configuration?.economicIndicatorField?.economicIndicatorFieldID, selectedCompareFieldIdsInput ?? [], compareConfiguration);

    const chartType = getChartType(configuration, section?.chartType, selectedCompareFieldIds, isDataGrowthChart);


    const apiSourceType = configuration?.economicIndicatorField?.apiSrc;
    const urlPlaceholdersKeys = configuration?.economicIndicatorField?.placeholders ?? {};

    if (props?.urlconfig != undefined) {
        props.urlconfig.toYear = createChartToYear(chartType, props?.urlconfig?.toYear, selectedOthereFiscalData?.selectedPieChartYear?.value);
    }

    let fromYear = createChartFromYear(chartType, selectedFiscalYear, selectedOthereFiscalData?.selectedPieChartYear?.value);

    const chartUniqueCode = section?.uniqueCode ?? '';



    const params = {
        ...props.urlconfig,
        ...(urlPlaceholdersKeys && Object.keys(urlPlaceholdersKeys)?.length > 0 ? urlPlaceholdersKeys : {}),
        ticon: charttooltipIcon,
        indicatorFieldID:
            selectedCompareFieldIds != undefined && selectedCompareFieldIds.length > 0
                ? [
                    configuration?.economicIndicatorField?.economicIndicatorFieldID ?? 0,
                    ...selectedCompareFieldIds,
                ].join(',')
                : configuration?.economicIndicatorField?.economicIndicatorFieldID,

        ...(fromYear !== undefined && fromYear != "" ? { fromYear: fromYear } : ""),
        ...(props?.urlconfig?.toYear !== undefined ? { foryear: props.urlconfig.toYear } : 0),
        ...(selectedFiscalPeriod?.Value !== undefined ? { fiscalPeriodTypeID: selectedFiscalPeriod?.Value ?? 0 } : 0),
        uid: chartUniqueCode,

        userUniqueCode: loginUser?.CpUser == "true" ? '' : (loginUser?.UserCode ?? ''),
        isfullview: 1,
        ismobile: isMobile ? "1" : "0",
        tct: chartType,
        fiscalPeriodId: generateFiscalPeriodIdForPie(selectedOthereFiscalData?.selectedFiscalPeriodId, chartType),
        type: (selectedGrowthButton?.Value != undefined && selectedGrowthButton?.Value != null && configuration?.dataFilters ? selectedGrowthButton?.key : "data"),
        chartId: section?.chartId,
        m: 1, //--m: 1. This key required for notes on chart engine side
    };

    const urlWithParams = new URLSearchParams(params).toString();
    const finalUrl = `${CHARTS_URL}${apiSourceType}?${urlWithParams}`;
    const excelchartUrl = `${CHARTS_EXCEL_URL}${apiSourceType}?${urlWithParams}&title=${selectedLanguage == 'ar' ? title + ' ' + (subtitle ?? '') : title + ' ' + subtitle}&pageTitle=${pageTitle}&sectionTitle=${sectionTitle}`;




    //--modify MainClass
    if (selectedOthereFiscalData == undefined || (selectedOthereFiscalData?.apiYears == undefined || selectedOthereFiscalData?.apiYears.length === 0)
        && (selectedOthereFiscalData?.apiPeriods == undefined || selectedOthereFiscalData?.apiPeriods.length === 0)) {
        mainclass = mainclass + " no-fiscal";
    }

    if (selectedOtherCompareData == undefined || selectedOtherCompareData?.showCompare == undefined || selectedOtherCompareData?.showCompare == false) {
        mainclass = mainclass + " no-compare";
    }


    if (configuration?.economicIndicatorField?.placeholders?.hLgnd && configuration?.economicIndicatorField?.placeholders?.hLgnd == '1') {
        mainclass = mainclass + " chart-html-lgnds";
    }


    const chartMultipleSources = JSON.parse(section?.multipleSources ?? '[]');
    const { englishSources, arabicSources } = separateSourcesByLanguage(chartMultipleSources);
    const sourcesToDisplay = selectedLanguage == "ar" ? arabicSources : englishSources;

    if (sourcesToDisplay && sourcesToDisplay.length > 0) {

        mainclass += " exist-chart-source";
        // let isExistNewLineAr = checkIfNewLineCharactersExistInString(section?.sourceAr);
        // let isExistNewLineEn = checkIfNewLineCharactersExistInString(section?.sourceEn);
        // if ((selectedLanguage == 'ar' && isExistNewLineAr == true) || (selectedLanguage == 'en' && isExistNewLineEn == true)) {
        //     mainclass += " source-multiple-lines";
        // }
    }

    const reloadChartIframe = () => {

        setrenderKey((prevCount) => prevCount + 1);
    }



    const handleCopyToClipboard = (shareurl: any) => {
        // if (checkIfStringIsNotEmtpy(shareurl) == true) {
        //   parent.navigator.clipboard
        //     .writeText(shareurl)
        //     .then(() => {
        //      showSuccess(strings.copyLinkAlertText);
        //     })
        //     .catch((error) => {
        //       console.error('Error copying text to clipboard:', error);
        //     });
        // } else {
        //     showErrorMessage('Link not ready. Please try again');
        // }

        navigator.clipboard
            // .writeText(shortnedUrl)
            .writeText(shareurl)
            .then(() => {

                showSuccessMessage(strings.copyLinkAlertText);
            })
            .catch((error) => {
                showErrorMessage('An error occured! Please try again!');
                console.error("Error copying text to clipboard:", error);
            });

    }

    const generateShortUrl = (shareurl: any, errorCallback: any) => {
        generateShortUrlApi(shareurl)
            .then((res: any) => {

                const { data } = res;

                if (data?.ShortURL) {
                    let finalShareUrl = data?.ShortURL;
                    let apiUrl = ARGAAM_SHORTENER_URL;
                    if (apiUrl == "https://urls.edanat.com//get-short-url") {
                        finalShareUrl = finalShareUrl?.replace(":17019", "")?.replace("http://", "https://"); //--This is in case of QA as per Sheryar instructions.
                    }
                    handleCopyToClipboard(finalShareUrl);
                } else {
                    handleCopyToClipboard(shareurl);
                }

            })
            .catch((error: any) => {
                console.error('Error copying text to clipboard:', error);
                errorCallback()
            });
    }

    const hanldeShareLink = async () => {
        const urlWithParamsForShare = new URLSearchParams({
            ...params,
            chartType: chartType,
            isfullview: 1,
            selectedFiscalYear: selectedFiscalYear?.Value ?? 1,
            selectedFiscalPeriod: selectedFiscalPeriod?.Value ?? 1,

        }).toString();
        let baseurl = "";
        if(isBrowserWindow()){
           baseurl = window.location.origin + '/';
        }
     
        const shareurl = `${baseurl}ChartView?${urlWithParamsForShare}`;

        generateShortUrl(shareurl, () => handleCopyToClipboard(shareurl));

        // const isDev = process.env.NODE_ENV == "development";
        // if (isDev) {
        //   // alert("yes");
        //   copylink(shareurl);
        // } else {
        //   if (isEmpty(shortnedUrl)) {
        //     generateShortUrl(shareurl, () => copylink(shareurl));
        //   } else {
        //     copylink(shortnedUrl);
        //   }
        // }

    };


    const customImageSetting =  { height: "600px", width: "1000px" };
    const finalUrlImage = `${finalUrl}&image=1&title=${createChartTitleForImageDownload(title ?? "chart data", subtitle)} 
         &ucode=${loginUser?.UserCode ?? ''}&isfullview=1`;

    const handleDownloadImage = () => {
        setShowChartImgDownloadModal(true);
    }



    return (
        <Modal
            isOpen={isOpen}
            className={`${selectedLanguage == "ar" ? "dir_rtl zoom_view" : "dir_ltr zoom_view"} ${isPieChart ? "isPieChart" : ""
                } ${className ?? ""}`}
            onRequestClose={onRequestClose}
            style={{
                content: {
                    zIndex: 99999,
                    position: 'relative',

                },
            }}
        >

            {/* {customEmbedModal ? (
                <CustomEmbedCopyModal
                    isOpen={customEmbedModal}
                    onRequestClose={() => setCustomEmbedModal(false)}
                    configuration={configuration}
                    selectedYear={selectedFiscalYear}
                    selectedPeriod={selectedFiscalPeriod}
                    title={title}
                    params={params}
                    copyLinkConfig={{
                        apiSourceType: apiSourceType,
                        chartType: chartType,
                        chartId: section?.chartId,
                        indicatorFieldID: params?.indicatorFieldID
                    }}

                />
            ) : null} */}


            {/* {
                showNotesModal != undefined && showNotesModal == true
                    ?
                    <>
                        <ChartNotesModal
                            isOpen={showNotesModal}
                            mainTitle={'main title'}
                            tableTitle={title}
                            chartId={section?.chartId}
                            selectedYear={selectedFiscalYear}
                            selectedPeriod={selectedFiscalPeriod}

                            onNotsModalRequestClose={() => setShowNotesModal(false)}
                            reloadChartIframe={reloadChartIframe}
                            finalUrl={finalUrl}
                        />

                    </>
                    :
                    <>
                    </>
            } */}


            {showChartImgDownloadModal == true && (

                <ChartDownloadModal
                    visible={showChartImgDownloadModal}
                    finalUrl={finalUrlImage}
                    customSetting={customImageSetting}
                    onRequestClose={() => setShowChartImgDownloadModal(false)}
                />


            )}


            <div className="row">
                <div className={mainclass} >
                    <div className="p-0 home_inner_shadow">
                        <div className="w-100 d-flex justify-content-between mt-0 mb-lg-0 mb-0 chart_view_header">
                            <div className="d-flex align-items-center full_view_head">
                                <ChartWidgetHeader
                                    title={title}
                                    subtitle={subtitle ?? ""}
                                    hasCloseIcon={false}
                                    showsubtitle={true}
                                    isFullView={true}
                                    chartId={section?.chartId}
                                    chartInfoName={selectedLanguage == "ar" ? section?.infoNameAr : section?.infoNameEn}


                                />
                                <span className="category_head mb-1">
                                    ({sectionTitle})
                                    <div className="w-lg-100 head_bottom_b mt-2 d-none">
                                        <span></span>
                                        <span></span>
                                    </div>
                                </span>
                            </div>
                            <div className='fullview_close pt-1'>
                                <div className="d-flex align-items-start align-items-lg-center">


                                    <a className="open_widget ms-0 ms-lg-0" onClick={onClose}>
                                        <Image src={close_icon} alt="" className="w-35" />
                                    </a>
                                </div>
                            </div>
                        </div>


                        <div className="p-1  p-d-rl firefox_zoom">
                            <div className="d-flex justify-content-between align-lg-items-center mt-0 mt-lg-0">

                            </div>
                            <div className="d-flex align-items-center col-12 chart_widget my-0 mt-lg-0 mb-lg-0">
                                <div className="w-100 screen-min-h">


                                    <div className="d-flex justify-content-between flex-lg-row flex-column align-items-end">
                                        <div className="d-flex align-items-start flex-column mb-3 fv_period_widget">

                                            {!hideDefaultTabs && (

                                                render()
                                            )}


                                        </div>
                                        <div className="d-flex flex-column">
                                            {
                                                (fiscalConfiguration?.changePercentage != undefined && fiscalConfiguration?.changePercentage == 1)
                                                    && (chartType != chartTypesConfig.PIE)
                                                    ?
                                                    <ChartChangeInPercentage
                                                        changePercentageFieldId={fiscalConfiguration?.changePercentageFieldId}
                                                        selectedFiscalYear={selectedFiscalYear}
                                                    />
                                                    :
                                                    <>
                                                    </>
                                            }

                                            {localConfig?.dataFilters != undefined ? chartDataGrowthHtml() : null}
                                        </div>


                                    </div>
                                    <div className="d-flex align-items-cente">
                                        <div className="my-0 d-flex flex-column position-relative w-95 modal_chart_v">
                                            {props?.child !== undefined ? props.child :
                                                <>
                                                    <CustomEmbed
                                                        key={renderKey}
                                                        src={finalUrl}
                                                        className={"fullviewChart"}
                                                        embedActiveClass={"activeclas"}
                                                        embedInActiveClass={"inactiveclass"}
                                                    />

                                                    {/* 
                                                    {downloadRender()} */}
                                                </>

                                            }

                                            <div className="d-flex justify-content-end bottom_widget">
                                                <ChartSource
                                                    isfullView={true}
                                                    sourcesToDisplay={sourcesToDisplay}
                                                />
                                                <div>
                                                    <UserCodeChart className={'userCode1'} />
                                                </div>
                                            </div>




                                        </div>

                                        <div className="d-flex align-items-start flex-row w-5 mt-0 modal_chart_btns">
                                            <ChartExportOptions
                                                hideFullView
                                                //onShare={() => setshowLinkModal(true)}
                                                onShare={() => hanldeShareLink()}
                                                onCustomEmbed={() => setCustomEmbedModal(true)}
                                                onImageClick={() =>
                                                    //window.open(`${finalUrl}&ext=png&title=${title}`)
                                                    // downloadImg()
                                                    handleDownloadImage()
                                                }
                                                onExcelClick={() => {

                                                    //window.open(`${finalUrl.replace('/charts/', '/downloads/')}&title=${title}`);
                                                    window.open(excelchartUrl);
                                                }}
                                                onNotesClick={() => setShowNotesModal(true)}
                                                showNotes={chartType == chartTypesConfig?.PIE ? false : true}
                                                hideCustomEmbed={chartType == chartTypesConfig?.PIE ? true : false}
                                                isFullView={true}

                                                toolsOption={
                                                    section?.dataSource == 10 //-- hide tools tips for dataSource of market and trading data ranking charts
                                                        ?
                                                        {

                                                            excelDonwload: false,
                                                            imgDownload: false,
                                                            share: false,
                                                            fullView: false,
                                                            note: false,
                                                            copyEmbed: false,
                                                        }
                                                        :
                                                        {

                                                            excelDonwload: (toolsOptions?.ToolsOptions?.filter((x: { option: any; isVisible: boolean; }) => x.option == chartToolOptionsKeys.EXCEL_DOWNLOAD && x.isVisible == true)?.length > 0 ? true : false),
                                                            imgDownload: (toolsOptions?.ToolsOptions?.filter((x: { option: any; isVisible: boolean; }) => x.option == chartToolOptionsKeys.IMG_DOWNLOAD && x.isVisible == true)?.length > 0 ? true : false),
                                                            share: (toolsOptions?.ToolsOptions?.filter((x: { option: any; isVisible: boolean; }) => x.option == chartToolOptionsKeys.SHARE && x.isVisible == true)?.length > 0 ? true : false),
                                                            fullView: false,
                                                            note: (toolsOptions?.ToolsOptions?.filter((x: { option: any; isVisible: boolean; }) => x.option == chartToolOptionsKeys.NOTE && x.isVisible == true)?.length > 0 ? true : false),
                                                            copyEmbed: (toolsOptions?.ToolsOptions?.filter((x: { option: any; isVisible: boolean; }) => x.option == chartToolOptionsKeys.COPY_EMBED && x.isVisible == true)?.length > 0 ? true : false),
                                                        }
                                                }
                                            />

                                        </div>
                                    </div>

                                    {/* <div className="d-flex align-items-center col-12 fullview_compare">
                                        {renderChartCompare()}
                                    </div> */}
                                </div>

                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
