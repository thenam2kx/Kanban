import axios from '@/config/axios.customize'

export const signinAPI = async (data: ISignin) => {
  const url = '/api/v1/auth/signin'
  return axios.post<IBackendResponse<ISigninResponse>>(url, {
    username: data.username,
    password: data.password
  })
}
