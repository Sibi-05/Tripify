import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openEditTripModal:false,
  editProfileModalOpen: false,
  editTripId:null
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    editProfileModalOpen: (state) => {
      state.editProfileModalOpen = true;
    },
    closeEditProfileModal: (state) => {
      state.editProfileModalOpen = false;
    },
    openEditTripModal: (state,action) => {
      state.openEditTripModal = true;
      state.editTripId=action.payload;
    },
    closeEditTripModal: (state) => {
      state.openEditTripModal = false;
      state.editTripId=null;
    },
    

  },
});

export const uiSliceActions = uiSlice.actions;

export default uiSlice.reducer;