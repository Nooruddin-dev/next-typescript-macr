'use client';

import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import homeReducer from "./home/slice";
import settingsReducer from "./settings/slice";
import userReducer from "./user/slice";
import authReducer from "./authmodal/slice";
import globalSearchReducer from "./global-search/slice";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const isDev = process.env.NODE_ENV == "development";
const defaultmiddlewares = getDefaultMiddleware({ serializableCheck: false });
const middlewares = [...defaultmiddlewares];

if (isDev) {
  // const logger = createLogger();
  // middlewares.push(logger);
}

const persistConfig = {
  key: "root",
  storage,
  // whitelist: ["settings"],
};

const persistedSettingsReducer = persistReducer(
  { ...persistConfig, key: "settings" },
  settingsReducer
);
const persistedUserReducer = persistReducer(
  { ...persistConfig, key: "user" },
  userReducer
);
const persistedHomeReducer = persistReducer(
  { ...persistConfig, key: "home" },
  homeReducer
);

const persistedGlobalSearchReducer = persistReducer(
  { ...persistConfig, key: "globalSearch" },
  globalSearchReducer
);

const persistedReducer = combineReducers({
  home: persistedHomeReducer,
  user: persistedUserReducer,
  settings: persistedSettingsReducer,
  globalSearch: persistedGlobalSearchReducer,
  modal: authReducer
});

export const storeSession = configureStore({
  reducer: persistedReducer,
  middleware: middlewares,
  devTools: false,
});

export const persistedStore = persistStore(storeSession);
