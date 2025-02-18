import { getUserAPI } from '@/apis/user.api'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// export const fetchAccount = createAsyncThunk(
//   'account/fetchAccount',
//   async () => {
//     const response = await getUserAPI()
//     console.log('🚀 ~ response:', response)
//     return response.data
//   }
// )

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  isRefreshToken: boolean
  errorRefreshToken: string | null
  accessToken: string | null
  user: IUserAuth | null
}


interface ISigninAuth {
  user: IUserAuth
  accessToken: string
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  isRefreshToken: false,
  errorRefreshToken: null,
  accessToken: null,
  user: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signin: (state, action: PayloadAction<ISigninAuth>) => {
      const { user, accessToken } = action.payload
      state.user = user
      state.isAuthenticated = true
      state.accessToken = accessToken
    },

    signout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.accessToken = null
    },

    setAccessToken : (state, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload?.accessToken ?? ''
    },

    setRefreshToken: (state, action: PayloadAction<{ status: boolean, message: string }>) => {
      state.isRefreshToken = action.payload?.status ?? false
      state.errorRefreshToken = action.payload?.message ?? ''
    }
  }
})

export const { signin, signout, setRefreshToken, setAccessToken } = authSlice.actions

export default authSlice.reducer
