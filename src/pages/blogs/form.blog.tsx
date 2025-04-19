import { useRef, useState } from 'react'
import { Button, Form, Input, Select, Upload, message, Spin, Switch, Image } from 'antd'
import { UploadOutlined, SaveOutlined, PictureOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchListTagsAPI } from '@/apis/tags.api'
import { uploadImageCloudinaryAPI } from '@/apis/apis'


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

  const tagOptions = listTags?.map((tag) => ({
    value: tag._id,
    label: tag.name
  }))

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
            tags: []
          }}
          className='space-y-4'
        >
          <Form.Item name='title' label='Tiêu đề' rules={[{ required: true, message: 'Please enter a title' }]}>
            <Input placeholder='Enter blog post title' className='py-2' />
          </Form.Item>

          <Form.Item name='excerpt' label='Mô tả ngắn' rules={[{ required: true, message: 'Please enter an excerpt' }]}>
            <Input placeholder='A short summary of your post' className='py-2' />
          </Form.Item>

          <Form.Item name='content' label='Nội dung' rules={[{ required: true, message: 'Please enter content' }]}>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              className="h-80 mb-12"
            />
          </Form.Item>

          <Form.Item name='tags' label='Tags' rules={[{ required: true, message: 'Please select at least one tag' }]}>
            <Select mode='multiple' placeholder='Select tags' options={tagOptions} className='w-full' />
          </Form.Item>

          <Form.Item name='coverImage' label='Hình ảnh'>
            <Upload {...uploadProps} onChange={() => handleUploadImage(fileList[0])}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
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

          <Form.Item label="Public" name="isPublic" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>

          <div className='flex justify-between pt-4 border-t border-gray-100'>
            <Button type='default' className='bg-gray-100'>
              Lưu bản nháp
            </Button>
            <Button type='primary' htmlType='submit' icon={<SaveOutlined />} loading={isLoading} className='bg-blue-600 hover:bg-blue-700'>
              Đăng bài
            </Button>
          </div>
        </Form>
      </Spin>


      <div className='mt-8 bg-white rounded-lg shadow-md p-6'>
        <div className='mb-4'>
          <h2 className='text-xl font-bold text-gray-800'>Preview</h2>
          <p className='text-gray-500'>See how your post will look</p>
        </div>

        <div className='border border-gray-200 rounded-lg p-4 min-h-[200px] flex items-center justify-center'>
          {form.getFieldValue('title') ? (
            <div className='w-full'>
              <h3 className='text-xl font-bold'>{form.getFieldValue('title')}</h3>
              {fileList.length > 0 ? (
                <div className='my-4 h-48 bg-gray-200 rounded flex items-center justify-center'>
                  <img
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    src={URL.createObjectURL(fileList[0] as any) || '/placeholder.svg'}
                    alt='Preview'
                    className='max-h-full object-contain'
                  />
                </div>
              ) : (
                <div className='my-4 h-48 bg-gray-200 rounded flex items-center justify-center'>
                  <PictureOutlined className='text-4xl text-gray-400' />
                </div>
              )}
              <p className='text-gray-600 mb-2'>{form.getFieldValue('excerpt')}</p>
              <p className='text-gray-800 whitespace-pre-line'>
                {form.getFieldValue('content')?.substring(0, 200)}
                {form.getFieldValue('content')?.length > 200 ? '...' : ''}
              </p>
              <div className='mt-4 flex flex-wrap gap-2'>
                {form.getFieldValue('tags')?.map((tag: string) => (
                  <span key={tag} className='px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded'>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className='text-gray-400'>Fill in the form to see a preview</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormBlog
