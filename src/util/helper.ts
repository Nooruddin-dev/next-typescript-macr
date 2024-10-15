

export function yearsAgo(numYears: any) {
  const currentYear = new Date().getFullYear();
  const yearsAgo = currentYear - numYears;
  return yearsAgo;
}
export function getCurrentYear(numYears: any) {
  return new Date().getFullYear();
}

export function getCurrentDate() {
  var currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  var day = ("0" + currentDate.getDate()).slice(-2);

  var formattedDate = year + "-" + month + "-" + day;

  return formattedDate;
}

export function getDateYearsAgo(yearsAgo: any) {
  var currentDate = new Date();
  var year = currentDate.getFullYear() - yearsAgo;
  var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  var day = ("0" + currentDate.getDate()).slice(-2);

  var formattedDate = year + "-" + month + "-" + day;

  return formattedDate;
}

export default function getLangID(langtype: any) {
  switch (langtype) {
    case "en":
      return 2;
    case "ar":
      return 1;
    default:
      return "en";
  }
}

export  function getLangNameById(langId: any) {
  switch (langId) {
    case 2:
      return "en";
    case 1:
      return "ar";
    default:
      return "en";
  }
}

export function groupByUniqueKey(arr: any, keyName: any) {
  const groups: any = {};

  for (const obj of arr) {
    const value = obj[keyName];
    if (!groups[value]) {
      groups[value] = [];
    }
    groups[value].push(obj);
  }

  return Object.entries(groups).map(([key, value]) => ({
    keyname: key,
    data: value,
  }));
}

export const downloadFile = async (fileUrl: any, fileName: any) => {
  try {
    const a = document.createElement("a");
    a.href = await toDataURL(fileUrl);
    a.download = "myImage.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error occurred while downloading the file:", error);
  }
};

function toDataURL(url:any) {
  return fetch(url)
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      return URL.createObjectURL(blob);
    });
}

export const removeSpecialChars = (title: any) => title.replace(/[^\w\s]/gi, "");

export function AddDynamicBootstrapClass(arr:any) {
  const remainder = arr.length % 4;
  const limit = 4;
  const rowlength = 12;
  arr.map((i: any, ind: any) => {
    if (remainder == 0) {
      i.colsize = rowlength / limit;
    } else if (arr.length <= 4) {
      i.colsize = rowlength / arr.length;
    } else {
      const isremainderitem = arr.length - (ind + 1) < remainder;
      const isNextitemremainder = arr.length - (ind + 2) < remainder;

      if (remainder == 1) {
        const itemstoseperate = 2;
        const remainingitems = arr.length - itemstoseperate;

        if (isremainderitem || isNextitemremainder) {
          i.colsize = rowlength / itemstoseperate;
        } else {
          if (remainingitems - ind < limit) {
            i.colsize = 4;
          } else {
            i.colsize = 3;
          }
        }
      } else {
        if (isremainderitem) {
          i.colsize = rowlength / remainder;
        } else {
          i.colsize = rowlength / limit;
        }
      }
    }
  });
  return arr;
}

export function getYears(startYear: any, endYear: any) {
  const years = [];

  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return years;
}

export const getFirstWordFromText = (text: any) => {

  if (!checkIfStringIsNotEmtpy(text)) {
    return "";
  }

  const wordsArray = text.replace(/^\s+|\s+$/g, '').split(" ");
  var firstWord = wordsArray[0];
  if (firstWord != "") {
    firstWord = " " + firstWord + " "
  }
  return firstWord;
}

export const getWordsfromTextExceptFirstWord = (text: any) => {

  if (!checkIfStringIsNotEmtpy(text)) {
    return "";
  }

  const wordsArray = text.replace(/^\s+|\s+$/g, '').split(" ");
  const remainingText = wordsArray.slice(1).join(" ");
  return remainingText;
}

export const checkIfStringIsNotEmtpy = (str: any) => {
  let result = false;
  if (str == null || str == undefined || str == "undefined") {
    str = '';
  }
  result = /\S+/.test(str);
  return result;

}

export function getMaxPercentage(val: any) {
  if (parseFloat(val) > 100) {
    return 100;
  } else {
    return val;
  }
}

export const calculatePercentage = (value: any, maxValue: any) => {
 
    //-- Ensure value is not greater than the maxValue to avoid percentages exceeding 100%
    value = Math.min(value, maxValue);

    //-- Calculate the percentage
    //const percentage = (value / maxValue) * 100;
    //const percentage = ((value / maxValue) * 90) + 10;
    const percentage = ((value / maxValue) * 90) + 6;

    //-- Round the percentage to a desired number of decimal places
    const roundedPercentage = Math.round(percentage * 100) / 100; // Round to 2 decimal places


    return roundedPercentage;

};