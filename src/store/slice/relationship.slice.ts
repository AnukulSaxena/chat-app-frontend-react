import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { createRelationship } from "../action/relationship.action";

export interface UserState {
  isRequestSent: boolean;
}

const initialState: UserState = {
  isRequestSent: false,
};

export const relationShipSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    resetRelationship: (state) => {
      state.isRequestSent = false;
    }
  },

  extraReducers: (builder) => {
   builder.addCase(createRelationship.pending, (state) => {
     state.isRequestSent = false;
   })
   .addCase(createRelationship.fulfilled, (state) => {
     state.isRequestSent = true;
     toast("Relationship has been created.");
   })
   .addCase(createRelationship.rejected, (state) => {
     state.isRequestSent = false;
     toast("Uh oh! Something went wrong.");
   });
  },
});

// Action creators are generated for each case reducer function
export const {   } = relationShipSlice.actions;

export default relationShipSlice.reducer;
