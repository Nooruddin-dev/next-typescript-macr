import { API_ARGAAM_PLUS_URL, API_URL, CONFIG_APP_LOGOUT_URL, ENDPOINTS } from "@/services/config";
import { storeSession } from "@/store/store";
import { clearUser, setUser } from "@/store/user/slice";
import axios from "axios";
import { isBrowserWindow, isEmptyEntity } from "./common/GlobalHelper";
import { generateFingerprint } from "../util/authhelper";


export const apiRequest = axios.create({
  baseURL: API_URL,
  //   responseType: 'json',
  //  headers: {'Access-Control-Allow-Headers': '*'},
});

apiRequest.interceptors.response.use(
  (response) => {
    if (response.status == 200 || response.status == 201) {
      return Promise.resolve(response);
    }
    return response; // Return the response for all other statuses
  },
  (error) => {
    console.log('interceptors error', error);
    if (error?.response?.status == 401) {
      // handle 401 error
    }
    return Promise.reject(error?.response);
  }
);


export function resetUser(reload = true, autologout = false, otherFields: any = null) {

  if (typeof localStorage != "undefined") {
    const uniqId = localStorage.getItem("uniqueIdentifier");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("uniqueIdentifier");

    storeSession.dispatch(clearUser(null));


    if (reload) {

      const logoutUrl = CONFIG_APP_LOGOUT_URL;

      if (isBrowserWindow()) {
        let refferalURL = window.location.href;
        if (otherFields != null && !isEmptyEntity(otherFields?.refferalURL)) {
          refferalURL = otherFields.refferalURL;
        }


        window.open(
          `${logoutUrl}?refferalURL=${refferalURL}&uniqueIdentifier=${uniqId}&autologout=${autologout}`,
          "_self"
        );
      }

    }
  }


}


export async function refreshToken() {

  try {

    const jwtToken = localStorage.getItem("jwtToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const uniqueIdentifier = localStorage.getItem("uniqueIdentifier");

    const fingerprint = await generateFingerprint(); // Generate fingerprint asynchronously


    const fullUrl = `${API_ARGAAM_PLUS_URL}${ENDPOINTS.refreshToken}`;
    const newToken = await axios.post(fullUrl, {
      jwtToken,
      refreshToken,
      tokenOption: "Macro",
      uniqueIdentifier,
      BrowserAgent: fingerprint,
    });

    const { jwtToken: newjwtToken, refreshToken: newrefreshToken } = newToken.data;

    localStorage.setItem("jwtToken", newjwtToken);
    localStorage.setItem("refreshToken", newrefreshToken);

    const splittokens = newjwtToken.split(".");
    const parsedToken = parseJwt(newjwtToken);
    let user = {
      ...parsedToken,
    };

    const existingUser: any = storeSession.getState()?.user?.user;
    const hasExpired =
      existingUser?.IsMacroTrialOrMacroPackageExpired !== "true" &&
      user?.IsMacroTrialOrMacroPackageExpired === "true";

    storeSession.dispatch(setUser(user));

    return Promise.resolve(hasExpired);
  } catch (error) {

    // store.dispatch(resetUser(true));
    // redirectLogin();
    console.error("Error refreshing token:", error);
    return Promise.reject(error);
  }
}

export function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}