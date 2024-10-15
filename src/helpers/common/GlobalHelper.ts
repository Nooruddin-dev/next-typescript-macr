import { chartTypesConfig } from "@/services/config";

export const isBrowserWindow = () => {
  if (typeof window !== 'undefined') {
    return true;
  } else {
    return false;
  }
};

export function isEmptyEntity(n: any) {
  return !(!!n
    ? typeof n === "object"
      ? Array.isArray(n)
        ? !!n.length
        : !!Object.keys(n).length
      : true
    : false);
}

export const checkIfStringIsNotEmtpy = (str: any) => {
  let result = false;
  if (str == null || str == undefined || str == "undefined") {
    str = '';
  }
  result = /\S+/.test(str);
  return result;
}

export const getCurrentYear = () => {
  return new Date().getFullYear();
}

export function getActiveCategoriesPages(categories: any) {
   
  const filteredCategories = categories?.filter((x: { isActive: boolean; })=>x.isActive == true);
  
  const result = filteredCategories?.filter((element: any) => {
    // Check if sub-array length is greater than 0
    return element?.macrocategoryPages?.length > 0 && element?.macrocategoryPages?.some((item: { isActive: boolean; }) => item.isActive == true);
  });

  return result;

}

export const getChartCountTitleAr = (chartCount: any) => {
  const remainder = parseInt(String(chartCount ?? 0)) % 100;


  if (remainder === 0) {
    return 'رسم بياني';

  } else if (remainder === 1 || remainder === 2) {

    return "رسم بياني";

  } else if (remainder >= 3 && remainder <= 10) {
    return "رسوم بيانية";

  } else if (remainder >= 11 && remainder <= 99) {
    return "رسماً بيانياً";

  } else {
    //-- For numbers 100+, apply the same logic as for numbers 100-
    const newRemainder = remainder % 100;
    if (newRemainder === 1 || newRemainder === 2) {
      return "رسم بياني";
    } else if (newRemainder >= 3 && newRemainder <= 10) {
      return "رسوم بيانية";
    } else if (newRemainder >= 11 && newRemainder <= 99) {
      return "رسماً بيانياً";
    }
  }
}


export const getCurrentFormattedDate = (locale: any) => {

  //--Below commented two lines are old code
  // const options = { day: 'numeric', month: 'long', year: 'numeric' };
  // return new Intl.DateTimeFormat(locale, options).format(new Date());

  try {


    const options: any = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat(locale, options).format(new Date());

    //   Split the formatted date into day, month, and year
    const parts = formattedDate?.split(' ');

    //   Reorder the parts to get the desired format
    let finalDate = '';
    if (locale == 'ar-EG') {

      finalDate = (`${parts[0]} ${parts[1]} ${parts[2]}`)?.replace(/,/g, '');

      //--below lines are to replace arabic digits with english digits otherwise above finalDate is ok
      const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
      const englishDigits = '0123456789';
      return finalDate?.replace(/[٠-٩]/g, (digit) => englishDigits[arabicDigits.indexOf(digit)]);

    } else {
      finalDate = (`${parts[1]} ${parts[0]} ${parts[2]}`)?.replace(/,/g, '');
    }

    return finalDate;

  } catch (error: any) {

    console.error('An error occurred:', error.message);

    const options: any = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat(locale, options).format(new Date());


  }

};

export const removeStartEndSpacesFromString = (inputString: any) => {

  if (checkIfStringIsNotEmtpy(inputString)) {
    return inputString.trim();
  } else {
    return inputString;
  }
}

export const getChartType = (configuration: any, sectionChartType: any, selectedCompareFieldIds: any, isDataGrowthChart: any) => {

  let chartType = "";

  if (isDataGrowthChart == true) {
    return chartTypesConfig.ColumnLine;
  }

  if (sectionChartType == chartTypesConfig.PIE) {
    chartType = sectionChartType;
    return chartType;
  }


  if (selectedCompareFieldIds != undefined && selectedCompareFieldIds.filter((x: any) => x !== configuration?.economicIndicatorField?.economicIndicatorFieldID)?.length > 0) {

    if (checkIfStringIsNotEmtpy(configuration?.compchartType ?? '')) {
      chartType = configuration?.compchartType;
    } else {
      if (checkIfStringIsNotEmtpy(sectionChartType ?? '')) { //-- if sectionChartType is not null/undefined
        chartType = sectionChartType;
      } else {
        chartType = chartTypesConfig.AREA;
      }
    }

  }
  else if (configuration?.defaultComparable == true) {
    if (checkIfStringIsNotEmtpy(configuration?.compchartType ?? '')) {
      chartType = configuration?.compchartType;
    } else {
      if (checkIfStringIsNotEmtpy(sectionChartType ?? '')) { //-- if sectionChartType is not null/undefined
        chartType = sectionChartType;
      } else {
        chartType = chartTypesConfig.AREA;
      }
    }
  }

  else {
    if (checkIfStringIsNotEmtpy(sectionChartType ?? '')) {
      chartType = sectionChartType;
    } else {
      chartType = chartTypesConfig.BAR;
    }
  }

  return chartType;
}