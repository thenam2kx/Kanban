import { Table, Button, Tag, Space, Typography, Tooltip, message, Popconfirm, Input, Select } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  ExportOutlined
} from '@ant-design/icons'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { Link } from 'react-router'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteBlogAPI, fetchListBlogAPI } from '@/apis/blog.api'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchListTagsAPI } from '@/apis/tags.api'
import { fetchListCategoriesBlogAPI } from '@/apis/category.blog.apis'
import debounce from 'debounce'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const { Search } = Input
const { Option } = Select


export interface IParamsSearch {
  search: string
  tags: string[]
  categories: string[]
  status: boolean | null
}


const BlogsPage = () => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null)
  const [pagination, setPagination] = useState<IPagination>({
    current: 1,
    pageSize: 5,
    total: 20
  })

  const queryClient = useQueryClient()


  // ==================================================== //
  // ==================================================== //
  // ============ Fetching list blogs =========== //
  const { data: listBlogs, isLoading, isPlaceholderData } = useQuery({
    queryKey: [
      'fetch-list-blogs',
      pagination.current,
      pagination.pageSize,
      searchValue,
      selectedTags,
      selectedCategories,
      selectedStatus
    ],
    queryFn: async () => {
      const paramsSearch: IParamsSearch = {
        search: searchValue,
        tags: selectedTags,
        categories: selectedCategories,
        status: selectedStatus
      }
      const res = await fetchListBlogAPI({ current: pagination.current, pageSize: pagination.pageSize, paramsSearch })
      if (res.data) {
        setPagination({
          current: res?.data.meta.current,
          pageSize: res.data.meta.pageSize,
          total: res.data.meta.total
        })
        return res.data.result
      } else {
        throw new Error('Failed to fetch blogs')
      }
    },
    placeholderData: keepPreviousData
  })

  // ==================================================== //
  // ==================================================== //
  // ============ Fetching list tags =========== //
  const { data: listTags } = useQuery({
    queryKey: ['fetch-list-tags'],
    queryFn: async () => {
      const res = await fetchListTagsAPI({ current: 1, pageSize: 100 })
      if (res.data) {
        return res.data.result
      } else {
        throw new Error('Có lỗi xảy ra khi lấy danh sách tags')
      }
    },
    placeholderData: keepPreviousData
  })

  // ==================================================== //
  // ==================================================== //
  // ============ Fetching list categories =========== //
  const { data: listCategories } = useQuery({
    queryKey: ['fetch-list-categories'],
    queryFn: async () => {
      const res = await fetchListCategoriesBlogAPI()
      if (res.data) {
        return res.data.result
      } else {
        throw new Error('Có lỗi xảy ra khi lấy danh sách danh mục')
      }
    },
    placeholderData: keepPreviousData
  })


  // ==================================================== //
  // ==================================================== //
  // ==================================================== //
  // ==================================================== //
  // ============ Handle delete blog =========== //
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

  const confirmDelete = useCallback((id: string) => {
    handleDeleteBlogs.mutate(id)
  }, [handleDeleteBlogs])


  // ==================================================== //
  // ==================================================== //
  // ==================================================== //
  // ==================================================== //
  // ============ Handle change paginate table =========== //
  const handleTableChange = (
    pagination: TablePaginationConfig
    // filters: Record<string, FilterValue | null>,
    // sorter: SorterResult<IBlog> | SorterResult<IBlog>[],
    // extra: TableCurrentDataSource<IBlog>
  ) => {
    setPagination({
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
      total: pagination.total || 0
    })
  }


  // ==================================================== //
  // ==================================================== //
  // ==================================================== //
  // ==================================================== //
  // ============ Handle export data to excel =========== //
  const exportToExcel = (data: IBlog[], fileName: string) => {
    const exportData = data.map(blog => ({
      ID: blog._id,
      Title: blog.title,
      Excerpt: blog.excerpt,
      Author: blog.author.fullname,
      Status: blog.isPublic ? 'Công khai' : 'Riêng tư',
      'Created At': new Date(blog.createdAt).toLocaleDateString(),
      Tags: blog.tags.map(tag => tag.name).join(', '),
      Categories: blog?.categories?.map(cat => cat.name).join(', '),
      Views: blog.views
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Blogs')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, `${fileName}.xlsx`)
  }

  // ==================================================== //
  // ==================================================== //
  // ==================================================== //
  // ==================================================== //
  // ============ Handle search with debounce =========== //
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchValue(value)
      }, 500),
    []
  )

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    debouncedSearch(value)
  }

  useEffect(() => {
    return () => {
      debouncedSearch.clear()
    }
  }, [debouncedSearch])

  // ==================================================== //
  // ==================================================== //
  // ==================================================== //
  // ==================================================== //
  // ============ Handle filter with tags =========== //
  const handleTagChange = (tags: string[]) => {
    setSelectedTags(tags)
  }


  // ==================================================== //
  // ==================================================== //
  // ==================================================== //
  // ==================================================== //
  // ============ Handle filter with category =========== //
  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories)
  }


  // ==================================================== //
  // ==================================================== //
  // ==================================================== //
  // ==================================================== //
  // ============ Handle filter with status =========== //
  const handleStatusChange = (status: boolean) => {
    setSelectedStatus(status)
  }


  // ==================================================== //
  // ==================================================== //
  // ==================================================== //
  // ==================================================== //
  // ============ Handle refresh =========== //
  const handleRefresh = () => {
    setSelectedTags([])
    setSelectedCategories([])
    setSelectedStatus(null)
    setSearchValue('')
  }


  // ==================================================== //
  // ==================================================== //
  // ==================================================== //
  // ==================================================== //
  // ============ Column data =========== //
  const columns = useMemo<ColumnsType<IBlog>>(() => [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <div className='flex items-center space-x-3'>
          <div className='hidden sm:block flex-shrink-0'>
            <img
              src={record.coverImage || 'https://res.cloudinary.com/dgomdpkze/image/upload/istockphoto-1222357475-612x612-removebg-preview_yzoumz.png'}
              alt={record.title}
              width={48}
              height={48}
              className='rounded object-cover'
              loading='lazy'
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
      title: 'Tác  giả',
      dataIndex: 'author',
      key: 'author',
      render: (author) => author.fullname,
      responsive: ['md']
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isPublic',
      key: 'isPublic',
      render: (isPublic: boolean) => (isPublic ? 'Công khai' : 'Riêng tư')
    },
    {
      title: 'Ngày xuất bản',
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
      title: 'Danh mục',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories: { _id: string, name: string }[]) => (
        <div className='flex flex-wrap gap-1'>
          {categories?.slice(0, 2).map((category) => (
            <Tag key={category._id} className='m-0'>
              {category.name}
            </Tag>
          ))}
          {categories?.length > 2 && (
            <Tooltip title={categories.slice(2).join(', ')}>
              <Tag className='m-0'>+{categories.length - 2}</Tag>
            </Tooltip>
          )}
        </div>
      ),
      responsive: ['lg']
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      sorter: (a, b) => a.views - b.views,
      render: (views) => (views > 0 ? views.toLocaleString() : '-'),
      responsive: ['md']
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size='large'>
          <Link to={`/blogs/update/${record._id}`}><EditOutlined /></Link>
          <Link to={`/blogs/view/${record._id}`}><EyeOutlined /></Link>
          <Popconfirm
            title="Xóa bài viết"
            description="Bạn chắc chắn muốn xóa bài viết?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => confirmDelete(record._id)}
          >
            <DeleteOutlined style={{ color: '#1677ff' }} />
          </Popconfirm>
        </Space>
      )
    }
  ], [confirmDelete])

  return (
    <div>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Danh sách bài viết</h1>
          <p className='text-gray-500'>Quản lý và chia sẻ bài viết</p>
        </div>
        <Link to='/blogs/create'>
          <Button type='primary' icon={<PlusOutlined />} className='mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700'>
            Tạo bài viết mới
          </Button>
        </Link>
      </div>

      <div className='bg-white rounded-lg'>
        <div className='flex flex-col lg:flex-row gap-4 mb-6'>
          <div className='flex-1'>
            <Search
              placeholder='Tìm kiếm bài viết...'
              allowClear
              enterButton={<SearchOutlined />}
              size='large'
              onChange={handleChangeSearch}
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
                  <FilterOutlined /> Lọc theo Tags
                </>
              }
              onChange={handleTagChange}
              className='w-full sm:w-auto'
            >
              {listTags?.map((tag) => (
                <Option key={tag._id} value={tag._id}>
                  {tag.name}
                </Option>
              ))}
            </Select>

            <Select
              mode='multiple'
              allowClear
              style={{ minWidth: '180px' }}
              placeholder='Lọc theo trạng thái'
              onChange={handleStatusChange}
              className='w-full sm:w-auto'
            >
              <Option value='true'>Công khai</Option>
              <Option value='false'>Riêng tư</Option>
            </Select>

            <Select
              mode='multiple'
              allowClear
              style={{ minWidth: '180px' }}
              placeholder='Lọc theo danh mục'
              onChange={handleCategoryChange}
              className='w-full sm:w-auto'
            >
              {listCategories?.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>

            <Button icon={<ReloadOutlined />} className="bg-gray-100 hover:bg-gray-200" onClick={handleRefresh} />
            <Button icon={<ExportOutlined />} className="bg-green-600 hover:bg-green-700 text-white" onClick={() => exportToExcel(listBlogs || [], 'blogs')}>Export</Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={listBlogs || []}
          rowKey='_id'
          pagination={{
            pageSize: pagination.pageSize,
            current: pagination.current,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total) => `Tổng cộng ${total} mục`,
            disabled: isPlaceholderData
          }}
          loading={isLoading}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
          className='blog-table'
          locale={{ emptyText: 'Không có dữ liệu' }}
        />
      </div>
    </div>
  )
}

export default BlogsPage
