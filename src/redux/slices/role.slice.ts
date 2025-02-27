import { fetchListRoleAPI } from '@/apis/role.api'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'

interface IState {
  roles: IRole[]
  isLoadingRole: boolean
  listRoles: IRole[]
  metaRole: IMeta
  currentPaginateRole: {
    page: number
    pageSize: number
  }
}

const initialState: IState = {
  roles: [],
  isLoadingRole: false,
  listRoles: [],
  currentPaginateRole: {
    page: 1,
    pageSize: 10
  },
  metaRole: {
    current: 1,
    pages: 0,
    pageSize: 10,
    total: 0
  }
}

export const fetchListRoles = createAsyncThunk<IResponseList<IRole>, { current: number, pageSize: number }>(
  'role/fetchListRoles',
  async ({ current, pageSize }, { rejectWithValue }) => {
    try {
      const response = await fetchListRoleAPI({ current, pageSize })
      if (response.data) {
        return response.data as unknown as IResponseList<IRole>
      } else {
        throw new Error('No data received from API')
      }
    } catch (error) {
      const axiosError = error as AxiosError
      // return rejectWithValue(error.response?.data || error.message)
      return rejectWithValue(axiosError.response?.data || axiosError.message)
    }
  }
)

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRoles: (state, action: PayloadAction<IRole[]>) => {
      state.roles = action.payload
    },
    setIsLoadingRole: (state, action: PayloadAction<boolean>) => {
      state.isLoadingRole = action.payload
    },
    setCurrentPaginateRole: (state, action: PayloadAction<{ page: number, pageSize: number }>) => {
      state.currentPaginateRole = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchListRoles.pending, (state) => {
      state.isLoadingRole = true
    })
    builder.addCase(fetchListRoles.fulfilled, (state, action: { payload: IResponseList<IRole> } ) => {
      state.isLoadingRole = false
      state.listRoles = action.payload.result
      state.metaRole = action.payload.meta
    })
    builder.addCase(fetchListRoles.rejected, (state) => {
      state.isLoadingRole = false
    })
  }
})

export const { setRoles, setIsLoadingRole, setCurrentPaginateRole } = roleSlice.actions

export default roleSlice.reducer
