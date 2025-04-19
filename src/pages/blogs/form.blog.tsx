import { useRef, useState } from 'react'
import { Button, Form, Input, Upload, message, Spin, Switch, Image, Row, Col, Collapse, Typography, Checkbox, Space } from 'antd'
import { UploadOutlined, FormOutlined, EyeOutlined, CalendarOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchListTagsAPI } from '@/apis/tags.api'
import { uploadImageCloudinaryAPI } from '@/apis/apis'
import { fetchListCategoriesBlogAPI } from '@/apis/category.blog.apis'

const { Panel } = Collapse
const { Text } = Typography

interface IProps {
  initialValues?: IBlogFormData
  isLoading?: boolean
  // eslint-disable-next-line no-unused-vars
  handleSubmit: (values: IBlogFormData) => Promise<void>
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    ['link', 'image', 'video'],
    ['blockquote', 'code-block'],
    ['clean']
  ]
}
const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
  'align',
  'color',
  'background',
  'script',
  'sub',
  'super',
  'clean',
  'link',
  'image',
  'video',
  'blockquote',
  'code',
  'code-block'
]

const FormBlog = (props: IProps) => {
  const { initialValues, handleSubmit, isLoading = false } = props
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [content, setContent] = useState(initialValues?.content || '')

  const quillRef = useRef(null)

  const { data: listTags } = useQuery({
    queryKey: ['fetch-list-tags'],
    queryFn: async () => {
      const res = await fetchListTagsAPI()
      if (res.data) {
        return res.data.result
      } else {
        throw new Error('Failed to fetch tags')
      }
    }
  })

  const { data: listCategories } = useQuery({
    queryKey: ['fetch-list-categories'],
    queryFn: async () => {
      const res = await fetchListCategoriesBlogAPI()
      if (res.data) {
        return res.data.result
      } else {
        throw new Error('Failed to fetch categories')
      }
    }
  })

  // Handle image upload to Cloudinary
  const uploadMutation = useMutation({
    mutationFn: async (file: UploadFile) => {
      const formData = new FormData()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formData.append('file', file as any)
      formData.append('upload_preset', 'kanban-upload')
      const res = await uploadImageCloudinaryAPI(formData)
      if (res.data) {
        const imageUrl = res.data.url
        form.setFieldsValue({ coverImage: imageUrl })
        setFileList([file])
      } else {
        message.error('Failed to upload image')
      }
    }
  })

  // Handle image upload
  const handleUploadImage = (file: UploadFile) => {
    uploadMutation.mutate(file)
  }


  const uploadProps: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file])
      return false
    },
    fileList,
    listType: 'picture'
  }

  const expandIcon = ({ isActive }: { isActive?: boolean }) => {
    return isActive ? <CaretUpOutlined /> : <CaretDownOutlined />
  }

  const onPreview = () => {
    message.info('This feature is not implemented yet')
  }

  return (
    <div>
      <Spin spinning={isLoading} tip='Saving...'>
        <Form
          form={form}
          layout='vertical'
          onFinish={handleSubmit}
          initialValues={{
            title: initialValues?.title || '',
            content: initialValues?.content || '',
            excerpt: initialValues?.excerpt || '',
            isPublic: initialValues?.isPublic || true,
            coverImage: initialValues?.coverImage || '',
            tags: initialValues?.tags || [],
            categories: initialValues?.categories || []
          }}
          className='space-y-4'
        >
          <Row gutter={16}>
            {/* Left Column */}
            <Col span={18}>
              <Form.Item name='title' label='Tiêu đề' rules={[{ required: true, message: 'Tiêu đề không được để trống!' }]}>
                <Input placeholder='Nhập tiêu đề' className='py-2' />
              </Form.Item>
              <Form.Item name='excerpt' label='Mô tả ngắn' rules={[{ required: true, message: 'Mô tả ngắn không được để trống!' }]}>
                <Input placeholder='Nhập mô tả ngắn' className='py-2' />
              </Form.Item>

              <Form.Item name='content' label='Nội dung' rules={[{ required: true, message: 'Nội dung không được để trống!' }]}>
                <ReactQuill
                  ref={quillRef}
                  theme='snow'
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  className='h-80 mb-12'
                />
              </Form.Item>
            </Col>

            {/* Right Column */}
            <Col span={6}>
              <div className='w-full max-w-md border border-gray-200 rounded-md bg-white'>
                <Collapse defaultActiveKey={['1', '2', '4']} expandIcon={expandIcon} className='border-0'>
                  <Panel
                    header={
                      <div className='flex justify-between items-center w-full'>
                        <span className='font-medium text-base'>Xuất bản</span>
                      </div>
                    }
                    key='1'
                    className='border-0 border-b border-gray-200'
                  >

                    <div className='mb-3'>
                      <div className='flex items-center mb-1'>
                        <FormOutlined className='mr-2 text-gray-500' />
                        <Form.Item label='Public' name='isPublic' valuePropName='checked' hidden>
                          <Switch defaultChecked />
                        </Form.Item>
                        <Text className='text-gray-600'>Trạng thái: </Text>
                        <Text strong className='ml-1'>
                          Draft
                        </Text>
                        <Button type='link' className='p-0 ml-2 text-blue-500'>
                          Sửa
                        </Button>
                      </div>

                      <div className='flex items-center mb-1'>
                        <EyeOutlined className='mr-2 text-gray-500' />
                        <Text className='text-gray-600'>Hiển thị: </Text>
                        <Text strong className='ml-1'>
                          Công khai
                        </Text>
                        <Button type='link' className='p-0 ml-2 text-blue-500'>
                          Sửa
                        </Button>
                      </div>

                      <div className='flex items-center mb-1'>
                        <CalendarOutlined className='mr-2 text-gray-500' />
                        <Text className='text-gray-600'>Xuất bản </Text>
                        <Text strong className='ml-1'>
                          Hiện tại
                        </Text>
                        <Button type='link' className='p-0 ml-2 text-blue-500'>
                          Sửa
                        </Button>
                      </div>
                    </div>

                    <div className='flex justify-end gap-3'>
                      <Button
                        onClick={onPreview}
                        className='border border-blue-500 text-blue-500 hover:text-blue-600 hover:border-blue-600'
                      >
                        Xem trước
                      </Button>


                      <Button type='default' className='bg-gray-100'>
                        Lưu nháp
                      </Button>
                      <Button type='primary' htmlType='submit' loading={isLoading} className='bg-blue-600 hover:bg-blue-700'>
                        {initialValues ? 'Lưu' : 'Xuất bản'}
                      </Button>
                    </div>
                  </Panel>

                  <Panel
                    header={
                      <div className='flex justify-between items-center w-full'>
                        <span className='font-medium text-base'>Danh mục</span>
                      </div>
                    }
                    key='2'
                    className='border-0 border-b border-gray-200'
                  >
                    <div className='mb-3'>
                      <Checkbox.Group className='w-full'>
                        <Space direction='vertical' className='w-full'>
                          {
                            listCategories && listCategories?.map((category) => (
                              <Checkbox value={category._id} key={category._id}>{category.name}</Checkbox>
                            ))
                          }
                        </Space>
                      </Checkbox.Group>

                      <Button type='link' className='p-0 mt-2 text-blue-500 flex items-center'>
                        <span className='mr-1'>+</span> Add Category
                      </Button>
                    </div>
                  </Panel>

                  <Panel
                    header={
                      <div className='flex justify-between items-center w-full'>
                        <span className='font-medium text-lg'>Tags</span>
                      </div>
                    }
                    key='3'
                    className='border-0'
                  >
                    <Form.Item name='tags' rules={[{ required: true, message: 'Tag không được để trống!' }]}>
                      <Checkbox.Group className='w-full'>
                        <Space direction='vertical' className='w-full'>
                          {
                            listTags && listTags?.map((tag) => (
                              <Checkbox value={tag._id} key={tag._id}>{tag.name}</Checkbox>
                            ))
                          }
                        </Space>
                      </Checkbox.Group>
                    </Form.Item>
                    <Button type='link' className='p-0 mt-2 text-blue-500 flex items-center'>
                      <span className='mr-1'>+</span> Add Tags
                    </Button>
                  </Panel>

                  <Panel
                    header={
                      <div className='flex justify-between items-center w-full'>
                        <span className='font-medium text-base'>Ảnh đại diện</span>
                      </div>
                    }
                    key='4'
                    className='border-0'
                  >
                    <div className='flex w-full'>
                      <Form.Item name='coverImage' label='Hình ảnh' className='w-full'>
                        <Upload {...uploadProps} onChange={() => handleUploadImage(fileList[0])} className='w-full'>
                          <Button icon={<UploadOutlined />} >Chọn ảnh</Button>
                        </Upload>
                        {
                          initialValues?.coverImage && (
                            <Image
                              width={200}
                              src={initialValues?.coverImage}
                            />
                          )
                        }
                      </Form.Item>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </Col>
          </Row>
        </Form>
      </Spin>
    </div>
  )
}

export default FormBlog
