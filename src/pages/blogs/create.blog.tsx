import { message } from 'antd'
import FormBlog from './form.blog'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { createBlogAPI } from '@/apis/blog.api'

const CreateBlog = () => {
  const navigate = useNavigate()

  const handleCreateBlogs = useMutation({
    mutationFn: async (values: IBlogFormData) => {
      const res = await createBlogAPI(values)
      if (res.data) {
        message.success('Blog post created successfully!')
        navigate('/blogs')
      } else {
        throw new Error('Failed to create blog post')
      }
    },
    onError: (error) => {
      message.error(error.message || 'Failed to create blog post')
    }
  })

  const handleSubmit = async (values: IBlogFormData) => {
    const formatValue = {
      ...values,
      coverImage: values.coverImage?.length ? values.coverImage : ''
    }
    handleCreateBlogs.mutate(formatValue)
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Thêm bài đăng mới</h1>
        <p className='text-gray-500'>Tạo và xuất bản bài viết mới</p>
      </div>

      <FormBlog handleSubmit={handleSubmit} isLoading={handleCreateBlogs.isPending} />
    </div>
  )
}

export default CreateBlog
