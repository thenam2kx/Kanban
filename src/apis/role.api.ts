import axios from '@/config/axios.customize'

export const fetchListRoleAPI = async ({ current, pageSize }: { current: number, pageSize: number }) => {
  const url = `/api/v1/roles?current=${current <= 0 ? current + 1 : current}&pageSize=${pageSize}&populate=permissions&fields=name,description,isActive,permissions.name,permissions.apiPath,permissions.method,permissions.module`
  return axios.get<IBackendResponse<IResponseList<IRole[]>>>(url)
}

export const fetchRoleAPI = async (id: string) => {
  const url = `/api/v1/roles/${id}`
  return axios.get<IBackendResponse<IRole>>(url)
}

export const createRoleAPI = async (data: { name: string; description: string; isActive: boolean; permissions: string[] }) => {
  const url = '/api/v1/roles'
  return axios.post<IBackendResponse<IRole>>(url, { ...data })
}

export const updateRoleAPI = async (id: string, data: { name: string; description: string; isActive: boolean; permissions: string[] }) => {
  const url = `/api/v1/roles/${id}`
  return axios.patch<IBackendResponse<IRole>>(url, { ...data })
}

export const deleteRoleAPI = async (roleId: string) => {
  const url = `/api/v1/roles/${roleId}`
  return axios.delete<IBackendResponse<IRole>>(url)
}
