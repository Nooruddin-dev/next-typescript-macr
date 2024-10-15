import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state, action) => {
      state.user = null;
      // setTimeout(() => {
      //   window.location.reload();
      // }, 500);
      // if (action.payload.callback) {
      //   action.payload.callback();
      // }
      // clearAccessToken();
    },
  },
  extraReducers: (builder) => {},
});


export const {
  setUser, clearUser
} = userSlice.actions;

export default userSlice.reducer;
