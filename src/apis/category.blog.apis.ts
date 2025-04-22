import axios from '@/config/axios.customize'

export const fetchListCategoriesBlogAPI = async () => {
  const url = '/api/v1/categories-blogs?current=1&pageSize=10&sort=-createdAt'
  return axios.get<IBackendResponse<IResponseList<ICategoriesBlogs>>>(url)
}

export const fetchInfoCategoriesBlogAPI = async (id: string) => {
  const url = `/api/v1/categories-blogs/${id}`
  return axios.get<IBackendResponse<ICategoriesBlogs>>(url)
}

export const createCategoriesBlogAPI = async (formData: ICategoryBlogsForm) => {
  const url = '/api/v1/categories-blogs'
  return axios.post<IBackendResponse<ICategoriesBlogs>>(url, { ...formData })
}

export const updateCategoriesBlogAPI = async (formData: ICategoriesBlogs, id: string) => {
  const url = `/api/v1/categories-blogs/${id}`
  return axios.patch<IBackendResponse<ICategoriesBlogs>>(url, { ...formData })
}

export const deleteCategoriesBlogAPI = async (id: string) => {
  const url = `/api/v1/categories-blogs/${id}`
  return axios.delete<IBackendResponse<IResponseList<ICategoriesBlogs>>>(url)
}