import { UpdateRelationStatus } from "@/schemas/relation/relation.schema";
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

export const updateRelationShip = createAsyncThunk(
  "relationShip/update",
  async (
    { relationId, status }: { relationId: string; status: UpdateRelationStatus },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/relationship/${relationId}`,
        { status: status }
      );
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || "An error occurred while creating the user"
      );
    }
  }
);
