import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Form, Input, Button, Select, DatePicker, Switch, Space, Upload, UploadFile, UploadProps, message } from 'antd'
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, UploadOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchListRoleAPI } from '@/apis/role.api'
import { createUserAPI } from '@/apis/user.api'

const { Option } = Select

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
}

interface IUserFormValues {
  fullname: string;
  email: string;
  password: string;
  phone?: string;
  role: string;
  avatar?: string;
  gender: string;
  birthday?: Date;
  address?: Address;
  type: string;
  isVerified?: boolean;
}

const CreateUserPage = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [fileList, setFileList] = useState<UploadFile[]>([])

  // Fetch roles
  const { data: roles } = useQuery({
    queryKey: ['fetch-roles'],
    queryFn: async () => {
      try {
        const { data: results } = await fetchListRoleAPI({ current: 1, pageSize: 100 })
        return results?.result?.flat() as IRole[]
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('🚀 ~ error:', error)
      }
    }
  })


  // Handle image upload
  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList || [])
  }

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('You can only upload image files!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!')
    }
    return isImage && isLt2M
  }

  // Custom upload handler (replace with actual API endpoint)
  const uploadProps: UploadProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text'
    },
    onChange: handleUploadChange,
    beforeUpload,
    fileList,
    listType: 'picture',
    maxCount: 1,
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true
    }
  }

  const createUserMutation = useMutation({
    mutationFn: async (data: IUserFormValues) => {
      const result = await createUserAPI(data)
      return result
    },
    onSuccess: (result) => {
      if (result.data) {
        message.success(`Người dùng ${result.data?.fullname} đã được tạo thành công.`)
        form.resetFields()
        navigate('/')
      } else {
        message.error(`Đã có lỗi xảy ra: ${result.message}`)
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Đã có lỗi xảy ra')
    }
  })

  const handleSubmit = async (values: IUserFormValues): Promise<void> => {
    const avatarUrl = fileList.length > 0 && fileList[0].response
      ? fileList[0].response.url
      : fileList[0]?.thumbUrl || values.avatar

    const newUser = {
      ...values,
      avatar: avatarUrl
    }
    // eslint-disable-next-line no-console
    console.log('Created user:', newUser)
    createUserMutation.mutate(newUser)
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Create New User</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            fullname: '',
            email: '',
            password: '',
            phone: '',
            role: '',
            avatar: '',
            gender: '',
            birthday: null,
            address: { street: '', city: '', state: '', country: '' },
            type: '',
            isVerified: false
          }}
        >
          {/* Avatar Upload */}
          <Form.Item
            label="Hình ảnh"
            name="avatar"
          >
            <Upload
              {...uploadProps}
              disabled={createUserMutation.isPending}
              className="w-full"
            >
              <Button icon={<UploadOutlined />} disabled={createUserMutation.isPending}>
                Click to Upload Avatar
              </Button>
            </Upload>
          </Form.Item>

          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Form.Item
              name="fullname"
              label="Họ tên"
              rules={[{ required: true, message: 'Họ tên không được để trống.' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="John Doe"
                className="w-full"
                disabled={createUserMutation.isPending}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Họ tên không được để trống.' },
                { type: 'email', message: 'Email không đúng định dạng.' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="john.doe@example.com"
                className="w-full"
                disabled={createUserMutation.isPending}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Mật khẩu không được để trống.' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="********"
                className="w-full"
                disabled={createUserMutation.isPending}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="(+84) 034567890"
                className="w-full"
                disabled={createUserMutation.isPending}
              />
            </Form.Item>
          </div>

          {/* Role and Type */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Form.Item
              name="role"
              label="Vai trò"
              rules={[{ required: true, message: 'Vai trò không được để trống.' }]}
            >
              <Select placeholder="Select a role" disabled={createUserMutation.isPending}>
                {roles?.map((role: IRole) => (
                  <Option key={role._id} value={role?._id}>
                    {role?.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: 'Type không được để trống.' }]}
            >
              <Select placeholder="Select a type" disabled={createUserMutation.isPending}>
                <Option value="SYSTEM">SYSTEM</Option>
                <Option value="GOOGLE">GOOGLE</Option>
                <Option value="FACEBOOK">FACEBOOK</Option>
              </Select>
            </Form.Item>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: 'Giới tính không được để trống.' }]}
            >
              <Select placeholder="Select gender" disabled={createUserMutation.isPending}>
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="birthday"
              label="Ngày sinh"
            >
              <DatePicker className="w-full" disabled={createUserMutation.isPending} />
            </Form.Item>
          </div>

          {/* Address */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Địa chỉ</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Form.Item name={['address', 'street']} label="Chi tiết">
                <Input placeholder="123 Main St" disabled={createUserMutation.isPending} />
              </Form.Item>
              <Form.Item name={['address', 'city']} label="Huyện">
                <Input placeholder="New York" disabled={createUserMutation.isPending} />
              </Form.Item>
              <Form.Item name={['address', 'state']} label="Tỉnh">
                <Input placeholder="NY" disabled={createUserMutation.isPending} />
              </Form.Item>
              <Form.Item name={['address', 'country']} label="Quốc gia">
                <Input placeholder="Việt Nam" disabled={createUserMutation.isPending} />
              </Form.Item>
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Form.Item name="avatar" label="Avatar URL">
              <Input placeholder="https://example.com/avatar.jpg" disabled={createUserMutation.isPending} />
            </Form.Item>

            <Form.Item name="isVerified" label="Verified" valuePropName="checked">
              <Switch disabled={createUserMutation.isPending} />
            </Form.Item>
          </div>

          {/* Submit Buttons */}
          <Form.Item>
            <Space className="w-full justify-end">
              <Button
                onClick={() => navigate('/')}
                disabled={createUserMutation.isPending}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Đóng
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createUserMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Tạo mới
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default CreateUserPage
