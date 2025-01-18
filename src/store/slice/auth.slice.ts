import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoggedInUser, User } from "@/schemas";
import { loginUser } from "../action/user.action";
import { toast } from "sonner";

export interface UserState {
  userData: LoggedInUser | null;
  refreshToken: String | null;
  sessionId: String | null;
  accessToken: String | null;
}

const initialState: UserState = {
  userData: null,
  refreshToken: null,
  sessionId: null,
  accessToken: null,
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
      state.userData = null;
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
      });
  },
});

// Action creators are generated for each case reducer function
export const { setUserData, logout } = authSlice.actions;

export default authSlice.reducer;
