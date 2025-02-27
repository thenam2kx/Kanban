import axios from '@/config/axios.customize'

export const getAccountAPI = async () => {
  const url = '/api/v1/auth/account'
  return axios.get<IBackendResponse<IUserAccount>>(url)
}

export const fetchListUserAPI = async ({ current, pageSize }: { current: number, pageSize: number }) => {
  const url = `/api/v1/users?current=${current}&pageSize=${pageSize}&populate=role&fields=name,role.name`
  return axios.get<IBackendResponse<IUser[]>>(url)
}

export const fetchInfoUserAPI = async (customerId: string) => {
  const url = `/api/v1/users/${customerId}`
  return axios.get<IBackendResponse<IUser>>(url)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateUserAPI = async ({ userId, dataUpdate }: { userId: string, dataUpdate: any }) => {
  const url = `/api/v1/users/${userId}`
  return axios.patch<IBackendResponse<IUser>>(url, { ...dataUpdate })
}

export const deleteUserAPI = async (userId: string) => {
  const url = `/api/v1/users/${userId}`
  return axios.delete<IBackendResponse<IUser>>(url)
}
