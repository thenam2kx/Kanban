import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Input, message, Popconfirm, Space, Table, Tag } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { deleteCategoryAPI, fetchListCategoryAPI } from '@/apis/category.apis'

const CategoryPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchText, setSearchText] = useState('')

  const { data: listCategories, isLoading } = useQuery({
    queryKey: ['fetch-categories', currentPage],
    queryFn: async () => {
      try {
        const { data: results } = await fetchListCategoryAPI({ current: currentPage, pageSize: 10 })
        return results
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('🚀 ~ error:', error)
      }
    }
  })

  const queryClient = useQueryClient()
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const result = await deleteCategoryAPI(categoryId)
      return result
    },
    onSuccess: (result) => {
      if (result.data) {
        queryClient.invalidateQueries({ queryKey: ['fetch-categories'] })
        message.success('Xóa danh mục thành công')
      } else {
        message.error(`Có lỗi sảy ra: ${result.message}`)
      }
    },
    onError: (error: Error) => {
      message.error(error.message)
    }
  })

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string) => <span>{text}</span>
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: 150
    },
    {
      title: 'Status',
      dataIndex: 'isPublished',
      key: 'isPublished',
      width: 100,
      render: (isPublished: boolean) => (
        <Tag color={isPublished ? 'green' : 'default'}>
          {isPublished ? 'Online' : 'Offline'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      align: 'right' as const,
      render: (record: ICategory) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/categories/update/${record._id}`)}
          />
          <Popconfirm
            title={`Are you sure you want to delete ${record.name}?`}
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

  const handleDelete = (record: ICategory): void => {
    deleteCategoryMutation.mutate(record._id)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const filteredData = (listCategories?.result as ICategory[] | undefined)?.filter((category: ICategory) =>
    category.name.toLowerCase().includes(searchText.toLowerCase())
  ) || []

  return (
    <Card
      title={
        <div className="flex justify-between items-center">
          <Space>
            <Input
              placeholder="Search..."
              value={searchText}
              onChange={handleSearch}
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/categories/create')}
          >
            Create New
          </Button>
        </div>
      }
    >
      <Table
        columns={columns}
        dataSource={listCategories?.result as unknown as ICategory[]}
        rowKey={(record: ICategory) => record._id}
        loading={isLoading || filteredData.length === 0}
        pagination={{
          current: currentPage,
          pageSize: listCategories?.meta.pageSize ?? 10,
          total: listCategories?.meta.total ?? 0,
          onChange: (page) => setCurrentPage(page),
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          position: ['bottomRight']
        }}
        scroll={{ y: 'calc(100vh - 300px)' }}
        bordered={false}
        rowClassName={(_record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
      />
    </Card>
  )
}

export default CategoryPage
