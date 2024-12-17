import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const createuser = createAsyncThunk(
    'users/create',
    async (data: {userName: string, password: string}, thunkAPI) => {
      const response = await axios.post('http://localhost:3000/users', data)
      return response?.data
    },
  )