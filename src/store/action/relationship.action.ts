import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createRelationship = createAsyncThunk(
  "relationShip/create",
  async (
    relationInfo: { fromUserId: string; toUserId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/relationship",
        relationInfo
      );
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || "An error occurred while creating the user"
      );
    }
  }
);
