import axios from '@/config/axios.customize'

export const fetchListRoleAPI = async ({ current, pageSize }: { current: number, pageSize: number }) => {
  const url = `/api/v1/roles?current=${current <= 0 ? current + 1 : current}&pageSize=${pageSize}&populate=permissions&fields=name,description,isActive,permissions.name,permissions.apiPath,permissions.method,permissions.module`
  return axios.get<IBackendResponse<IResponseList<IRole[]>>>(url)
}
