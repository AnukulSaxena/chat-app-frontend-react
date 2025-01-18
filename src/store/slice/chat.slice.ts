import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { Chat } from "@/schemas/chat/chat.schema";
import { getUserChats } from "../action/chat.action";

export interface ChatState {
  chats: Chat[];
  totalPages: number
}

const initialState: ChatState = {
    chats: [],
  totalPages: 0
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getUserChats.fulfilled,
        (state, action) => {
          state.chats = action.payload.data;
        }
      )
      .addCase(getUserChats.rejected, (_, action) => {
        if(typeof action.payload === "string")
          toast(action.payload);
        else
          toast("Uh oh! Something went wrong.");
      });
  },
});

// Action creators are generated for each case reducer function
export const {} = chatSlice.actions;

export default chatSlice.reducer;
