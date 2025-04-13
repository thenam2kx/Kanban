import { Button, Form, Input, Card, Typography, Divider, message } from 'antd'
import { LockIcon as LockOutlined, UserRoundIcon as UserOutlined } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { signupAPI } from '@/apis/auth.apis'
import { useNavigate } from 'react-router'

const { Title, Text } = Typography

interface SignInFormValues {
  fullname: string
  username: string
  password: string
}

const SignupPage = () => {
  const navigate = useNavigate()

  const signupMutation = useMutation({
    mutationFn: async (data: ISignup) => {
      const result = await signupAPI(data)
      return result
    },
    onSuccess: (result, variables) => {
      if (result.data) {
        navigate(`/verify-account?email=${encodeURIComponent(variables.email)}`)
        message.success(`🦄 ${result.message}.`)
      } else {
        message.error(result.message)
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Đã có lỗi xảy ra')
    }
  })

  const onFinish = async (values: SignInFormValues) => {
    signupMutation.mutate({ fullname: values.fullname, email: values.username, password: values.password })
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50 p-4'>
      <Card className='w-full max-w-md shadow-md'>
        <div className='text-center mb-6'>
          <Title level={2} className='mb-2'>
            Đăng ký
          </Title>
          <Text type='secondary'>Vui lòng nhập thông tin của bạn</Text>
        </div>

        <Form name='signin' initialValues={{ remember: true }} onFinish={onFinish} layout='vertical' size='large'>
          <Form.Item name='fullname' rules={[{ required: true, message: 'Họ tên không được để trống!' }]}>
            <Input prefix={<UserOutlined className='mr-2' size={16} />} placeholder='Ho ten' />
          </Form.Item>

          <Form.Item name='username' rules={[{ required: true, message: 'Email không được để trống!' }]}>
            <Input prefix={<UserOutlined className='mr-2' size={16} />} placeholder='email@gmail.com' />
          </Form.Item>

          <Form.Item name='password' rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}>
            <Input.Password prefix={<LockOutlined className='mr-2' size={16} />} placeholder='******' />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' className='w-full' loading={signupMutation.isPending}>
              Đăng ký
            </Button>
          </Form.Item>

          <Divider plain>Hoặc</Divider>

          <div className='text-center'>
            <Text type='secondary'>Bạn đã có tài khoản?</Text>{' '}
            <a className='text-primary hover:text-primary-dark'>Đăng nhập</a>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default SignupPage
