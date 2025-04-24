import { useState } from 'react'
import {
  Table,
  Input,
  Button,
  Form,
  Space,
  Tag as AntTag,
  Popconfirm,
  message,
  TableColumnsType,
  TablePaginationConfig
} from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTagsAPI, deleteTagsAPI, fetchListTagsAPI, updateTagsAPI } from '@/apis/tags.api'
import FormTags from './form.tags'


const TagsPage = () => {
  const [searchText, setSearchText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<ITags | null>(null)
  const [pagination, setPagination] = useState<IPagination>({
    current: 1,
    pageSize: 5,
    total: 10
  })

  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()
  const queryClient = useQueryClient()

  const { data: listTags, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['fetch-list-tags', pagination],
    queryFn: async () => {
      const res = await fetchListTagsAPI({ current: pagination.current, pageSize: pagination.pageSize })
      if (res.data) {
        setPagination({
          current: res.data.meta.current,
          pageSize: res.data.meta.pageSize,
          total: res.data.meta.total
        })
        return res.data.result
      } else {
        throw new Error('Có lỗi xảy ra khi lấy danh sách thẻ')
      }
    }
  })

  const createTagsMutation = useMutation({
    mutationFn: async (newTag: ITags) => {
      const res = await createTagsAPI({ ...newTag, isPublic: Boolean(newTag.isPublic) })
      if (res.data) {
        queryClient.invalidateQueries({ queryKey: ['fetch-list-tags'] })
        return res.data
      } else {
        throw new Error('Có lỗi xảy ra khi tạo thẻ')
      }
    },
    onSuccess: () => {
      form.resetFields()
      setIsModalOpen(false)
      setEditingTag(null)
      messageApi.success('Tạo thẻ thành công!')
    },
    onError: (error) => {
      messageApi.error(error.message || 'Có lỗi sảy ra khi tạo thẻ!')
    }
  })

  const updateTagsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: IFormTags }) => {
      const res = await updateTagsAPI(id, data)
      if (res.data) {
        queryClient.invalidateQueries({ queryKey: ['fetch-list-tags'] })
        return res.data
      } else {
        throw new Error('Có lỗi xảy ra khi xóa thẻ')
      }
    },
    onSuccess: () => {
      form.resetFields()
      setIsModalOpen(false)
      setEditingTag(null)
      messageApi.success('Cập nhật thẻ thành công!')
    },
    onError: (error) => {
      messageApi.error(error.message || 'Có lỗi sảy ra khi cập nhật thẻ!')
    }
  })

  const deleteTagsMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteTagsAPI(id)
      if (res.data) {
        queryClient.invalidateQueries({ queryKey: ['fetch-list-tags'] })
        return res.data
      } else {
        throw new Error('Có lỗi xảy ra khi xóa thẻ')
      }
    },
    onSuccess: () => {
      messageApi.success('Xóa thẻ thành công!')
    },
    onError: (error) => {
      messageApi.error(error.message || 'Có lỗi sảy ra khi xóa thẻ!')
    }
  })

  // Handle tag creation/editing
  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingTag) {
        // Update existing tag
        updateTagsMutation.mutate({ id: editingTag._id, data: values })
      } else {
        // Create new tag
        createTagsMutation.mutate(values)
      }
    })
  }

  // Open modal for creating a new tag
  const showCreateModal = () => {
    setEditingTag(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  // Open modal for editing an existing tag
  const showEditModal = (record: ITags) => {
    setEditingTag(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  // Handle tag deletion
  const handleDelete = (id: string) => {

    deleteTagsMutation.mutate(id)
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination({
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
      total: pagination.total || 0
    })
  }

  // Table columns configuration
  const columns: TableColumnsType<ITags> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      render: (_, __, index: number) => index + 1
    },
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      width: 80
    },
    {
      title: 'Tên thẻ',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <div className='flex items-center'>
          <AntTag>{text}</AntTag>
        </div>
      )
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isPublic',
      key: 'isPublic',
      width: 100,
      render: (status: boolean) => (
        <div className='text-center'>
          <AntTag color={status ? 'green' : 'red'}>{status ? 'Công khai' : 'Riêng tư'}</AntTag>
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size='middle'>
          <Button
            type='text'
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            className='text-blue-500 hover:text-blue-700'
          />
          <Popconfirm
            title='Xác nhận xóa thẻ?'
            description='Bạn có chắc chắn muốn xóa thẻ này không?'
            onConfirm={() => handleDelete(''+record._id)}
            okText='Xác nhận'
            cancelText='Hủy'
          >
            <Button type='text' danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <>
      {contextHolder}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Quản lý thẻ</h1>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={showCreateModal}
          className='bg-blue-500 hover:bg-blue-600'
        >
          Thêm thẻ mới
        </Button>
      </div>

      <div className='mb-4'>
        <Input
          placeholder='Tìm kiếm thẻ...'
          prefix={<SearchOutlined className='text-gray-400' />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className='max-w-md'
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={listTags || []}
        rowKey='_id'
        loading={isLoading}
        pagination={{
          pageSize: pagination.pageSize,
          current: pagination.current,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} tags`,
          disabled: isPlaceholderData
        }}
        onChange={handleTableChange}
        className='border border-gray-200 rounded-md'
      />

      {/* <Modal
        title={editingTag ? 'Edit Tag' : 'Create New Tag'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false)
          setEditingTag(null)
          form.resetFields()
        }}
        okText={editingTag ? 'Update' : 'Create'}
        okButtonProps={{ loading: createTagsMutation.isPending || updateTagsMutation.isPending }}
      >
        <Form
          form={form}
          layout='vertical'
          className='mt-4'
          initialValues={editingTag || { isPublic: 'true', color: 'blue' }}
        >
          <Form.Item name='name' label='Tên thẻ' rules={[{ required: true, message: 'Tên thẻ không được để trống!' }]}>
            <Input placeholder='Nhập tên thẻ...' />
          </Form.Item>

          <Form.Item name='isPublic' label='Trạng thái' rules={[{ required: true, message: 'Trạng thái không được để trống!' }]}>
            <Select
              placeholder="Chọn trạng thái thẻ"
              allowClear
            >
              <Option value={true}>Công khai</Option>
              <Option value={false}>Riêng tư</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal> */}
      <FormTags
        createTagsMutation={createTagsMutation}
        editingTag={editingTag}
        form={form}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        updateTagsMutation={updateTagsMutation}
        handleOk={handleOk}
        setEditingTag={setEditingTag}
      />
    </>
  )
}

export default TagsPage
