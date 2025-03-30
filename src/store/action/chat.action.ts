import { getChatSchema } from "@/schemas/chat/chat.schema";
import { messageResponseSchema } from "@/schemas/message/message.schema";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const createSingleChat = createAsyncThunk(
    "chat/create",
    async (
      users: { fromUserId: string; toUserId: string },
      { rejectWithValue , }
    ) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/chat",
          users
        );
        return response?.data;
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data || "An error occurred while creating the user"
        );
      }
    }
  );


export const getUserChats = createAsyncThunk(
    "chat/getUserChats",
    async (
      userId: string,
      { rejectWithValue }
    ) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/chat/${userId}`
        );
        const parsedData = getChatSchema.parse(response?.data);
        return {data : parsedData.data, userId};
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data || "An error occurred while fetching the user"
        );
      }
    }
  );


  export const getChatMessages = createAsyncThunk(
    "chat/getChatMessages",
    async (chatId: string, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/message/chat/${chatId}`
        );
        const parsedData = messageResponseSchema.parse(response?.data);
        return parsedData;
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data || "An error occurred while fetching the user"
        );
      }
    }
  );