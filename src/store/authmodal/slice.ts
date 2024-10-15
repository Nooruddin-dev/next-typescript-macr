import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // signInModal: false,
  signInModal: { visible: false, modeConfirmation: false },
  signUpModal: false,
  existingArgaamUsermodal: { visible: false, isPlusUser: false },
  requestTrialModal: false,
  forgotPasswordModal: false,
  requestRedirectModal: false,
  trialStatus: {visible:false, status: 0}
};

export const modalSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setSignInModal: (state, action) => {
      state.signInModal = action.payload;
    },
    setSignUpModal: (state, action) => {
      state.signUpModal = action.payload;
    },
    setexistingArgaamUsermodal: (state, action) => {
      state.existingArgaamUsermodal = action.payload;
    },
    setrequestTrialModal: (state, action) => {
      state.requestTrialModal = action.payload;
    },
    setforgortPasswordModal: (state, action) => {
      state.forgotPasswordModal = action.payload;
    },
    settrialStatusModal: (state, action) => {
      state.trialStatus = action.payload;
    },
    setrequestRedirectModal: (state, action) => {
      state.requestRedirectModal = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
// export const { setCompaniesList , setSelectedCompany ,setCompanyPeers} = homeSlice.actions
export const {
  setSignInModal,
  setSignUpModal,
  setexistingArgaamUsermodal,
  setrequestTrialModal,
  setforgortPasswordModal,
  settrialStatusModal,
  setrequestRedirectModal
} = modalSlice.actions;

export default modalSlice.reducer;
