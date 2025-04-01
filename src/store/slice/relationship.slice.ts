import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { createRelationship, getFriends } from "../action/relationship.action";
import { FriendsDetails } from "@/schemas/relation/relation.schema";

export interface UserState {
  isRequestSent: boolean;
  friends: FriendsDetails[];
}

const initialState: UserState = {
  isRequestSent: false,
  friends: []
};

export const relationShipSlice = createSlice({
  name: "relation",
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
   }).addCase(getFriends.fulfilled, (state, action) => {
    state.friends = action.payload;
   })
  },
});

// Action creators are generated for each case reducer function
export const {   } = relationShipSlice.actions;

export default relationShipSlice.reducer;
