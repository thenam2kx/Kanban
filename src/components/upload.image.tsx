// src/components/ImageUpload.tsx
import React, { useState, useEffect } from 'react'
import { Upload, Button } from 'antd'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'

interface ImageUploadProps {
  type?: string
  initialPreview?: string | null
  maxSizeMB?: number
  validTypes?: string[]
  onImageChange?: (url: string | null, file: File | null) => void
  disabled?: boolean
}

const UploadImage: React.FC<ImageUploadProps> = ({
  type = 'general',
  initialPreview = null,
  maxSizeMB = 2,
  validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  onImageChange,
  disabled = false
}) => {
  console.log('🚀 ~ type:', type)
  const [imageFile, setImageFile] = useState<File | null>(null)
  console.log('🚀 ~ imageFile:', imageFile)
  const [imagePreview, setImagePreview] = useState<string | null>(initialPreview)
  const [imageError, setImageError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageChange = (options: any) => {
    const { file } = options
    if (!(file instanceof File)) {
      setImageError('Invalid file type')
      return
    }
    if (!validTypes.includes(file.type)) {
      setImageError(`Only ${validTypes.join(', ')} files are accepted`)
      return
    }
    const fileSizeMB = file.size / 1024 / 1024
    if (fileSizeMB > maxSizeMB) {
      setImageError(`Image size must not exceed ${maxSizeMB}MB`)
      return
    }
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
    setImageFile(file)
    setImageError(null)
    onImageChange?.(previewUrl, file)
  }

  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(null)
    setImageFile(null)
    setImageError(null)
    onImageChange?.(null, null)
  }

  useEffect(() => {
    setImagePreview(initialPreview)
  }, [initialPreview])

  return (
    <div>
      {imagePreview ? (
        <div className="relative inline-block">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-w-full max-h-48 rounded"
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={handleRemoveImage}
            className="absolute top-0 right-0"
            disabled={disabled}
          />
        </div>
      ) : (
        <Upload
          accept={validTypes.join(',')}
          showUploadList={false}
          customRequest={handleImageChange}
          disabled={disabled}
        >
          <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center hover:border-blue-500 hover:bg-gray-50 cursor-pointer">
            <UploadOutlined className="text-3xl text-blue-500" />
            <p className="mt-2">Drag and drop or click to upload image</p>
            <p className="text-gray-500 text-sm">
              Supports {validTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}. Max {maxSizeMB}MB.
            </p>
            {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
          </div>
        </Upload>
      )}
    </div>
  )
}

export default UploadImage
