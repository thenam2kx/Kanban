import { useState, useEffect } from 'react'
import { Table, Input, Select, Button, Tag, Space, Dropdown, Typography, Badge, Tooltip } from 'antd'
import {
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
  ExportOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { MenuProps } from 'antd'
import { Link } from 'react-router'

const { Search } = Input
const { Option } = Select

// Mock data for blog posts
interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  tags: string[]
  coverImage: string
  readTime: string
  status: 'published' | 'draft' | 'scheduled'
  views: number
}

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    excerpt: 'Learn how to set up a new project with React and TypeScript from scratch.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    author: 'Jane Doe',
    date: '2023-04-15',
    tags: ['react', 'typescript', 'frontend'],
    coverImage: '/placeholder.svg?height=200&width=400',
    readTime: '5 min read',
    status: 'published',
    views: 1250
  },
  {
    id: '2',
    title: 'Building UI Components with Ant Design',
    excerpt: 'Explore how to create beautiful UI components using Ant Design library.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    author: 'John Smith',
    date: '2023-04-10',
    tags: ['antd', 'react', 'ui'],
    coverImage: '/placeholder.svg?height=200&width=400',
    readTime: '8 min read',
    status: 'published',
    views: 980
  },
  {
    id: '3',
    title: 'Styling with Tailwind CSS',
    excerpt: 'Learn how to use Tailwind CSS to style your web applications efficiently.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    author: 'Alex Johnson',
    date: '2023-04-05',
    tags: ['tailwindcss', 'css', 'styling'],
    coverImage: '/placeholder.svg?height=200&width=400',
    readTime: '6 min read',
    status: 'draft',
    views: 0
  },
  {
    id: '4',
    title: 'State Management in React Applications',
    excerpt: 'Compare different state management solutions for React applications.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    author: 'Sarah Williams',
    date: '2023-03-28',
    tags: ['react', 'state-management', 'redux'],
    coverImage: '/placeholder.svg?height=200&width=400',
    readTime: '10 min read',
    status: 'published',
    views: 2340
  },
  {
    id: '5',
    title: 'Creating Responsive Layouts',
    excerpt: 'Learn techniques for building responsive layouts that work on all devices.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    author: 'Mike Brown',
    date: '2023-03-20',
    tags: ['responsive', 'css', 'tailwindcss'],
    coverImage: '/placeholder.svg?height=200&width=400',
    readTime: '7 min read',
    status: 'scheduled',
    views: 0
  },
  {
    id: '6',
    title: 'Next.js 13 App Router',
    excerpt: 'Explore the new App Router in Next.js 13 and its benefits.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    author: 'Emily Clark',
    date: '2023-03-15',
    tags: ['nextjs', 'react', 'routing'],
    coverImage: '/placeholder.svg?height=200&width=400',
    readTime: '9 min read',
    status: 'published',
    views: 1560
  },
  {
    id: '7',
    title: 'Authentication in Modern Web Apps',
    excerpt: 'Implement secure authentication in your web applications.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    author: 'David Wilson',
    date: '2023-03-10',
    tags: ['authentication', 'security', 'web'],
    coverImage: '/placeholder.svg?height=200&width=400',
    readTime: '12 min read',
    status: 'published',
    views: 3200
  },
  {
    id: '8',
    title: 'API Design Best Practices',
    excerpt: 'Learn how to design RESTful APIs that developers love to use.',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    author: 'Lisa Chen',
    date: '2023-03-05',
    tags: ['api', 'rest', 'backend'],
    coverImage: '/placeholder.svg?height=200&width=400',
    readTime: '8 min read',
    status: 'draft',
    views: 0
  }
]

// Get all unique tags from blog posts
const allTags = Array.from(new Set(mockBlogPosts.flatMap((post) => post.tags)))

// Get all unique authors
const allAuthors = Array.from(new Set(mockBlogPosts.map((post) => post.author)))

const BlogsPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0
  })

  // Filter posts based on search, tags, status, and authors
  useEffect(() => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      let filteredPosts = [...mockBlogPosts]

      // Apply search filter
      if (searchQuery) {
        filteredPosts = filteredPosts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      // Apply tag filter
      if (selectedTags.length > 0) {
        filteredPosts = filteredPosts.filter((post) => selectedTags.some((tag) => post.tags.includes(tag)))
      }

      // Apply status filter
      if (selectedStatus.length > 0) {
        filteredPosts = filteredPosts.filter((post) => selectedStatus.includes(post.status))
      }

      // Apply author filter
      if (selectedAuthors.length > 0) {
        filteredPosts = filteredPosts.filter((post) => selectedAuthors.includes(post.author))
      }

      setPosts(filteredPosts)
      setPagination({
        ...pagination,
        total: filteredPosts.length
      })
      setLoading(false)
    }, 500)
  }, [searchQuery, selectedTags, selectedStatus, selectedAuthors, pagination.current, pagination.pageSize])

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setPagination({
      ...pagination,
      current: 1
    })
  }

  // Handle tag selection
  const handleTagChange = (tags: string[]) => {
    setSelectedTags(tags)
    setPagination({
      ...pagination,
      current: 1
    })
  }

  // Handle status selection
  const handleStatusChange = (status: string[]) => {
    setSelectedStatus(status)
    setPagination({
      ...pagination,
      current: 1
    })
  }

  // Handle author selection
  const handleAuthorChange = (authors: string[]) => {
    setSelectedAuthors(authors)
    setPagination({
      ...pagination,
      current: 1
    })
  }

  // Handle table change (sorting, pagination)
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination(pagination)
  }

  // Handle refresh
  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  // Menu items for post actions
  const getActionMenu = (record: BlogPost): MenuProps => ({
    items: [
      {
        key: '1',
        label: 'Edit',
        icon: <EditOutlined />,
        onClick: () => console.log('Edit post', record.id)
      },
      {
        key: '2',
        label: 'View',
        icon: <EyeOutlined />,
        onClick: () => console.log('View post', record.id)
      },
      {
        key: '3',
        label: 'Delete',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => console.log('Delete post', record.id)
      }
    ]
  })

  // Status badge renderer
  const renderStatusBadge = (status: string) => {
    switch (status) {
    case 'published':
      return <Badge status='success' text='Published' />
    case 'draft':
      return <Badge status='default' text='Draft' />
    case 'scheduled':
      return <Badge status='processing' text='Scheduled' />
    default:
      return null
    }
  }

  // Table columns
  const columns: ColumnsType<BlogPost> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <div className='flex items-center space-x-3'>
          <div className='hidden sm:block flex-shrink-0'>
            <img
              src={record.coverImage || '/placeholder.svg'}
              alt={record.title}
              width={48}
              height={36}
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
      sorter: (a, b) => a.author.localeCompare(b.author),
      filters: allAuthors.map((author) => ({ text: author, value: author })),
      onFilter: (value, record) => record.author === value,
      responsive: ['md']
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: renderStatusBadge,
      filters: [
        { text: 'Published', value: 'published' },
        { text: 'Draft', value: 'draft' },
        { text: 'Scheduled', value: 'scheduled' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date) => new Date(date).toLocaleDateString(),
      responsive: ['lg']
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <div className='flex flex-wrap gap-1'>
          {tags.slice(0, 2).map((tag) => (
            <Tag key={tag} className='m-0'>
              {tag}
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
          <Dropdown menu={getActionMenu(record)} trigger={['click']} placement='bottomRight'>
            <Button type='text' icon={<MoreOutlined />} className='flex items-center justify-center' />
          </Dropdown>
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
          <div className='flex-1'>
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
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={posts}
          rowKey='id'
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
          className='blog-table'
        />
      </div>
    </div>
  )
}

export default BlogsPage
