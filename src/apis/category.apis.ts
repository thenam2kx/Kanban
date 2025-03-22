import axios from '@/config/axios.customize'

export const fetchListCategoryAPI = async ({ current, pageSize }: { current: number, pageSize: number }) => {
  const url = `/api/v1/categories?current=${current}&pageSize=${pageSize}`
  return axios.get<IBackendResponse<IResponseList<ICategory[]>>>(url)
}

export const fetchInfoCategoryAPI = async (categoryId: string) => {
  const url = `/api/v1/categories/${categoryId}`
  return axios.get<IBackendResponse<ICategory>>(url)
}

export const createCategoryAPI = async (data: ICategoryFormData) => {
  const url = '/api/v1/categories'
  return axios.post<IBackendResponse<ICategory>>(url, { ...data })
}

export const updateCategoryAPI = async (data: ICategoryFormData, _id: string) => {
  const url = `/api/v1/categories/${_id}`
  return axios.patch<IBackendResponse<ICategory>>(url, { ...data })
}

export const deleteCategoryAPI = async (categoryId: string) => {
  const url = `/api/v1/categories/${categoryId}`
  return axios.delete<IBackendResponse<ICategory>>(url)
}
