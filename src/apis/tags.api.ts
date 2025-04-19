import axios from '@/config/axios.customize'

export const fetchListTagsAPI = async () => {
  const url = '/api/v1/tags'
  return axios.get<IBackendResponse<IResponseList<ITags>>>(url)
}
