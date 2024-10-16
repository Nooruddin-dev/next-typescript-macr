"use client"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import config, { ENDPOINTS } from "../../services/config";
import { getMacroCategories } from "@/helpers/apiService";



const initialState = {
  value: 0,
  categories: []
};

const marketId = config.defaultMarketId;

export const setCategories = createAsyncThunk(
  "home/setCategories",
  async (category, thunkAPI) => {
    try {
      
      let categories = await getMacroCategories();
      const { data } = categories;
      const { macroCategories } = data;
      return { macroCategories };
    } catch (error) {
      // Handle the error here
      console.error("error", error);
      throw error; // Rethrow the error to be caught by the caller
    }
  }
);





export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(setCategories.fulfilled, (state, action) => {
      state.categories = action.payload.macroCategories;
    });
  },
});

export const {
} = homeSlice.actions;

export default homeSlice.reducer;
