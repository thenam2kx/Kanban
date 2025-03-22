import axios from '@/config/axios.customize'

export const uploadImageAPI = async (file: File, folderDir: string) => {
  const url = '/api/v1/files/upload'
  return axios.post<IBackendResponse<IResponseList<ICategory[]>>>(
    url,
    { fileUpload: file },
    { headers: { 'folder_type': folderDir } }
  )
}
