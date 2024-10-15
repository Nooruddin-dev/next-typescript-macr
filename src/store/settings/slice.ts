import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedLanguage: "ar"
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSelectedLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
  },
  extraReducers: (builder) => {},
});


export const {
  setSelectedLanguage
} = settingsSlice.actions;

export default settingsSlice.reducer;
