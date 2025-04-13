import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Form, Input, Button, Select, DatePicker, Switch, Space, Upload, UploadFile, UploadProps, message } from 'antd'
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, UploadOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchListRoleAPI } from '@/apis/role.api'
import { fetchInfoUserAPI, updateUserAPI } from '@/apis/user.api'
import day from 'dayjs'

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
  password?: string; // Optional for update
  phone?: string;
  role: string;
  avatar?: string;
  gender: string;
  birthday?: Date | null;
  address?: Address;
  type: string;
  isVerified?: boolean;
}

const UpdateUserPage = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { id: userId } = useParams() // Get user ID from URL params
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

  // Fetch user data
  const { data: userData, isLoading } = useQuery({
    queryKey: ['fetch-user', userId],
    queryFn: async () => {
      const { data } = await fetchInfoUserAPI(userId!)
      return data
    },
    enabled: !!userId
  })

  // Populate form with user data
  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        ...userData,
        birthday: userData.birthday ? day(userData.birthday) : null,
        avatar: userData.avatar || ''
      })
      if (userData.avatar) {
        setFileList([{ uid: '-1', name: 'avatar', status: 'done', url: userData.avatar }])
      }
    }
  }, [userData, form])

  // Handle image upload
  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList || [])
  }

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('You can only upload image files!')
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!')
      return false
    }
    return true
  }

  const uploadProps: UploadProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76', // Replace with actual upload endpoint
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

  const updateUserMutation = useMutation({
    mutationFn: async (data: IUserFormValues) => {
      const result = await updateUserAPI(userId, data)
      return result
    },
    onSuccess: (result) => {
      if (result.data) {
        message.success(`User ${result.data?.fullname} updated successfully.`)
        navigate('/users')
      } else {
        message.error(`An error occurred: ${result.message}`)
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'An error occurred')
    }
  })

  const handleSubmit = async (values: IUserFormValues): Promise<void> => {
    const avatarUrl = fileList.length > 0 && fileList[0].response
      ? fileList[0].response.url
      : fileList[0]?.url || fileList[0]?.thumbUrl || values.avatar

    const updatedUser = {
      ...values,
      avatar: avatarUrl,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      role: values?.role?._id
    }
    updateUserMutation.mutate(updatedUser)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Update User</h2>
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
          <Form.Item label="Avatar" name="avatar">
            <Upload
              {...uploadProps}
              disabled={updateUserMutation.isPending}
              className="w-full"
            >
              <Button icon={<UploadOutlined />} disabled={updateUserMutation.isPending}>
                Update Avatar
              </Button>
            </Upload>
          </Form.Item>

          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Form.Item
              name="fullname"
              label="Full Name"
              rules={[{ required: true, message: 'Full name is required.' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="John Doe"
                className="w-full"
                disabled={updateUserMutation.isPending}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Email is required.' },
                { type: 'email', message: 'Invalid email format.' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="john.doe@example.com"
                className="w-full"
                disabled={updateUserMutation.isPending}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Form.Item
              name="password"
              label="Password"
              rules={[{ min: 6, message: 'Password must be at least 6 characters.' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Leave blank to keep current password"
                className="w-full"
                disabled={updateUserMutation.isPending}
              />
            </Form.Item>

            <Form.Item name="phone" label="Phone Number">
              <Input
                prefix={<PhoneOutlined />}
                placeholder="(+84) 034567890"
                className="w-full"
                disabled={updateUserMutation.isPending}
              />
            </Form.Item>
          </div>

          {/* Role and Type */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Role is required.' }]}
            >
              <Select placeholder="Select a role" disabled={updateUserMutation.isPending}>
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
              rules={[{ required: true, message: 'Type is required.' }]}
            >
              <Select placeholder="Select a type" disabled={updateUserMutation.isPending}>
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
              label="Gender"
              rules={[{ required: true, message: 'Gender is required.' }]}
            >
              <Select placeholder="Select gender" disabled={updateUserMutation.isPending}>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item name="birthday" label="Birthday">
              <DatePicker className="w-full" disabled={updateUserMutation.isPending} />
            </Form.Item>
          </div>

          {/* Address */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Form.Item name={['address', 'street']} label="Street">
                <Input placeholder="123 Main St" disabled={updateUserMutation.isPending} />
              </Form.Item>
              <Form.Item name={['address', 'city']} label="City">
                <Input placeholder="New York" disabled={updateUserMutation.isPending} />
              </Form.Item>
              <Form.Item name={['address', 'state']} label="State">
                <Input placeholder="NY" disabled={updateUserMutation.isPending} />
              </Form.Item>
              <Form.Item name={['address', 'country']} label="Country">
                <Input placeholder="Vietnam" disabled={updateUserMutation.isPending} />
              </Form.Item>
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Form.Item name="avatar" label="Avatar URL">
              <Input placeholder="https://example.com/avatar.jpg" disabled={updateUserMutation.isPending} />
            </Form.Item>

            <Form.Item name="isVerified" label="Verified" valuePropName="checked">
              <Switch disabled={updateUserMutation.isPending} />
            </Form.Item>
          </div>

          {/* Submit Buttons */}
          <Form.Item>
            <Space className="w-full justify-end">
              <Button
                onClick={() => navigate('/users')}
                disabled={updateUserMutation.isPending}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateUserMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Update
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default UpdateUserPage
