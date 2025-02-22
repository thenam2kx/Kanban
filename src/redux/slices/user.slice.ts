import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IState {
  openDrawerEdit: boolean
  userId: string
}

const initialState: IState = {
  openDrawerEdit: false,
  userId: ''
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setOpenDrawerEdit: (state, action: PayloadAction<boolean>) => {
      state.openDrawerEdit = action.payload
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    }
  }
})

export const { setOpenDrawerEdit, setUserId } = userSlice.actions

export default userSlice.reducer
