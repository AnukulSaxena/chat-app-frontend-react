import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createuser = createAsyncThunk(
  "users/create",
  async (data: { userName: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/user", data);
      return response?.data; // Return the data if the request is successful
    } catch (error: any) {
      // Handle errors and provide meaningful feedback
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
      return response?.data; // Return the data if the request is successful
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || "An error occurred while creating the user"
      );
    }
  }
);
