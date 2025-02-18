import axios from '@/config/axios.customize'

export const getUserAPI = async () => {
  const url = '/api/v1/auth/account'
  return axios.get<IBackendResponse<IUserAccount>>(url)
}
