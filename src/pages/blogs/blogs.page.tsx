import { Table, Button, Tag, Space, Typography, Tooltip, message, Popconfirm } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { Link } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteBlogAPI, fetchListBlogAPI } from '@/apis/blog.api'

const BlogsPage = () => {
  const queryClient = useQueryClient()
  // Fetching blog posts
  const { data: listBlogs, isLoading } = useQuery({
    queryKey: ['fetch-list-blogs'],
    queryFn: async () => {
      const res = await fetchListBlogAPI()
      if (res.data) {
        return res.data.result
      } else {
        throw new Error('Failed to fetch blogs')
      }
    }
  })

  const handleDeleteBlogs = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteBlogAPI(id)
      if (res.data) {
        message.success('Xóa bài viết thành công')
        queryClient.invalidateQueries({ queryKey: ['fetch-list-blogs'] })
        return res.data
      } else {
        throw new Error('Failed to delete blog')
      }
    },
    onError: (error) => {
      message.error('Xóa bài viết thất bại')
      // eslint-disable-next-line no-console
      console.error('Error deleting blog:', error)
    }
  })

  const confirmDelete = (id: string) => {
    handleDeleteBlogs.mutate(id)
  }

  // Table columns
  const columns: ColumnsType<IBlog> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <div className='flex items-center space-x-3'>
          <div className='hidden sm:block flex-shrink-0'>
            <img
              src={record.coverImage || 'https://picsum.photos/200/300'}
              alt={record.title}
              width={48}
              height={48}
              className='rounded object-cover'
            />
          </div>
          <div>
            <Typography.Text strong className='text-blue-600 hover:underline cursor-pointer'>
              {text}
            </Typography.Text>
            <div className='text-xs text-gray-500 mt-1 max-w-md truncate'>{record.excerpt}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      render: (author) => author.fullname,
      responsive: ['md']
    },
    {
      title: 'Status',
      dataIndex: 'isPublic',
      key: 'isPublic',
      filters: [
        { text: 'Published', value: 'published' },
        { text: 'Draft', value: 'draft' },
        { text: 'Scheduled', value: 'scheduled' }
      ]
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      responsive: ['lg']
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: { _id: string, name: string }[]) => (
        <div className='flex flex-wrap gap-1'>
          {tags.slice(0, 2).map((tag) => (
            <Tag key={tag._id} className='m-0'>
              {tag.name}
            </Tag>
          ))}
          {tags.length > 2 && (
            <Tooltip title={tags.slice(2).join(', ')}>
              <Tag className='m-0'>+{tags.length - 2}</Tag>
            </Tooltip>
          )}
        </div>
      ),
      responsive: ['lg']
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
      sorter: (a, b) => a.views - b.views,
      render: (views) => (views > 0 ? views.toLocaleString() : '-'),
      responsive: ['md']
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size='middle'>
          <Link to={`/blogs/update/${record._id}`}><EditOutlined /></Link>
          <Link to={`/blogs/view/${record._id}`}><EyeOutlined /></Link>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => confirmDelete(record._id)}
          >
            <Button danger type='text'><DeleteOutlined /></Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Blog Posts</h1>
          <p className='text-gray-500'>Manage and browse your blog content</p>
        </div>
        <Link to='/blogs/create'>
          <Button type='primary' icon={<PlusOutlined />} className='mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700'>
            Add New Post
          </Button>
        </Link>
      </div>

      <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
        <div className='flex flex-col lg:flex-row gap-4 mb-6'>
          {/* <div className='flex-1'>
            <Search
              placeholder='Search posts...'
              allowClear
              enterButton={<SearchOutlined />}
              size='large'
              onSearch={handleSearch}
              className='w-full'
            />
          </div>
          <div className='flex flex-col sm:flex-row gap-4'>
            <Select
              mode='multiple'
              allowClear
              style={{ minWidth: '180px' }}
              placeholder={
                <>
                  <FilterOutlined /> Filter by tags
                </>
              }
              onChange={handleTagChange}
              className='w-full sm:w-auto'
            >
              {allTags.map((tag) => (
                <Option key={tag} value={tag}>
                  {tag}
                </Option>
              ))}
            </Select>

            <Select
              mode='multiple'
              allowClear
              style={{ minWidth: '180px' }}
              placeholder='Filter by status'
              onChange={handleStatusChange}
              className='w-full sm:w-auto'
            >
              <Option value='published'>Published</Option>
              <Option value='draft'>Draft</Option>
              <Option value='scheduled'>Scheduled</Option>
            </Select>

            <Select
              mode='multiple'
              allowClear
              style={{ minWidth: '180px' }}
              placeholder='Filter by author'
              onChange={handleAuthorChange}
              className='w-full sm:w-auto'
            >
              {allAuthors.map((author) => (
                <Option key={author} value={author}>
                  {author}
                </Option>
              ))}
            </Select>

            <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
            <Button icon={<ExportOutlined />}>Export</Button>
          </div> */}
        </div>

        <Table
          columns={columns}
          dataSource={listBlogs || []}
          rowKey='_id'
          // pagination={pagination}
          loading={isLoading}
          // onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
          className='blog-table'
        />
      </div>
    </div>
  )
}

export default BlogsPage
