import { useState, useEffect } from 'react'
import { Button, Card, Form, Input, Switch, Upload, Space, message } from 'antd'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchInfoCategoryAPI, updateCategoryAPI } from '@/apis/category.apis'
import { useNavigate, useParams } from 'react-router'

const UpdateCategoryPage = () => {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm<ICategoryFormData>()

  const { data: infoCategory, isLoading } = useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const result = await fetchInfoCategoryAPI(id!)
      return result.data
    },
    enabled: !!id
  })

  // Clean up object URL when component unmounts or when image changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  // Populate form with category data
  useEffect(() => {
    if (infoCategory) {
      form.setFieldsValue({
        name: infoCategory.name,
        description: infoCategory.description,
        isPublished: infoCategory.isPublished,
        image: infoCategory.image || ''
      })
      setImagePreview(infoCategory.image || null)
    }
  }, [infoCategory, form])

  const handleImageChange = (info: { file: File }) => {
    const file = info.file

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setImageError('Only JPEG, PNG, GIF, WEBP files are accepted')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 / 1024) {
      setImageError('Image size must not exceed 2MB')
      return
    }

    // Clear previous preview
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    // Create new preview
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
    setImageFile(file)
    setImageError(null)
  }

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(null)
    setImageFile(null)
    form.setFieldsValue({ image: '' })
  }

  const updateCategoryMutation = useMutation({
    mutationFn: async (data: ICategoryFormData) => {
      const updatedData = {
        name: data.name,
        description: data.description,
        isPublished: data.isPublished,
        image: imageFile ? imagePreview || '' : data.image || ''
      }
      const result = await updateCategoryAPI(updatedData, id!)
      return result
    },
    onSuccess: (result) => {
      if (result.data) {
        message.success(result.message)
        form.resetFields()
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview)
          setImagePreview(null)
          setImageFile(null)
        }
        navigate('/categories')
      } else {
        message.error(`Error: ${result.message}`)
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'An error occurred')
    }
  })

  const onFinish = (values: ICategoryFormData) => {
    updateCategoryMutation.mutate(values)
  }

  const onReset = () => {
    form.resetFields()
    handleRemoveImage()
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <Card
      title="Update Category"
      extra={<span>Enter the details of the category</span>}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ name: '', description: '', isPublished: true, image: '' }}
      >
        <Form.Item
          label="Category Name"
          name="name"
          rules={[{ required: true, message: 'Category name is required' }]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} placeholder="Enter description" />
        </Form.Item>

        <Form.Item label="Image" name="image">
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Category preview"
                className="max-w-full max-h-48 rounded"
              />
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={handleRemoveImage}
                className="absolute top-0 right-0"
              />
            </div>
          ) : (
            <Upload
              accept="image/jpeg,image/png,image/gif,image/webp"
              showUploadList={false}
              customRequest={({ file }) => handleImageChange({ file: file as File })}
              beforeUpload={(file) => {
                const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)
                const isLt2M = file.size / 1024 / 1024 < 2
                if (!isValidType) message.error('Only JPEG, PNG, GIF, WEBP files are accepted')
                if (!isLt2M) message.error('Image must be smaller than 2MB')
                return isValidType && isLt2M
              }}
            >
              <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center hover:border-blue-500 hover:bg-gray-50 cursor-pointer">
                <UploadOutlined className="text-3xl text-blue-500" />
                <p className="mt-2">Drag and drop or click to upload image</p>
                <p className="text-gray-500 text-sm">Supports JPEG, PNG, GIF, WEBP. Max 2MB.</p>
                {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
              </div>
            </Upload>
          )}
        </Form.Item>

        <Form.Item label="Active" name="isPublished" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button
              onClick={onReset}
              disabled={updateCategoryMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateCategoryMutation.isPending}
              icon={<UploadOutlined />}
            >
              Save
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default UpdateCategoryPage
