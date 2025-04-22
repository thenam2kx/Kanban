import { useState, useEffect } from 'react'
import { Input, Select, Tag, Card, Pagination, Empty, Spin, Button, Dropdown } from 'antd'
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  EllipsisOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Link } from 'react-router'

const { Search } = Input
const { Option } = Select
const { Meta } = Card

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
}

export const mockBlogPosts: BlogPost[] = [
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
  },
]

// Get all unique tags from blog posts
const allTags = Array.from(new Set(mockBlogPosts.flatMap((post) => post.tags)))

const Blog2page = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const pageSize = 4

  // Filter and sort posts based on search, tags, and sort options
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
            post.content.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      // Apply tag filter
      if (selectedTags.length > 0) {
        filteredPosts = filteredPosts.filter((post) => selectedTags.some((tag) => post.tags.includes(tag)))
      }

      // Apply sorting
      filteredPosts.sort((a, b) => {
        if (sortBy === 'date') {
          return sortOrder === 'asc'
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime()
        } else {
          return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
        }
      })

      setPosts(filteredPosts)
      setLoading(false)
    }, 500)
  }, [searchQuery, selectedTags, sortBy, sortOrder])

  // Calculate pagination
  const paginatedPosts = posts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  // Handle tag selection
  const handleTagChange = (tags: string[]) => {
    setSelectedTags(tags)
    setCurrentPage(1)
  }

  // Handle sort change
  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-')
    setSortBy(field as 'date' | 'title')
    setSortOrder(order as 'asc' | 'desc')
    setCurrentPage(1)
  }

  // Menu items for post actions
  const postActionItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Edit Post',
    },
    {
      key: '2',
      label: 'Delete Post',
    },
    {
      key: '3',
      label: 'View Analytics',
    },
  ]

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8'>
          <div>
            <h1 className='text-2xl font-bold text-gray-800'>Blog Posts</h1>
            <p className='text-gray-500'>Manage and browse your blog content</p>
          </div>
          <Link to='/page'>
            <Button type='primary' className='mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700'>
              Add New Post
            </Button>
          </Link>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
          <div className='flex flex-col md:flex-row gap-4 mb-6'>
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
            <div className='w-full md:w-64'>
              <Select
                mode='multiple'
                allowClear
                style={{ width: '100%' }}
                placeholder={
                  <>
                    <FilterOutlined /> Filter by tags
                  </>
                }
                onChange={handleTagChange}
                className='w-full'
              >
                {allTags.map((tag) => (
                  <Option key={tag} value={tag}>
                    {tag}
                  </Option>
                ))}
              </Select>
            </div>
            <div className='w-full md:w-64'>
              <Select defaultValue='date-desc' style={{ width: '100%' }} onChange={handleSortChange} className='w-full'>
                <Option value='date-desc'>
                  <SortAscendingOutlined /> Newest first
                </Option>
                <Option value='date-asc'>
                  <SortAscendingOutlined /> Oldest first
                </Option>
                <Option value='title-asc'>
                  <SortAscendingOutlined /> Title A-Z
                </Option>
                <Option value='title-desc'>
                  <SortAscendingOutlined /> Title Z-A
                </Option>
              </Select>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                icon={<UnorderedListOutlined />}
                onClick={() => setViewMode('list')}
                type={viewMode === 'list' ? 'primary' : 'default'}
                className={viewMode === 'list' ? 'bg-blue-600' : ''}
              />
              <Button
                icon={<AppstoreOutlined />}
                onClick={() => setViewMode('grid')}
                type={viewMode === 'grid' ? 'primary' : 'default'}
                className={viewMode === 'grid' ? 'bg-blue-600' : ''}
              />
            </div>
          </div>

          <Spin spinning={loading}>
            {paginatedPosts.length > 0 ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 gap-6' : 'grid-cols-1 gap-4'}`}>
                {paginatedPosts.map((post) => (
                  <Card
                    key={post.id}
                    hoverable
                    cover={
                      viewMode === 'grid' && (
                        <img
                          alt={post.title}
                          src={post.coverImage || '/placeholder.svg'}
                          className='h-48 object-cover'
                        />
                      )
                    }
                    className={viewMode === 'list' ? 'flex flex-row' : ''}
                    actions={[
                      <Dropdown key='more' menu={{ items: postActionItems }} placement='bottomRight'>
                        <Button type='text' icon={<EllipsisOutlined />} />
                      </Dropdown>,
                    ]}
                  >
                    {viewMode === 'list' && (
                      <div className='mr-4 flex-shrink-0 hidden sm:block'>
                        <img
                          alt={post.title}
                          src={post.coverImage || '/placeholder.svg'}
                          className='w-32 h-24 object-cover rounded'
                        />
                      </div>
                    )}
                    <div>
                      <Meta
                        title={
                          <Link to={`/blog/${post.id}`} className='text-lg font-semibold hover:text-blue-600'>
                            {post.title}
                          </Link>
                        }
                        description={
                          <div>
                            <p className='text-gray-500 mb-2'>{post.excerpt}</p>
                            <div className='flex items-center justify-between mt-4'>
                              <div className='flex items-center text-sm text-gray-500'>
                                <span>{new Date(post.date).toLocaleDateString()}</span>
                                <span className='mx-2'>•</span>
                                <span>{post.readTime}</span>
                              </div>
                              <div className='flex flex-wrap gap-1'>
                                {post.tags.slice(0, 2).map((tag) => (
                                  <Tag key={tag} className='m-0'>
                                    {tag}
                                  </Tag>
                                ))}
                                {post.tags.length > 2 && <Tag className='m-0'>+{post.tags.length - 2}</Tag>}
                              </div>
                            </div>
                          </div>
                        }
                      />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty description='No blog posts found' />
            )}

            {posts.length > pageSize && (
              <div className='mt-8 flex justify-center'>
                <Pagination
                  current={currentPage}
                  total={posts.length}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            )}
          </Spin>
        </div>
      </div>
    </div>
  )
}

export default Blog2page
