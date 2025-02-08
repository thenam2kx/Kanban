import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import theme from '@/themes/theme.ts';
import { BrowserRouter } from "react-router";
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
