import axios from '@/config/axios.customize'

export const fetchListTagsAPI = async ({ current = 1, pageSize = 5 }: { current?: number, pageSize?: number }) => {
  const url = `/api/v1/tags?current=${current}&pageSize=${pageSize}`
  return axios.get<IBackendResponse<IResponseList<ITags>>>(url)
}

export const fetchInfoTagsAPI = async (id: string) => {
  const url = `/api/v1/tags/${id}`
  return axios.get<IBackendResponse<ITags>>(url)
}

export const createTagsAPI = async (data: IFormTags) => {
  const url = '/api/v1/tags'
  return axios.post<IBackendResponse<ITags>>(url, { ...data })
}

export const updateTagsAPI = async (id: string, data: IFormTags) => {
  const url = `/api/v1/tags/${id}`
  return axios.patch<IBackendResponse<ITags>>(url, { ...data })
}

export const deleteTagsAPI = async (id: string) => {
  const url = `/api/v1/tags/${id}`
  return axios.delete<IBackendResponse<ITags>>(url)
}

