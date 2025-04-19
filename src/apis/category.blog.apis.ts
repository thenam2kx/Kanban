import axios from '@/config/axios.customize'

export const fetchListCategoriesBlogAPI = async () => {
  const url = '/api/v1/categories-blogs?current=1&pageSize=10&sort=-createdAt'
  return axios.get<IBackendResponse<IResponseList<ICategoriesBlogs>>>(url)
}