import { FiscalPeriodTypesEnum } from "@/constants/GlobalEnums";
import { chartTypesConfig } from "@/services/config";
import { fiscals } from "@/util/fiscals";
import { checkIfStringIsNotEmtpy, removeStartEndSpacesFromString } from "../common/GlobalHelper";
import { yearsAgo } from "@/util/helper";


export const isValidSectorPageId = (pageId: any) => {
    return !isNaN(pageId) && Number.isInteger(parseFloat(pageId));
}

export const createChartMainDivCssClass = (numberOfCharts: any) => {

    let chartMainClass = "col-12 col-lg-6 p-dir chart_mar_b";
    if (numberOfCharts != undefined && numberOfCharts != null && numberOfCharts > 0) {
        const rowCols = 12 / numberOfCharts;
        chartMainClass = `col-12 col-lg-${rowCols} chart_mar_b p-dir`;

    }

    return chartMainClass;

}


export const getPageSeoNameFromUrl = (pathname: any) =>{
    const pathSegments = pathname.split('/').filter(Boolean);
    const categoryName = pathSegments[1] || '';
    const pageName = pathSegments[2] || '';
    return pageName;
}

export const createFiscalYears = (fiscalConfiguration: any, chartYear: any) => {

    let finalYearsArray: any = [];


    try {
        if (chartYear == undefined) {
            return finalYearsArray;
        }

        const apiyears = fiscalConfiguration?.isFullView != undefined && fiscalConfiguration?.isFullView == true
            ?
            Array.isArray(chartYear?.fullViewYears)
                ? chartYear?.fullViewYears
                : chartYear?.fullViewYears != undefined ? JSON.parse(chartYear?.fullViewYears)
                    :
                    (chartYear?.years != undefined ? JSON.parse(chartYear?.years) : [])
            :
            Array.isArray(chartYear?.years)
                ? chartYear?.years
                : chartYear?.years != undefined ? JSON.parse(chartYear?.years) : []
            ;


        apiyears?.forEach(function (yr: any) {

            if (yr != undefined) {
                let selectedFiscalRow = fiscals?.FiscalYears?.find(x => parseInt(x.Value?.toString()) == parseInt(yr));
                if (selectedFiscalRow != undefined && selectedFiscalRow.Value != undefined) {
                    finalYearsArray.push(selectedFiscalRow);
                }

            }
        })

    } catch (error) {

        console.error("An error occurred in fiscal years:", error);
    }

    return finalYearsArray;

}


export const createFiscalPeriods = (fiscalConfiguration: any, chartPeriod: any) => {

    let finalPeriodsArray: any = [];

    try {
        if (chartPeriod == undefined) {
            return finalPeriodsArray;
        }


        let fiscalPeriods = Array.isArray(chartPeriod?.periods)
            ? chartPeriod?.periods
            : chartPeriod?.periods != undefined ? JSON.parse(chartPeriod?.periods) : []



        if (fiscalConfiguration?.chartType == chartTypesConfig.PIE) {
            fiscalPeriods?.filter((i: number) => i == FiscalPeriodTypesEnum.Year || i == FiscalPeriodTypesEnum.Quarterly || i == FiscalPeriodTypesEnum.Monthly)?.forEach(function (pr: any) {

                if (pr != undefined) {

                    let selectedPeriodRow = fiscals?.fiscalPeriods?.find(x => parseInt(x.Value?.toString()) == parseInt(pr));
                    if (selectedPeriodRow != undefined && selectedPeriodRow.Value != undefined) {
                        finalPeriodsArray.push(selectedPeriodRow);
                    }

                }
            })
        } else {
            fiscalPeriods?.forEach(function (pr: any) {

                if (pr != undefined) {

                    let selectedPeriodRow = fiscals?.fiscalPeriods?.find(x => parseInt(x.Value?.toString()) == parseInt(pr));
                    if (selectedPeriodRow != undefined && selectedPeriodRow.Value != undefined) {
                        finalPeriodsArray.push(selectedPeriodRow);
                    }

                }
            })
        }

    } catch (error) {

        console.error("An error occurred in fiscal periods:", error);
    }

    return finalPeriodsArray;

}


export const getPieChartYears = (numYears: any) => {
    let yearsList = [];


    let cYear: any = new Date().getFullYear();
    cYear = parseInt(cYear) - 1;
    yearsList.push({ value: cYear, isSelected: true })

    {
        for (var i = 1; i <= numYears; i++) {
            yearsList.push({ value: cYear - i, isSelected: false })
        }
    }
    return yearsList ?? [];

}

export const createDataFilter = (dataFilters: any, fiscalConfiguration: any) => {

    let finalDataArray: any = [];


    try {
        if (dataFilters == undefined) {
            return finalDataArray;
        }

        const finalTabs = fiscalConfiguration?.isFullView != undefined && fiscalConfiguration?.isFullView == true
            ?
            Array.isArray(dataFilters?.tabsFullView)
                ? dataFilters?.tabsFullView
                : dataFilters?.tabsFullView != undefined ? JSON.parse(dataFilters?.tabsFullView)
                    :
                    (dataFilters?.tabs != undefined ? JSON.parse(dataFilters?.tabs) : [])
            :
            Array.isArray(dataFilters?.tabs)
                ? dataFilters?.tabs
                : dataFilters?.tabs != undefined ? JSON.parse(dataFilters?.tabs) : []
            ;


        finalTabs?.forEach(function (tb: any) {

            if (tb != undefined) {
                let selectedGrowthButton = fiscals?.DataFilters?.find(x => parseInt(x.Value?.toString()) == parseInt(tb));
                if (selectedGrowthButton != undefined && selectedGrowthButton.Value != undefined) {
                    finalDataArray.push(selectedGrowthButton);
                }

            }
        })

    } catch (error) {

        console.error("An error occurred in fiscal years:", error);
    }

    return finalDataArray;

}


export const createEconomicFieldIndicatorArray = (economicIndicatorFieldID: any) => {
    try {

        if (!checkIfStringIsNotEmtpy(economicIndicatorFieldID)) {
            return [];
        }

        //--check if economicIndicatorFieldID is integer.
        if (!isNaN(economicIndicatorFieldID)) {
            economicIndicatorFieldID = economicIndicatorFieldID.toString();
        }




        let economicIndicatorWithoutSpace = removeStartEndSpacesFromString(economicIndicatorFieldID);
        let economicIndicatorsArray = [];
        economicIndicatorsArray = economicIndicatorWithoutSpace
            ?.split(',')
            ?.map((id: string) => parseInt(id.trim(), 10)) // Parse each ID as an integer
            ?.filter((id: number) => !isNaN(id)); // Remove any NaN values

        return economicIndicatorsArray;

    } catch (error: any) {
        // Code to handle the error
        console.error("An error occurred:", error.message);
        return [];
    }

}

export const createChartToYear = (chartType: any, defaultYear: any, pieChartYear: any) => {

    let yr = defaultYear;

    if (chartType == chartTypesConfig.PIE) {
        //--Modify toYear in case of pie chart
        if (checkIfStringIsNotEmtpy(pieChartYear)) {
            yr = pieChartYear;
        }
    } else {
        yr = defaultYear;
    }

    return yr;
}

export const createChartFromYear = (chartType: any, selectedFiscalYear: any, pieChartYear: any) => {

    let yr: any = "";

    if (chartType == chartTypesConfig.PIE) {
        //--Modify toYear in case of pie chart
        if (checkIfStringIsNotEmtpy(pieChartYear)) {
            yr = pieChartYear;
        }
    } else {
        yr = selectedFiscalYear?.Value !== undefined ? yearsAgo(selectedFiscalYear?.Value ?? 0) : '';
    }

    return yr;
}


export const generateFiscalPeriodIdForPie = (selectedFiscalPeriodId: any, chartType: any) => {
    if (chartType == chartTypesConfig.PIE) {
        return selectedFiscalPeriodId?.value ?? 0;
    } else {
        return 0;
    }
}


export const separateSourcesByLanguage = (sources: any) => {
    const englishSources: any = [];
    const arabicSources: any = [];

    sources?.forEach((source: any) => {
        // Check if sourceEn has non-empty text, and add to englishSources if true
        if (source.sourceEn && source.sourceEn.trim()) {
            englishSources.push({ source: source.sourceEn });
        } else if (source.SourceEn && source.SourceEn.trim()) {
            englishSources.push({ source: source.SourceEn });
        }

        // Check if sourceAr has non-empty text, and add to arabicSources if true
        if (source.sourceAr && source.sourceAr.trim()) {
            arabicSources.push({ source: source.sourceAr });
        } else if (source.SourceAr && source.SourceAr.trim()) {
            arabicSources.push({ source: source.SourceAr });
        }

    });

    return {
        englishSources,
        arabicSources
    };
};


export function createChartTitleForImageDownload(inputStringChartTitle: any, inputStringUnit: any) {
    // Regular expression to match special characters except Arabic letters, rounded brackets, and the % sign
   // const regex = /[^A-Za-z0-9\u0600-\u06FF\s()%\/]/g;
     const regex = /^[a-zA-Z0-9()/\\\-_+=*%$]*$/;
 
    // Replace the special characters with an empty string
    const resultTitle = inputStringChartTitle?.replace(regex, "");
    const resultUnit = inputStringUnit?.replace(regex, "");
    let finalResult  =`${resultTitle} ${resultUnit}`;

    //-- For plus sign, it was create issue in image download. + sign was removed on chart engine side
    if(finalResult?.includes("+")){
        finalResult = encodeURIComponent(finalResult);
    }
    
    return finalResult;
 }

 export const showChartTitleToolTip = (str: any, chartTitleLength: any) => {

    if ((chartTitleLength != undefined && chartTitleLength != null && chartTitleLength > 0) && str.length > chartTitleLength) {
        return true;
    }

    return false;
}

export const makeChartTitleLength = (str: any, chartTitleLength: any) => {

    if ((chartTitleLength != undefined && chartTitleLength != null && chartTitleLength > 0) && str.length > chartTitleLength) {
        return str.substring(0, chartTitleLength) + '...';
    }

    return str;
}
