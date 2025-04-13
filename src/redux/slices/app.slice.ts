import { createSlice } from '@reduxjs/toolkit'

interface IState {
  isOpenSidebar: boolean
  isDarkMode: boolean
  themeMode: string
}

const initialState: IState = {
  isOpenSidebar: true,
  isDarkMode: false,
  themeMode: 'light'
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setStateSidebar: (state) => {
      state.isOpenSidebar = !state.isOpenSidebar
    },
    setIsDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode
    },
    setStateThemeMode: (state, payload) => {
      state.themeMode = payload.payload
    }
  }
})

export const { setStateSidebar, setIsDarkMode, setStateThemeMode } = appSlice.actions

export default appSlice.reducer
