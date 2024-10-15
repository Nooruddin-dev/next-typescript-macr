

import axios from "axios";
import config, { API_URL, API_ARGAAM_PLUS_URL, ENDPOINTS, ExternalEndpoints, HttpMethodTypes, MACRO_SERVICE_API_URL, MacroServiceEndPoints, ARGAAM_SHORTENER_URL } from "../services/config";

import {apiRequest } from "./axios";
import { checkIfStringIsNotEmtpy, isEmptyEntity } from "./common/GlobalHelper";

export const getMacroCategories = () => {
  
  return apiRequest.get(
    `${ENDPOINTS.getMacroCategories}`
  );
};

export const getMacroPageSectionsApi = (pageNo: any, pageId: any, sectionId:any = 0, secChartId: any = 0, isPreview: any = 0) => {

  let apiCallUrl = `${ENDPOINTS.getMacroPageSections}/${pageNo}/${pageId}`;
  if (checkIfStringIsNotEmtpy(sectionId) == true && sectionId > 0) {
    apiCallUrl = apiCallUrl + `?sectionId=${sectionId}`;
  }
  if (checkIfStringIsNotEmtpy(secChartId) == true && secChartId > 0) {
    apiCallUrl = apiCallUrl + `&secChartId=${secChartId}`;
  }

  if (checkIfStringIsNotEmtpy(isPreview) == true && isPreview > 0) {
    apiCallUrl = apiCallUrl + `?isPreview=1`;
  }

  return apiRequest.get(
    apiCallUrl
  );
};

export const getNotesLabelsData = (finalUrl: any) => {

  return apiRequest.get(
    `${finalUrl}`
  );
};

export const getChartChangeInPercentageApi = (fieldId: any) => {

  let customBaseURL = `${ExternalEndpoints.base}`;
  //-- Create a configuration object with the custom baseURL if provided
  let config = customBaseURL ? { baseURL: customBaseURL } : undefined;

  //-- Make the GET request using Axios and the provided configuration
  return apiRequest.get(
    `${ExternalEndpoints.macroInflationChangePercent}/${fieldId}`,
    config
  );


};

export const getSectorPageSeoInfo = (pageId: any) => {
  const apiBaseUrl = API_URL;
  return axios.get(
    `${apiBaseUrl}${ENDPOINTS.getSectorPageSeoInfoPoint}/${pageId}`
  );
};
