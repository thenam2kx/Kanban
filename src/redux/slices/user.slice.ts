import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IState {
  openModalUpdate: boolean
  userId: string
  isLoading: boolean
  detailUser: IUser | null
  listUsers: IUser[]
  listPaginate: {
    page: number,
    pageSize: number
  }
  listUserMeta: {
    current: number
    pages: number
    pageSize: number
    total: number
  }
}

const initialState: IState = {
  openModalUpdate: false,
  userId: '',
  isLoading: false,
  detailUser: null,
  listUsers: [],
  listPaginate: {
    page: 0,
    pageSize: 10
  },
  listUserMeta: {
    current: 1,
    pages: 0,
    pageSize: 10,
    total: 0
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setOpenModalUpdate: (state, action: PayloadAction<boolean>) => {
      state.openModalUpdate = action.payload
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    setListPaginate: (state, action: PayloadAction<{ page: number, pageSize: number }>) => {
      state.listPaginate = action.payload
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    }
  }
})

export const { setOpenModalUpdate, setUserId, setListPaginate, setIsLoading } = userSlice.actions

export default userSlice.reducer
