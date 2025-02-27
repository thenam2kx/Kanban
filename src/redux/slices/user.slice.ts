import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchInfoUserAPI, fetchListUserAPI } from '@/apis/user.api'

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

interface IUserListResponse {
  result: IUser[];
  meta: IMeta;
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

export const fetchListUsers = createAsyncThunk<IUserListResponse, { current: number, pageSize: number }>(
  'user/fetchListUsers',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async (params: { current: number, pageSize: number }) => {
    try {
      const response = await fetchListUserAPI(params)
      return response.data
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('🚀 ~ fetchListUsers ~ error:', error)
    }
  }
)

export const fetchDetailUser = createAsyncThunk(
  'user/fetchDetailUser',
  async (params: { userId: string }) => {
    try {
      const response = await fetchInfoUserAPI(params.userId)
      return response.data
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('🚀 ~ fetchListUsers ~ error:', error)
    }
  }
)

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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchListUsers.fulfilled, (state, action: { payload: IUserListResponse }) => {
      state.listUsers = action?.payload?.result || []
      state.listUserMeta = {
        current: action?.payload?.meta?.current || 1,
        pages: action?.payload?.meta?.pages || 0,
        pageSize: action?.payload?.meta?.pageSize || 10,
        total: action?.payload?.meta?.total || 0
      }
    })
    builder.addCase(fetchDetailUser.fulfilled, (state, action) => {
      state.detailUser = action?.payload || null
    })
  }
})

export const { setOpenModalUpdate, setUserId, setListPaginate, setIsLoading } = userSlice.actions

export default userSlice.reducer
