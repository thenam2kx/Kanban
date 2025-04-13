import { Table, Button, Input, Space, Form, Popconfirm, Tag, message } from 'antd'
import { useNavigate } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteUserAPI, fetchListUserAPI } from '@/apis/user.api'
import { useState } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

interface SearchFormValues {
  search?: string
}

const UserPage = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const { data: users, isLoading } = useQuery({
    queryKey: ['fetch-users', page, pageSize],
    queryFn: async () => {
      try {
        const { data: results } = await fetchListUserAPI({ current: page, pageSize: pageSize })
        return results
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('🚀 ~ error:', error)
      }
    }
  })

  const queryClient = useQueryClient()
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await deleteUserAPI(userId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetch-users'] })
      message.success('Xóa danh mục thành công')
    },
    onError: (error: Error) => {
      message.error(error.message)
    }
  })

  const columns: Array<{
    title: string
    dataIndex?: keyof IUser
    key: string
    sorter?: (a: IUser, b: IUser) => number
    render?: (record: IUser) => JSX.Element
  }> = [
    { title: 'Họ tên', dataIndex: 'fullname', key: 'fullname', sorter: (a, b) => a.fullname.localeCompare(b.fullname) },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (record: IUser) => (
        <Tag color={record?.role?.name === 'SUPER_ADMIN' ? 'success' : 'processing'}>
          {record?.role?.name === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : record?.role?.name ?? 'User'}
        </Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (record: IUser) => (
        <Tag color={record.isVerified ? 'success' : 'error'}>
          {record.isVerified ? 'Kích hoạt' : 'Chưa kích hoạt'}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: IUser) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/users/update/${record._id}`, { state: { user: record } })}
          />
          <Popconfirm
            title={`Are you sure you want to delete ${record.fullname}?`}
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  const onSearch = (values: SearchFormValues) => {
    // eslint-disable-next-line no-console
    console.log('🚀 ~ onSearch ~ values:', values)
  }

  const handleDelete = (record: IUser): void => {
    deleteUserMutation.mutate(record._id)
  }

  const handleReset = (): void => {}

  const tableHeader = () => (
    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
      <Form form={form} layout="inline" onFinish={onSearch}>
        <Form.Item name="search">
          <Input placeholder="Search by name, email, or age" style={{ width: 300 }} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button onClick={handleReset}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Button
        type="primary"
        onClick={() => navigate('/users/create')}
        style={{ background: '#52c41a', borderColor: '#52c41a' }}
      >
        Create New User
      </Button>
    </Space>
  )

  return (
    <div style={{ padding: 24 }}>
      <Table<IUser>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dataSource={users?.result || []}
        columns={columns}
        pagination={{
          current: page,
          pageSize: pageSize,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          total: users?.meta?.total || 0,
          onChange: (newPage, newPageSize) => {
            setPage(newPage)
            if (newPageSize !== pageSize) setPageSize(newPageSize)
          },
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30']
        }}
        loading={isLoading}
        bordered
        rowKey={(record) => record._id}
        title={tableHeader}
      />
    </div>
  )
}

export default UserPage
