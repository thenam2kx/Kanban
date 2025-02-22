import axios from '@/config/axios.customize'

export const signinAPI = async (data: ISignin) => {
  const url = '/api/v1/auth/signin'
  return axios.post<IBackendResponse<ISigninResponse>>(url, {
    username: data.username,
    password: data.password
  })
}

export const signupAPI = async (data: ISignup) => {
  const url = '/api/v1/auth/signup'
  return axios.post<IBackendResponse<ISigninResponse>>(url, {
    fullname: data.fullname,
    email: data.email,
    password: data.password
  })
}

export const verifyAccountAPI = async (email: string, code: string) => {
  const url = '/api/v1/auth/verify-email'
  return axios.post<IBackendResponse<ISigninResponse>>(url, { email, code })
}

export const reSendEmailAPI = async (email: string) => {
  const url = '/api/v1/auth/resend-email'
  return axios.post<IBackendResponse<ISigninResponse>>(url, { email })
}

export const sendForgotPasswordAPI = async (email: string) => {
  const url = '/api/v1/auth/forgot-password'
  return axios.post<IBackendResponse<ISigninResponse>>(url, { email })
}

export const verifyPasswordAPI = async (email: string, code: string) => {
  const url = '/api/v1/auth/verify-forgot-password'
  return axios.post<IBackendResponse<ISigninResponse>>(url, { email, code })
}

export const reSendVerifyPasswordAPI = async (email: string, code: string) => {
  const url = '/api/v1/auth/verify-forgot-password'
  return axios.post<IBackendResponse<ISigninResponse>>(url, { email, code })
}

export const changeForgotPasswordAPI = async (email: string, password: string) => {
  const url = '/api/v1/auth/change-forgot-password'
  return axios.post<IBackendResponse<ISigninResponse>>(url, { email, password })
}
