import { FetchUsersResponseSchema, LoginResponseSchema, User } from "@/schemas";
import api from "@/utils/interceptor";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { z } from "zod";

export const createuser = createAsyncThunk(
  "users/create",
  async (data: { userName: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/user", data);
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || "An error occurred while creating the user"
      );
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "users/fetch",
  async (ownerId: string, { rejectWithValue }) => {
    try {
      const response = await api.get("/user", { params: { ownerId } });

      // Validate and parse the response
      return FetchUsersResponseSchema.parse(response.data); // Return validated data
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        console.error("Validation Error:", error.errors);
        return rejectWithValue("Invalid data format received from API.");
      }

      return rejectWithValue(
        error?.response?.data || "An error occurred while fetching the users"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "users/login",
  async (payload: User, { rejectWithValue }) => {
    try {
      const response = await api.post(`/user/login`, payload);
      console.log("res ---> ", response.data);
      return LoginResponseSchema.parse(response.data);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        console.error("Validation Error:", error.errors);
        return rejectWithValue("Invalid data format received from API.");
      }
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the users"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "users/logout",
  async ({userName, sessionId}: {userName: String, sessionId: String}, { rejectWithValue }) => {

    try {
      await api.post(`/user/logout`, {
        sessionId,
        userName
      });
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the users"
      );
    }
  }
);
