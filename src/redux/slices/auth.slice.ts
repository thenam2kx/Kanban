import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

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

export const fetchAccount = createAsyncThunk(
  'auth/fetchAccount',
  async () => {
    // const response = await axios.get('http://localhost:8080/api/v1/auth/account', {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json',
    //     Authorization: accessToken ? `Bearer ${accessToken}` : ''
    //   }
    // })
    // console.log('🚀 ~ accessToken:', accessToken)
    // console.log('🚀 ~ response:', response)
    // return response.data
  }
)

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccount.pending, (state) => {
        state.isLoading = true
        // state.isAuthenticated = false
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload ?? null
      })
      .addCase(fetchAccount.rejected, (state) => {
        state.isLoading = false
        // state.isAuthenticated = false
      })
  }
})

export const { signin, signout, setRefreshToken, setAccessToken } = authSlice.actions

export default authSlice.reducer
