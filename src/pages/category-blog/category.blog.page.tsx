
import { useState } from 'react'
import { Table, Button, Input, Form, message, Popconfirm, Space, Tooltip } from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import type { UploadProps } from 'antd'
import FormCategoriesBlogs from './form.category.blog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createCategoriesBlogAPI, fetchListCategoriesBlogAPI } from '@/apis/category.blog.apis'
import { ColumnsType } from 'antd/es/table'


const CategoryBlogPage = () => {
  const [searchText, setSearchText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ICategoriesBlogs | null>(null)
  const [form] = Form.useForm()

  const { data: listCategoriesBlog, isLoading } = useQuery({
    queryKey: ['fetch-list-categories'],
    queryFn: async () => {
      const res = await fetchListCategoriesBlogAPI()
      if (res.data) {
        return res.data.result
      } else {
        throw new Error('Lấy danh sách danh mục thất bại')
      }
    }
  })

  const createCategoryBlog = useMutation({
    mutationFn: async (values: ICategoryBlogsForm) => {
      const res = await createCategoriesBlogAPI(values)
      if (res.data) {
        setIsModalOpen(false)
        form.resetFields()
        message.success('Thêm danh mục thành công!')
        return res.data
      } else {
        throw new Error('Thêm danh mục thất bại')
      }
    }
  })

  // Mở modal thêm/sửa danh mục
  const showModal = (category?: ICategoriesBlogs) => {
    setEditingCategory(category || null)
    form.resetFields()

    if (category) {
      form.setFieldsValue(category)
    }

    setIsModalOpen(true)
  }

  // Đóng modal
  const handleCancel = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
    form.resetFields()
  }

  // Xử lý khi submit form
  const handleSubmit = (values: ICategoryBlogsForm) => {
    console.log('🚀 ~ handleSubmit ~ values:', values)
    if (editingCategory) {
      // Cập nhật danh mục
      message.success('Cập nhật danh mục thành công!')
    } else {
      createCategoryBlog.mutate(values)
    }

    setIsModalOpen(false)
    form.resetFields()
  }

  // Xử lý xóa danh mục
  const handleDelete = (id: string) => {
    message.success('Xóa danh mục thành công!')
  }

  // Cấu hình upload ảnh
  const uploadProps: UploadProps = {
    name: 'avatar',
    action: 'https://api.cloudinary.com/v1_1/dgomdpkze/image/upload',
    headers: {
      authorization: 'authorization-text'
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} tải lên thành công`)
        form.setFieldsValue({ avatar: info.file.response.url })
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} tải lên thất bại.`)
      }
    }
  }

  // Định nghĩa cột cho bảng
  const columns: ColumnsType<ICategoriesBlogs> = [
    {
      title: 'Ảnh',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string) => (
        <div className='w-12 h-12 overflow-hidden rounded-md'>
          {avatar ? (
            <img src={avatar || '/placeholder.svg'} alt='Category' className='w-full h-full object-cover' />
          ) : (
            <div className='w-full h-full bg-gray-200 flex items-center justify-center text-gray-400'>No img</div>
          )}
        </div>
      )
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: ICategoriesBlogs, b: ICategoriesBlogs) => a.name.localeCompare(b.name)
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug'
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => text || <span className='text-gray-400'>Không có mô tả</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isPublic',
      key: 'isPublic',
      width: 120,
      render: (isPublic: boolean) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
        >
          {isPublic ? 'Công khai' : 'Riêng tư'}
        </span>
      ),
      filters: [
        { text: 'Công khai', value: true },
        { text: 'Riêng tư', value: false }
      ],
      onFilter: (value, record: ICategoriesBlogs) => record.isPublic === Boolean(value)
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: ICategoriesBlogs) => (
        <Space size='middle'>
          <Tooltip title='Chỉnh sửa'>
            <Button
              type='text'
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
              className='text-blue-500 hover:text-blue-700'
            />
          </Tooltip>
          <Popconfirm
            title='Bạn có chắc chắn muốn xóa danh mục này?'
            onConfirm={() => handleDelete(record._id)}
            okText='Có'
            cancelText='Không'
          >
            <Button type='text' danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div className='p-6 bg-white rounded-lg shadow'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Quản lý danh mục bài viết</h1>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          className='bg-blue-500 hover:bg-blue-600'
        >
          Thêm danh mục
        </Button>
      </div>

      <div className='mb-4'>
        <Input
          placeholder='Tìm kiếm danh mục...'
          prefix={<SearchOutlined className='text-gray-400' />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className='max-w-md'
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={listCategoriesBlog ? listCategoriesBlog : []}
        rowKey='_id'
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng ${total} danh mục`
        }}
        className='mt-4'
      />

      <FormCategoriesBlogs
        editingCategory={editingCategory}
        form={form}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        uploadProps={uploadProps}
      />
    </div>
  )
}

export default CategoryBlogPage