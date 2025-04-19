import axios from 'axios'
import customAxios from '@/config/axios.customize'

export const uploadImageAPI = async (file: File, folderDir: string) => {
  const url = '/api/v1/files/upload'
  return customAxios.post<IBackendResponse<IResponseList<ICategory[]>>>(
    url,
    { fileUpload: file },
    { headers: { 'folder_type': folderDir } }
  )
}

export const uploadImageCloudinaryAPI = async (formdata: FormData) => {
  const endpoint = 'https://api.cloudinary.com/v1_1/dgomdpkze/image/upload'
  return axios.post(endpoint, formdata)
}
