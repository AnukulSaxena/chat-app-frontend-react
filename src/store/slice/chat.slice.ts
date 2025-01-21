import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { Chat } from "@/schemas/chat/chat.schema";
import { getUserChats } from "../action/chat.action";

export interface ChatState {
  chats: Chat[];
  totalPages: number;
  activeChat: Chat | null;
}

const initialState: ChatState = {
  chats: [],
  totalPages: 0,
  activeChat: null
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChats: (state) => {
      state.chats = [];
    },
    setActiveChat: (state,action: PayloadAction<Chat>) => {
      state.activeChat = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserChats.fulfilled, (state, action) => {
        const filteredData = action.payload.data.map((chat) => {
          chat.users = chat.users.filter(
            (user) => user._id !== action.payload.userId
          );
          return chat;
        });
        state.chats = filteredData;
      })
      .addCase(getUserChats.rejected, (_, action) => {
        if (typeof action.payload === "string") toast(action.payload);
        else toast("Uh oh! Something went wrong.");
      });
  },
});

// Action creators are generated for each case reducer function
export const { clearChats, setActiveChat } = chatSlice.actions;

export default chatSlice.reducer;
