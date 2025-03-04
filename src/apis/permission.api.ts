import axios from '@/config/axios.customize'

export const fetchListPermissionsAPI = async () => {
  const url = '/api/v1/permissions?current=1&pageSize=100'
  return axios.get<IBackendResponse<IResponseList<IPermissionsGroup[]>>>(url)
}
