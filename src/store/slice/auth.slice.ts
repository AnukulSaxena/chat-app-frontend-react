import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoggedInUser, User } from "@/schemas";
import { loginUser, logoutUser } from "../action/user.action";
import { toast } from "sonner";

export interface UserState {
  userData: LoggedInUser | null;
  refreshToken: string | null;
  sessionId: string | null;
  accessToken: string | null;
}

const initialState: UserState = {
  userData: null,
  refreshToken: null,
  sessionId: null,
  accessToken: null,

};

// Centralized reset function
const resetState = (state: UserState): void => {
  state.userData = null;
  state.accessToken = null;
  state.refreshToken = null;
  state.sessionId = null;
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
      state.userData = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<{refreshToken: string, accessToken: string}>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logout: (state) => {
      resetState(state);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action): void => {
        state.userData = action.payload.data.user;
        state.refreshToken = action.payload.data.refreshToken;
        state.sessionId = action.payload.data.sessionId;
        state.accessToken = action.payload.data.accessToken;
        toast(action.payload.message);
      })
      .addCase(loginUser.rejected, (_, action) => {
        if (typeof action.payload === "string") toast(action.payload);
        else toast("Uh oh! Something went wrong.");
      })
      .addCase(logoutUser.pending, (state): void => {
        resetState(state);
        toast("User Logged Out Successfully");
      });
  },
});

// Action creators are generated for each case reducer function
export const { setUserData, logout, setAccessToken } = authSlice.actions;

export default authSlice.reducer;
