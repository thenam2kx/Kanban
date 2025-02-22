import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IState {
  roles: IRole[]
}

const initialState: IState = {
  roles: []
}

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRoles: (state, action: PayloadAction<IRole[]>) => {
      state.roles = action.payload
    }
  }
})

export const { setRoles } = roleSlice.actions

export default roleSlice.reducer
