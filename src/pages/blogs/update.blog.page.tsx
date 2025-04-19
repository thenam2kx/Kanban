import { useMutation, useQuery } from '@tanstack/react-query'
import { message } from 'antd'
import { useNavigate, useParams } from 'react-router'
import FormBlog from './form.blog'
import { fetchInfoBlogAPI, updateBlogAPI } from '@/apis/blog.api'


const UpdateBlogPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const { data: infoBlogs } = useQuery({
    queryKey: ['fetch-info-blogs'],
    queryFn: async () => {
      const res = await fetchInfoBlogAPI(id as string)
      if (res.data) {
        return res.data
      } else {
        throw new Error('Lấy thông tin bài viết thất bại!')
      }
    }
  })

  const handleUpdateBlogs = useMutation({
    mutationFn: async (values: IBlogFormData) => {
      const res = await updateBlogAPI(values, id as string)
      if (res.data) {
        message.success('Cập nhật thành công!')
        navigate('/blogs')
      } else {
        throw new Error('Câp nhật thất bại')
      }
    },
    onError: (error) => {
      message.error(error.message || 'Câp nhật thất bại')
    }
  })

  const handleSubmit = async (values: IBlogFormData) => {
    handleUpdateBlogs.mutate(values)
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Cập nhật bài viết</h1>
        <p className='text-gray-500'>Cập nhật bài viết</p>
      </div>

      {infoBlogs && (
        <FormBlog handleSubmit={handleSubmit} isLoading={handleUpdateBlogs.isPending} initialValues={infoBlogs as unknown as IBlogFormData} />
      )}
    </div>
  )
}

export default UpdateBlogPage
