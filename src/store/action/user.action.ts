import { FetchUsersResponseSchema, LoginResponseSchema, User } from "@/schemas";
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
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/user");

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
      const response = await axios.post(
        "http://localhost:5000/user/login",
        payload
      );

      return LoginResponseSchema.parse(response.data);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        console.error("Validation Error:", error.errors);
        return rejectWithValue("Invalid data format received from API.");
      }
      return rejectWithValue(
        error?.response?.data?.message || "An error occurred while fetching the users"
      );
    }
  }
);
