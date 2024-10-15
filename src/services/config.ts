

// export const {
//   VITE_APP_API_URL: API_URL,
//   VITE_APP_API_ARGAAM_PLUS_URL: API_ARGAAM_PLUS_URL,
//   VITE_APP_MACRO_SERVICE_API_URL: MACRO_SERVICE_API_URL,

//   VITE_APP_CHARTS_URL: CHARTS_URL,
//   VITE_APP_CHARTS_EXCEL_URL: CHARTS_EXCEL_URL,
//   VITE_APP_ARGAAM_SHORTENER_URL: ARGAAM_SHORTENER_URL,

//   VITE_APP_LOGOUT_URL: CONFIG_APP_LOGOUT_URL,
//   VITE_APP_LOGIN_URL: CONFIG_APP_LOGIN_URL,
//   VITE_APP_REGISTER_URL: CONFIG_APP_REGISTER_URL,
//   VITE_APP_AUTOLOGIN_URL: CONFIG_APP_AUTOLOGIN_URL,

//   VITE_APP_SITE_BASE_URL: CONFIG_APP_SITE_BASE_URL,

//   VITE_APP_VERSION: VERSION,
//   VITE_APP_TYPE: TYPE,
// } = import.meta.env;

export const API_URL = "https://macroeconapi.edanat.com";
export const API_ARGAAM_PLUS_URL = "https://datauat.edanat.com";
export const MACRO_SERVICE_API_URL = "https://qa-macroeconomics-api.edanat.com";

export const CHARTS_URL = "https://chartsuat.edanat.com/charts/";
export const CHARTS_EXCEL_URL = "https://chartsuat.edanat.com/downloads/";
export const ARGAAM_SHORTENER_URL = "https://urls.edanat.com/get-short-url";

export const CONFIG_APP_LOGOUT_URL = "https://accounts.edanat.com/logout";
export const CONFIG_APP_LOGIN_URL = "https://accounts.edanat.com/authenticate";
export const CONFIG_APP_REGISTER_URL = "https://accounts.edanat.com/register";
export const CONFIG_APP_AUTOLOGIN_URL = "https://accounts.edanat.com/auto-login";

export const CONFIG_APP_SITE_BASE_URL = "https://macroeconpp.edanat.com/";

export const VERSION = "1"; // Version of the app
export const GAID = "G-HTWKJGSFTR"; // Google Analytics ID
export const TYPE = "json/macro/ui"; // Application type



const config = {
  apiURL: `${API_URL}/api/v${VERSION}/${TYPE}`,
  chartUrl: `${CHARTS_URL}`,
  // marketCompaniesUrl : `${API_URL}/api/v${VERSION}/${TYPE}/market-companies`,
  marketCompaniesUrl: `${API_URL}/api/v${VERSION}/${TYPE}/country-markets-sector-companies`,
  companiesPeerUrl: `${API_URL}/api/v${VERSION}/${TYPE}/company-peers`,
  companyStockSummaryUrl: `${API_URL}/api/v${VERSION}/${TYPE}/company-stock-summary`,
  companyAnalystRecommendationUrl: `${API_URL}/api/v${VERSION}/${TYPE}/company-analyst-recommendation`,
  companyMajorShareholderUrl: `${API_URL}/api/v${VERSION}/${TYPE}/company-major-shareholders`,
  companyForeignOwnershipUrl: `${API_URL}/api/v${VERSION}/${TYPE}/company-foreign-ownerships`,
  companyTickerUrl: `${API_URL}/api/v${VERSION}/${TYPE}/company-ticker`,
  defaultMarketId: '3',
  defaultLangID: '2',
  defaultComppanyId: '3509',
  financialRatiosUrl: `${API_URL}/api/v${VERSION}/${TYPE}/company-fr-data`,
  businessSegmentsData: `${API_URL}/api/v${VERSION}/${TYPE}/companies-business-segments-latest-data`,
  geoLocationSegmentsData: `${API_URL}/api/v${VERSION}/${TYPE}/companies-geolocation-segments-latest-data`,
  financialStatementUrl: `${API_URL}/api/v${VERSION}/${TYPE}/company-fs-data`,
  financialFsUrl: `${API_URL}/api/v${VERSION}/${TYPE}/companies-fst-fields-data`,
  dividendHistory: `${API_URL}/api/v${VERSION}/${TYPE}/companies-cash-dividend-history-data`,
  companyReturnsUrl: `${API_URL}/api/v${VERSION}/${TYPE}/companies-total-returns-history-data`,
  companiesRankingUrl: `${API_URL}/api/v${VERSION}/${TYPE}/companies-ranking-data`,
  widgetConfig: `${API_URL}/api/v${VERSION}/${TYPE}/ui/widgets-config`,
  lastfiscalAttr: `${API_URL}/api/v${VERSION}/${TYPE}/ui/last-fiscal-attribute`,
  showGlobalErrors: true,
  ChartUniqueCodeSeq: 'EntityId-chartId-FieldIndicatorId',
  checkNotesAuthorization: false,
};

export const ENDPOINTS = {
  signin: '/authenticate-for-macro',
  userToken: '/user-token',
  getMacroCategories: `/api/v${VERSION}/${TYPE}/macro-categories`,
  getMacroPageSections: `/api/v${VERSION}/${TYPE}/macro-page-sections`,
  getChartDataByChartId: `/api/v${VERSION}/${TYPE}/macro-chart`,
  macroChartNotes: `/api/v${VERSION}/${TYPE}/macro-chart-notes`,
  deleteChartNote: `/api/v${VERSION}/${TYPE}/notes/delete`,
  macroNotesAddEdit: `/api/v${VERSION}/${TYPE}/notes/add-edit`,
  getMacroChartEntities: `/api/v${VERSION}/${TYPE}/macro-chart-entities`,
  macroChartGlobalSearch: `/api/v${VERSION}/${TYPE}/macro-chart-global-search`,
  getMacroSectionsByPageId: `/api/v${VERSION}/${TYPE}/get-macrosections-by-pageId`,
  addProductRequest: `/api/v${VERSION}/json/charts/add-product-details-request-macro`,
  addCrmRequest: `/api/v${VERSION}/json/crm/add-crm-lead`,
  updateExcelDownloadCount: `/api/v${VERSION}/json/charts/update-user-download-count-macro`,
  getSectorPageSeoInfoPoint: `/api/v${VERSION}/${TYPE}/get-seo-page-info`,
  refreshToken: `/refresh-authenticate-for-charts`,
  postQuestionaire: `/api/v${VERSION}/json/charts/post-questionnaier-macro`,

}

export const ExternalEndpoints = {
  base: `${API_ARGAAM_PLUS_URL}/api/v${VERSION}/json/charts`,
  macroInflationChangePercent: 'macro-inflation-changepercent'
}

export const MacroServiceEndPoints = {
  getIndicatorFreeFloatIndex: `/api/v${VERSION}/json/macro/indicators-free-float-index`,
}



export const HttpMethodTypes = {
  POST: 'POST',
  GET: 'GET',
};

export const chartTypesConfig = {
  BAR: 'Bar',
  AREA: 'Area',
  LINE: 'Line',
  STACK: 'Stack',
  StackWithTotal: 'StackWithTotal',
  StackLine: 'StackLine',
  PIE: 'Pie',
  ColumnLine: 'ColumnLine'
};

export const dataOperationTypes = {
  INSERT: 1,
  UPDATE: 2,
  DELETE: 3,
};

export const validationMessageTypes = {
  ERROR: '1',
  SUCCESS: '2',
  INFO: '3',
};

export const chartApiSourceTypes = {
  ECONOMIC_INDICATOR: 'economic-indicator-data',
  CONSUMER_RPICES: 'consumer-prices',

};

export const userTypes = {
  CP_USER: 'CpUser',
};

export const chartToolOptionsKeys = {
  EXCEL_DOWNLOAD: 'excelDownload',
  IMG_DOWNLOAD: 'imgDownload',
  FULLVIEW: 'fullView',
  SHARE: 'share',
  COPY_EMBED: 'copyEmbed',
  NOTE: 'note',
};

export default config;
