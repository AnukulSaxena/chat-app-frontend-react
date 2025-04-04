import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { Chat } from "@/schemas/chat/chat.schema";
import { getChatMessages, getUserChats } from "../action/chat.action";
import { Message } from "@/schemas/message/message.schema";

export interface ChatState {
  chats: Chat[];
  totalPages: number;
  activeChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  totalPages: 0,
  activeChat: null,
  messages: [],
  loading: false,
  error: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChats: (state) => {
      state.chats = [];
    },
    setActiveChat: (state, action: PayloadAction<Chat>) => {
      state.activeChat = action.payload;
    },
    handleMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      const index = state.chats.findIndex((chat) => chat._id === message.chat);

      if (index >= 0) {
        const chat = state.chats[index];
        chat.lastMessage = message.text;

        state.chats = [
          ...state.chats.slice(0, index),
          { ...chat },
          ...state.chats.slice(index + 1),
        ];
      }

      if (state.activeChat?._id === message.chat) {
        const pendingMessageIndex = [...state.messages].findIndex(
          (msg) => msg.timeStamp === message.timeStamp
        );
        console.log("peesd", pendingMessageIndex)
        if (pendingMessageIndex !== -1) {
          const updatedMessages = [...state.messages];
          updatedMessages[pendingMessageIndex] = {
            ...message, 
            timeStamp: undefined
          };
          state.messages = updatedMessages;
        }
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },

    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages = [...state.messages, action.payload];
    },
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
      })
      .addCase(getChatMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action.payload;
        state.messages = data;
      })
      .addCase(
        getChatMessages.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

// Action creators are generated for each case reducer function
export const { clearChats, setActiveChat, clearMessages, handleMessage, addMessage } = chatSlice.actions;

export default chatSlice.reducer;
