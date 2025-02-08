import { Route, Routes } from "react-router"
import Layout from "../layout"
import SigninPage from "@/pages/auth/signin/signin.page"
import SignupPage from "@/pages/auth/signup/signup.page"
import VerifyPage from "@/pages/auth/verify/verify.page"
import ForgotPasswordPage from "@/pages/auth/forgotPassword/forgot.password.page"
import VerifyPasswordPage from "@/pages/auth/forgotPassword/verify.password.page"
import ChangePasswordPage from "@/pages/auth/forgotPassword/change.password.page"


const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-account" element={<VerifyPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-password" element={<VerifyPasswordPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
    </Routes>
  )
}

export default Routers