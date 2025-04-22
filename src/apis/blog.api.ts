import axios from '@/config/axios.customize'
import { IParamsSearch } from '@/pages/blogs/blogs.page'

export const fetchListBlogAPI = async (
  { current = 1, pageSize = 5, paramsSearch }:
  { current?: number, pageSize?: number, paramsSearch: IParamsSearch }
) => {
  const url = `/api/v1/blogs?current=${current}&pageSize=${pageSize}&sort=-createdAt&populate=tags,author,categories&fields=tags.name,author.fullname,categories.name&title=/${paramsSearch?.search || ''}/i&tags=${paramsSearch?.tags.join(', ') || ''}&categories=${paramsSearch?.categories.join(', ') || ''}&isPublic=${paramsSearch?.status || ''}`
  console.log('🚀 ~ url:', url)
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
