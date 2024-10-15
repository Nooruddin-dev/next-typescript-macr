"use client"
import SiteLoader from "@/components/common/SiteLoader";
import { getNotesLabelsData } from "@/helpers/apiService";
import { createChartFromYear, createChartTitleForImageDownload, createChartToYear, generateFiscalPeriodIdForPie, separateSourcesByLanguage } from "@/helpers/chart/ChartCommonHelpers";
import { getChartType } from "@/helpers/common/GlobalHelper";
import useChartCompare from "@/hooks/useChartCompare";
import useChartDataGrowthTabs from "@/hooks/useChartDataGrowthTabs";
import useFiscalFilter from "@/hooks/useFiscalFilter";
import useIsMobile from "@/hooks/useIsMobile";
import { getLocaleFromURL } from "@/Routes/routeHelper";
import { CHARTS_EXCEL_URL, CHARTS_URL, chartToolOptionsKeys, chartTypesConfig } from "@/services/config";
import { fiscals } from "@/util/fiscals";
import { checkIfStringIsNotEmtpy } from "@/util/helper";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChartWidgetHeader from "../ChartsSection/RatioWidgetHeader";
import ChartExportOptions from "../ChartsSection/ChartExportOptions";
import CustomEmbed from "../ChartsSection/CustomEmbed";
import UserCodeChart from "@/components/common/UserCodeChart";
import ChartSource from "../ChartsSection/ChartSource";


export default function Charts(props: any) {
  const dispatch = useDispatch();
  const selectedLanguage = getLocaleFromURL()
  const loginUser = useSelector((state: any) => state.user.user);

  const [showModal, setshowModal] = useState(false);
  const [showLinkModal, setshowLinkModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showChartImgDownloadModal, setShowChartImgDownloadModal] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [renderKey, setrenderKey] = useState(0);
  const isMobile = useIsMobile();

  const [pieChartYearsList, setPieChartYearsList] = useState<any>([]);

  const {
    titleEn = "",
    titleAr = "",
    subtitle = "",
    subclass = "d-flex flex-column py-4 custom_px_4 drop_shadow_min border bg-white position-relative",
    fsId,
    attrId,
    hideData = false,
    hasComparision = true,
    api,
    isBussinessSegment,
    section,
    sectionId,
    urlconfig,
    dataApi,
    sectionTitle,
    charttooltipIcon,
    pageTitle,
    chartMainClass,
    isArgaamEmbed
  } = props;


  let mainclass = !checkIfStringIsNotEmtpy(chartMainClass)
    ? "col-12 col-lg-6 chart_mar_b p-dir"
    : chartMainClass;

  const configuration = JSON.parse(
    section?.configuration == undefined ? "{}" : section?.configuration
  );

  //   show chart in full width of div
  const fullWidthChart = configuration?.economicIndicatorField?.fullWidthChart;
  if (fullWidthChart && fullWidthChart == "1") {
    mainclass = "col-12 col-lg-12 chart_mar_b"
  }


  const toolsOptions = JSON.parse(section?.toolsOptions ?? '{}');

  //   >>  Hooks area starts here
  let fiscalConfiguration = useMemo(() => ({
    chartType: section?.chartType,
    isFullView: false,
    changePercentage: configuration?.economicIndicatorField?.placeholders?.changePercentage,
    changePercentageFieldId: configuration?.economicIndicatorField?.placeholders?.fieldIDs,
    pieChartData: {
      pieChartYearsList: pieChartYearsList,
      pieDefaultQuarterValue: fiscals.allFiscalPeriods.find(x => x.value == 2), //--2 is Q-1
      pieDefaultMonthValue: fiscals.allFiscalPeriods.find(x => x.value == 58), //--58 is Jan
    }
  }), [configuration, pieChartYearsList, section?.chartId]);


  const {
    render, selectedFiscalPeriod, selectedFiscalYear, selectedOthereFiscalData,
  } = useFiscalFilter(
    configuration?.fiscalYears, configuration?.fiscalPeriods, fiscalConfiguration
  );

  const { chartDataGrowthHtml, selectedGrowthButton } = useChartDataGrowthTabs(configuration?.dataFilters, fiscalConfiguration);
  const isDataGrowthChart = configuration?.dataFilters != undefined && configuration?.dataFilters?.tabs != undefined && selectedGrowthButton != undefined ? true : false;


  const compareConfiguration = useMemo(() => ({
    chartType: section?.chartType,
    showTitle: true,
    defaultComparable: configuration?.defaultComparable || false,
  }), [configuration, section?.chartId]);


  const {
    renderChartCompare,
    selectedCompareField,
    selectedCompareFieldIds,
    selectedOtherCompareData,
  } = useChartCompare(
    configuration?.comparableFields,
    configuration?.economicIndicatorField?.economicIndicatorFieldID,
    [],
    compareConfiguration
  );
  //   <<  Hooks area ends here


  const chartType = useMemo(() => getChartType(
    configuration,
    section?.chartType,
    selectedCompareFieldIds,
    isDataGrowthChart
  ), [configuration, section?.chartType, selectedCompareFieldIds, isDataGrowthChart, section?.chartId]);


  var apiSourceType = configuration?.economicIndicatorField?.apiSrc;
  const urlPlaceholdersKeys =
    configuration?.economicIndicatorField?.placeholders ?? {};

  if (urlconfig != undefined) {
    urlconfig.toYear = createChartToYear(
      chartType,
      urlconfig?.toYear,
      selectedOthereFiscalData?.selectedPieChartYear?.value
    );
  }


  let fromYear = createChartFromYear(
    chartType,
    selectedFiscalYear,
    selectedOthereFiscalData?.selectedPieChartYear?.value
  );


  const chartUniqueCode = section?.uniqueCode ?? '';

  const fiscalPeriodId = useMemo(
    () => generateFiscalPeriodIdForPie(selectedOthereFiscalData?.selectedFiscalPeriodId, chartType),
    [selectedOthereFiscalData?.selectedFiscalPeriodId, chartType]
  );
  const params = {
    ...urlconfig,
    ...(urlPlaceholdersKeys && Object.keys(urlPlaceholdersKeys)?.length > 0
      ? urlPlaceholdersKeys
      : {}),
    //ticon: charttooltipIcon,
    indicatorFieldID:
      selectedCompareFieldIds != undefined && selectedCompareFieldIds.length > 0
        ? [
          configuration?.economicIndicatorField?.economicIndicatorFieldID ??
          "0",
          ...selectedCompareFieldIds,
        ].join(",")
        : configuration?.economicIndicatorField?.economicIndicatorFieldID,

    uid: chartUniqueCode,
    ismobile: isMobile ? "1" : "0",
    tct: chartType,

    ...(fromYear != undefined && fromYear != "" ? { fromYear: fromYear } : ""),
    ...(selectedFiscalPeriod?.Value !== undefined
      ? { fiscalPeriodTypeID: selectedFiscalPeriod?.Value }
      : 0),

    fiscalPeriodId: fiscalPeriodId,
    type: (selectedGrowthButton?.Value != undefined && selectedGrowthButton?.Value != null && configuration?.dataFilters ? selectedGrowthButton?.key : "data"),
    chartId: section?.chartId,
    m: 1, //--m: 1. This key required for notes on chart engine side
  };


  const isTrading = configuration?.dataSource == "trading";

  const urlWithParams = new URLSearchParams(params).toString();
  apiSourceType =
    apiSourceType == undefined || apiSourceType == null
      ? "economic-indicator-data"
      : apiSourceType;

  const finalUrl: any = `${CHARTS_URL}${apiSourceType}?${urlWithParams}`;

  const chartUrl: any = `${CHARTS_URL}${apiSourceType}?${fsId || isBussinessSegment ? "companyid" : "companyids"
    }=${1}`;

  const excelchartUrl: any = `${CHARTS_EXCEL_URL}${apiSourceType}?${urlWithParams}&title=${(selectedLanguage == 'ar' ? (titleAr + ' ' + (subtitle ?? '')) : (titleEn + ' ' + (subtitle ?? '')))}&pageTitle=${pageTitle}&sectionTitle=${sectionTitle}`;


  //--modify MainClass
  if (
    selectedOthereFiscalData == undefined ||
    ((selectedOthereFiscalData?.apiYears == undefined ||
      selectedOthereFiscalData?.apiYears.length === 0) &&
      (selectedOthereFiscalData?.apiPeriods == undefined ||
        selectedOthereFiscalData?.apiPeriods.length === 0))
  ) {
    mainclass = mainclass + " no-fiscal";
  }

  if (
    (selectedOthereFiscalData?.apiPeriods == undefined ||
      selectedOthereFiscalData?.apiPeriods.length === 0)
  ) {
    mainclass = mainclass + " no-period-tab";
  }

  if (
    (selectedOthereFiscalData?.apiPeriods == undefined ||
      selectedOthereFiscalData?.apiPeriods.length === 0)
  ) {
    mainclass = mainclass + " no-period-tab";
  }
  if (
    (configuration?.dataFilters == undefined || configuration?.dataFilters == undefined || configuration?.dataFilters.length == 0)
  ) {
    mainclass = mainclass + " no-data-growth-tab";
  }

  if (
    selectedOtherCompareData == undefined ||
    selectedOtherCompareData?.showCompare == undefined ||
    selectedOtherCompareData?.showCompare == false
  ) {
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

  }

  const reloadChartIframe = () => {
    //setrenderKey(renderKey);
    setrenderKey((prevCount) => prevCount + 1);
  }

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    }
    if (!showModal) {
      document.body.style.overflow = "unset";
    }
  }, [showModal]);

  useEffect(() => {
    if (chartType == chartTypesConfig.PIE && (pieChartYearsList?.length == undefined || pieChartYearsList?.length == 0)) {
      generatePieChartYears();
    }
  }, [finalUrl]);

  const generatePieChartYears = () => {
    if (checkIfStringIsNotEmtpy(finalUrl)) {
      let finalUrlPieApi = "";
      try {
        var urlObject = new URL(finalUrl);

        // Check if fromYear exists, then update it
        if (urlObject) {
          urlObject.searchParams.set("fromYear", "1975");
          urlObject.searchParams.set("fiscalPeriodTypeID", "4");
          urlObject.searchParams.set("toYear", new Date().getFullYear()?.toString());
        }

        // Return the updated URL
        finalUrlPieApi = urlObject.toString() + '&ext=json';

      } catch (error) {
        console.error("An error occurred in creating PieChartYearsList:", error);
      }


      getNotesLabelsData(finalUrlPieApi)
        .then((res: any) => {

          if (res?.data !== undefined) {
            let arrList: any = [];

            res?.data?.forEach((item: any) => {
              // Add null/undefined checks for item.Labels
              if (item?.Labels !== undefined && arrList.filter((x: { value: any; }) => x.value == item.Labels)?.length === 0) {
                arrList.push({ value: `${item.Labels}` });
              }
            });

            //-- Sort the array desc
            arrList?.sort(function (a: any, b: any) {
              return (b.value || 0) - (a.value || 0);
            });

            //-- Set to true for the first object, false for the rest
            arrList?.forEach(function (obj: any, index: any) {
              obj.isSelected = index === 0;
            });


           // setPieChartYearsList([...arrList] || []);
            setPieChartYearsList(arrList ? [...arrList] : []);

          }

        })
        .catch((err) => console.log(err, "err"));
    }
  }

  const imageTitle = createChartTitleForImageDownload((selectedLanguage == 'ar' ? titleAr : titleEn) ?? "chart data", subtitle);
  const customImageSetting = { height: "600px", width: "1000px" };
  const finalUrlImage = `${finalUrl}&image=1&title=${imageTitle} 
    &ucode=${loginUser?.UserCode ?? ''}&isfullview=0`;
  const handleDownloadImage = () => {
    setShowChartImgDownloadModal(true);
  }


  if (loading) {
    return <SiteLoader />;
  }
  return (
    <>



      <div className={mainclass}>
        <div className="item_chart pt-3 pb-3 px-0 px-lg-3">
          <div className=" mb-1 position-relative">
            <ChartWidgetHeader
              title={selectedLanguage == "en" ? titleEn : titleAr}
              subtitle={subtitle}
              hasCloseIcon={false}
              showsubtitle={true}
              chartId={section?.chartId}
              chartInfoName={selectedLanguage == "ar" ? section?.infoNameAr : section?.infoNameEn}

              fiscalConfiguration={fiscalConfiguration}
              chartType={chartType}
              selectedFiscalYear={selectedFiscalYear}
            />

            <span className="chart-hidden-id" style={{ display: "none" }}>
              {section.chartId}
            </span>

          </div>

          <div className="d-flex justify-content-between item mb-0 sm_flex_column">
            <div className="d-flex justify-content-between flex-column">
              {!isTrading ? render() : null}
            </div>

            <div className="d-flex justify-content-between flex-lg-column flex-lg-row flex-row-reverse align-items-center align-items-lg-end mt-1 mt-lg-0">
              <div className="widget_style">
                {
                  isArgaamEmbed && isArgaamEmbed === "1"
                    ?
                    <></>
                    :
                    <ChartExportOptions
                      onFullScreen={() => setshowModal(true)}
                      onShare={() => setshowLinkModal(true)}
                      onImageClick={() =>
                        //downloadImg()
                        handleDownloadImage()
                      }
                      onNotesClick={() => setShowNotesModal(true)}
                      toolsOption={{
                        excelDonwload: (toolsOptions?.ToolsOptions?.filter((x: { option: string; isVisible: boolean; }) => x.option == chartToolOptionsKeys.EXCEL_DOWNLOAD && x.isVisible == true)?.length > 0 ? true : false),
                        imgDownload: (toolsOptions?.ToolsOptions?.filter((x: { option: string; isVisible: boolean; }) => x.option == chartToolOptionsKeys.IMG_DOWNLOAD && x.isVisible == true)?.length > 0 ? true : false),
                        share: (toolsOptions?.ToolsOptions?.filter((x: { option: string; isVisible: boolean; }) => x.option == chartToolOptionsKeys.SHARE && x.isVisible == true)?.length > 0 ? true : false),
                        fullView: (isMobile == true ? false : (toolsOptions?.ToolsOptions?.filter((x: { option: string; isVisible: boolean; }) => x.option == chartToolOptionsKeys.FULLVIEW && x.isVisible == true)?.length > 0 ? true : false)),
                        note: (toolsOptions?.ToolsOptions?.filter((x: { option: string; isVisible: boolean; }) => x.option == chartToolOptionsKeys.NOTE && x.isVisible == true)?.length > 0 ? true : false),
                      }}
                      onExcelClick={() => {
                        window.open(excelchartUrl);
                      }}
                    />
                }

              </div>

              {configuration?.economicIndicatorField?.showDataGrowth == undefined ? chartDataGrowthHtml() : null}

            </div>
          </div>

          <div className="d-flex align-items-center col-12 chart_widget my-0 ">
            <div className="w-100">
              <div className="valuechart my-0">

                <CustomEmbed
                  key={renderKey}
                  src={finalUrl}
                  className={"loading"}
                  embedActiveClass={"activeclas"}
                  embedInActiveClass={"inactiveclass"}
                />



              </div>

            </div>
          </div>

          <div className="d-flex justify-content-end bottom_widget">
            <ChartSource
              isfullView={false}
              sourcesToDisplay={sourcesToDisplay}
            />
            <div>
              <UserCodeChart className={'userCode1'} />
            </div>
          </div>




          {/* <div className="d-flex align-items-center col-12 mt-lg-3 mt-3 justify-content-center comparable_widget">
            {renderChartCompare()}
          </div> */}

        </div>

        {/* {showModal == true ? (
          <FullViewChart
            title={selectedLanguage == "en" ? titleEn : titleAr}
            subtitle={subtitle}
            sectionTitle={sectionTitle}
            charttooltipIcon={charttooltipIcon}
            pageTitle={pageTitle}
            onClose={() => setshowModal(false)}
            isOpen={showModal}
            section={section}
            api={api}
            onRequestClose={() => setshowModal(false)}
            urlconfig={props?.urlconfig}
            attrId={attrId}
            isBussinessSegment={isBussinessSegment}
            dataApi={dataApi}
            hideData={hideData}
            selectedYear={selectedFiscalYear}
            selectedPeriod={selectedFiscalPeriod}
            selectedGrowth={selectedGrowthButton}
            otherFiscalConfig={selectedOthereFiscalData}
            pieChartYearsList={pieChartYearsList}
            selectedCompareFieldIdsInput={selectedCompareFieldIds}
            hideComparision={!hasComparision}
            configuration={configuration}
          />
        ) : (
          <></>
        )} */}

        {/* {showNotesModal && (

          <ChartNotesModal
            isOpen={showNotesModal}
            mainTitle={"main title"}
            tableTitle={selectedLanguage == "en" ? titleEn : titleAr}
            chartId={section?.chartId}
            selectedYear={selectedFiscalYear}
            selectedPeriod={selectedFiscalPeriod}
            onNotsModalRequestClose={() => setShowNotesModal(false)}
            reloadChartIframe={reloadChartIframe}
            finalUrl={finalUrl}
          />


        )} */}

        {/* {showChartImgDownloadModal == true && (

          <ChartDownloadModal
            visible={showChartImgDownloadModal}
            finalUrl={finalUrlImage}
            customSetting={customImageSetting}
            onRequestClose={() => setShowChartImgDownloadModal(false)}
          />


        )} */}


        {/* {downloadRender()} */}


      </div>


    </>
  );
}
