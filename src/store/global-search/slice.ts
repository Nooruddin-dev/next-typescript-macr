import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  globalSearch: null,
  lastUpdated: null
};

export const globalSearchSlice = createSlice({
  name: "globalSearch",
  initialState,
  reducers: {
    setGlobalSearch: (state: any, action: any) => {
      state.globalSearch = action.payload;
      state.lastUpdated = new Date().getTime();
    },
  },
  extraReducers: (builder) => {},
});


export const {
  setGlobalSearch,
} = globalSearchSlice.actions;

export default globalSearchSlice.reducer;
