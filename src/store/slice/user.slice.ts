import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import { createuser, fetchUsers } from "../action/user.action";
import { toast } from "sonner";
import { User } from "@/schemas";

export interface UserState {
  users: User[];
}

const initialState: UserState = {
  users: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createuser.fulfilled, (_, action) => {
        // state.userData.push(action.payload.data);
        toast("Event has been created.");
        console.log("sdf ---> ", action.payload.message);
      })
      .addCase(createuser.rejected, (_, action) => {
        console.log("sdf ---> ", action.payload);
        toast("Uh oh! Something went wrong.");
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action) => {
          state.users = action.payload.data;
          console.log("sdf ---> ", action.payload.data);
        }
      )
      .addCase(fetchUsers.rejected, (_, action) => {
        console.log("sdf ---> ", action.payload);
        if(typeof action.payload === "string")
          toast(action.payload);
        else
          toast("Uh oh! Something went wrong.");
      });
  },
});

// Action creators are generated for each case reducer function
export const {} = userSlice.actions;

export default userSlice.reducer;
