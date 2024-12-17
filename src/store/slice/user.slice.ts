import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createuser } from '../action/user.action';

export interface UserState {
  userData: { usreName: string; password: string }[]
}

const initialState: UserState = {
  userData: []
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers:(builder) => {

    builder.addCase(createuser.fulfilled, (state, action) => {
        state.userData.push(action.payload.data)
        console.log( 'sdf ---> ',action.payload.message)
    })
  }
})

// Action creators are generated for each case reducer function
export const {  } = userSlice.actions

export default userSlice.reducer