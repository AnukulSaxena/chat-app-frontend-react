import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import { createuser, fetchUsers } from "../action/user.action";
import { toast } from "sonner";
import { User } from "@/schemas";

export interface UserState {
  users: User[];
  totalPages: number
}

const initialState: UserState = {
  users: [],
  totalPages: 0
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createuser.fulfilled, () => {
        toast("Event has been created.");
      })
      .addCase(createuser.rejected, () => {
        toast("Uh oh! Something went wrong.");
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action) => {
          state.users = action.payload.data.users;
          state.totalPages = action.payload.data.pagination.totalPages;
        }
      )
      .addCase(fetchUsers.rejected, (_, action) => {
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
