import { useState } from 'react'
import { Button, Card, Tag, Space, Tabs, Table, Avatar, Statistic, Modal, message } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CommentOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import type { TabsProps } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { fetchInfoBlogAPI } from '@/apis/blog.api'

// Mock data for the blog post
const blogPost = {
  id: '1',
  title: 'How to Implement Authentication in Next.js Applications',
  content: `
    <h2>Introduction</h2>
    <p>Authentication is a critical aspect of web applications. In this article, we'll explore how to implement authentication in Next.js applications using various strategies.</p>

    <h2>Authentication Methods</h2>
    <p>There are several authentication methods you can use with Next.js:</p>
    <ul>
      <li>JWT Authentication</li>
      <li>OAuth with providers like Google, Facebook, etc.</li>
      <li>Magic Links</li>
      <li>Session-based Authentication</li>
    </ul>

    <h2>Implementation Steps</h2>
    <p>Here's a step-by-step guide to implementing authentication in your Next.js application:</p>
    <ol>
      <li>Set up your authentication provider</li>
      <li>Create API routes for authentication</li>
      <li>Implement client-side authentication logic</li>
      <li>Protect routes that require authentication</li>
    </ol>

    <h2>Conclusion</h2>
    <p>Implementing authentication in Next.js applications is straightforward with the right tools and approaches. Choose the method that best suits your application's needs.</p>
  `,
  author: {
    id: '101',
    name: 'John Doe',
    avatar: '/placeholder.svg?height=40&width=40'
  },
  publishedAt: '2023-10-15T10:30:00Z',
  updatedAt: '2023-10-16T14:45:00Z',
  status: 'published', // published, draft, scheduled
  categories: ['Next.js', 'Authentication', 'Web Development'],
  tags: ['nextjs', 'auth', 'tutorial', 'javascript'],
  readTime: '8 min',
  views: 1245,
  likes: 87,
  comments: 23
}

// Mock data for comments
const comments = [
  {
    id: '1',
    author: 'Alice Smith',
    avatar: '/placeholder.svg?height=32&width=32',
    content: 'Great article! This helped me implement authentication in my project.',
    date: '2023-10-15T14:30:00Z',
    status: 'approved'
  },
  {
    id: '2',
    author: 'Bob Johnson',
    avatar: '/placeholder.svg?height=32&width=32',
    content: 'Could you elaborate more on JWT implementation?',
    date: '2023-10-15T16:45:00Z',
    status: 'approved'
  },
  {
    id: '3',
    author: 'Carol Williams',
    avatar: '/placeholder.svg?height=32&width=32',
    content: 'I found a typo in the third paragraph.',
    date: '2023-10-16T09:15:00Z',
    status: 'pending'
  }
]

// Mock data for revisions
const revisions = [
  {
    id: '1',
    date: '2023-10-16T14:45:00Z',
    author: 'John Doe',
    changes: 'Updated conclusion and fixed typos'
  },
  {
    id: '2',
    date: '2023-10-15T16:30:00Z',
    author: 'John Doe',
    changes: 'Added implementation steps section'
  },
  {
    id: '3',
    date: '2023-10-15T10:30:00Z',
    author: 'John Doe',
    changes: 'Initial publication'
  }
]

const ViewBlogsPage = () => {
  const { id } = useParams()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const { data: infoBlogs } = useQuery({
    queryKey: ['fetch-info-blogs', id],
    queryFn: async () => {
      const res = await fetchInfoBlogAPI(id as string)
      if (res.data) {
        return res.data
      } else {
        throw new Error('Lấy thông tin bài viết thất bại')
      }
    }
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handlePublishToggle = () => {
    messageApi.success(
      blogPost.status === 'published' ? 'Post unpublished successfully' : 'Post published successfully'
    )
  }

  const handleEdit = () => {
    messageApi.info('Redirecting to edit page...')
  }

  const handleDelete = () => {
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    messageApi.success('Post deleted successfully')
    setIsDeleteModalOpen(false)
  }

  const handlePreview = () => {
    messageApi.info('Opening preview in new tab...')
  }

  const getStatusTag = (status: boolean) => {
    switch (status) {
    case true:
      return (
        <Tag color='green' icon={<CheckCircleOutlined />}>
          Published
        </Tag>
      )
    case false:
      return (
        <Tag color='gold' icon={<EditOutlined />}>
          Draft
        </Tag>
      )
    default:
      return <Tag color='default'>{status}</Tag>
    }
  }

  const tabItems: TabsProps['items'] = [
    {
      key: 'content',
      label: 'Nội dung',
      children: <div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: infoBlogs?.content || '' }} />
    },
    {
      key: 'comments',
      label: (
        <span>
          Bình luận <Tag>{comments.length}</Tag>
        </span>
      ),
      children: (
        <div className='space-y-4'>
          {comments.map((comment) => (
            <Card key={comment.id} size='small' className='shadow-sm'>
              <div className='flex items-start gap-3'>
                <Avatar src={comment.avatar} />
                <div className='flex-1'>
                  <div className='flex justify-between'>
                    <span className='font-medium'>{comment.author}</span>
                    <span className='text-xs text-gray-500'>{formatDate(comment.date)}</span>
                  </div>
                  <p className='mt-1'>{comment.content}</p>
                  <div className='mt-2'>
                    <Tag color={comment.status === 'approved' ? 'green' : 'orange'}>{comment.status}</Tag>
                    {comment.status === 'pending' && (
                      <Space className='ml-2'>
                        <Button size='small' type='primary'>
                          Approve
                        </Button>
                        <Button size='small' danger>
                          Reject
                        </Button>
                      </Space>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )
    },
    {
      key: 'revisions',
      label: 'Lịch sử',
      children: (
        <Table
          dataSource={revisions}
          rowKey='id'
          pagination={false}
          columns={[
            {
              title: 'Date',
              dataIndex: 'date',
              key: 'date',
              render: (date) => formatDate(date)
            },
            {
              title: 'Author',
              dataIndex: 'author',
              key: 'author'
            },
            {
              title: 'Changes',
              dataIndex: 'changes',
              key: 'changes'
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => <Button size='small'>View</Button>
            }
          ]}
        />
      )
    },
    {
      key: 'analytics',
      label: 'Thống kê',
      children: (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Card>
            <Statistic title='Views' value={blogPost.views} prefix={<EyeOutlined />} />
          </Card>
          <Card>
            <Statistic title='Likes' value={blogPost.likes} prefix={<CheckCircleOutlined />} />
          </Card>
          <Card>
            <Statistic title='Comments' value={blogPost.comments} prefix={<CommentOutlined />} />
          </Card>
        </div>
      )
    }
  ]

  return (
    <div>
      {contextHolder}

      {/* Header with actions */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <div>
          <h1 className='text-2xl font-bold'>{infoBlogs?.title}</h1>
          <div className='flex flex-wrap items-center gap-3 mt-2 text-gray-500'>
            <span className='flex items-center gap-1'>
              <UserOutlined /> {infoBlogs?.author.fullname}
            </span>
            <span className='flex items-center gap-1'>
              <ClockCircleOutlined /> {infoBlogs?.createdAt ? formatDate(infoBlogs.createdAt) : 'N/A'}
            </span>
            <span>{getStatusTag(!!infoBlogs?.isPublic)}</span>
          </div>
        </div>

        <div className='flex gap-2'>
          <Button icon={<EyeOutlined />} onClick={handlePreview}>
            Preview
          </Button>
          <Button type='primary' icon={<EditOutlined />} onClick={handleEdit}>
            Edit
          </Button>
          <Button onClick={handlePublishToggle} type={infoBlogs?.isPublic ? 'default' : 'primary'}>
            {infoBlogs?.isPublic ? 'Unpublish' : 'Publish'}
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <Card className='mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Categories</h3>
            <div className='mt-1 flex flex-wrap gap-1'>
              {blogPost.categories.map((category) => (
                <Tag key={category} color='blue'>
                  {category}
                </Tag>
              ))}
            </div>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Tags</h3>
            <div className='mt-1 flex flex-wrap gap-1'>
              {blogPost.tags.map((tag) => (
                <Tag key={tag} color='cyan'>
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Last Updated</h3>
            <p className='mt-1'>{formatDate(blogPost.updatedAt)}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Read Time</h3>
            <p className='mt-1'>{blogPost.readTime}</p>
          </div>
        </div>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultActiveKey='content' items={tabItems} />

      {/* Delete Confirmation Modal */}
      <Modal
        title='Delete Post'
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText='Delete'
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this post? This action cannot be undone.</p>
      </Modal>
    </div>
  )
}

export default ViewBlogsPage
