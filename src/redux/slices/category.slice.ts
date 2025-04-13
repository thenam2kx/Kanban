import { createSlice } from '@reduxjs/toolkit'

interface IState {
  name: string
}

const initialState: IState = {
  name: 'category'
}


const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {}
})

// export const {} = roleSlice.actions

export default roleSlice.reducer
