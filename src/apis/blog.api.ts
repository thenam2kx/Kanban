import axios from '@/config/axios.customize'

export const fetchListBlogAPI = async () => {
  const url = '/api/v1/blogs?current=1&pageSize=10&sort=-createdAt&populate=tags,author&fields=tags.name,author.fullname'
  return axios.get<IBackendResponse<IResponseList<IBlog>>>(url)
}

export const fetchInfoBlogAPI = async (id: string) => {
  const url = `/api/v1/blogs/${id}`
  return axios.get<IBackendResponse<IBlog>>(url)
}

export const createBlogAPI = async (formData: IBlogFormData) => {
  const url = '/api/v1/blogs'
  return axios.post<IBackendResponse<IResponseList<IBlog>>>(url, { ...formData })
}

export const updateBlogAPI = async (formData: IBlogFormData, id: string) => {
  const url = `/api/v1/blogs/${id}`
  return axios.patch<IBackendResponse<IBlog>>(url, { ...formData })
}

export const deleteBlogAPI = async (id: string) => {
  const url = `/api/v1/blogs/${id}`
  return axios.delete<IBackendResponse<IBlog>>(url)
}
