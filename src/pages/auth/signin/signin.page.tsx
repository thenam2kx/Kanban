import { Button, Checkbox, Form, Input, Card, Typography, Divider, message } from 'antd'
import { LockIcon as LockOutlined, UserRoundIcon as UserOutlined } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { signinAPI } from '@/apis/auth.apis'
import { useNavigate } from 'react-router'
import { useAppDispatch } from '@/redux/hooks'
import { signin } from '@/redux/slices/auth.slice'

const { Title, Text } = Typography

interface SignInFormValues {
  username: string
  password: string
  remember: boolean
}

const SigninPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const signinMutation = useMutation({
    mutationFn: async (data: ISignin) => {
      const result = await signinAPI(data)
      return result
    },
    onSuccess: (result, variables) => {
      if (result.data) {
        const user = {
          ...result.data.user,
          permissions: result.data.user.permissions.map((permission: string) => ({
            _id: permission,
            name: permission,
            apiPath: '',
            method: '',
            module: ''
          }))
        }
        dispatch(signin({ user, accessToken: result?.data?.access_token as string }))
        message.success(`🦄 ${result.message}.`)
        navigate('/')
      } else if (result.statusCode === 401) {
        message.error(`🦄 ${result.message}`)
        navigate(`/verify-account?email=${encodeURIComponent(variables.username)}`)
      } else {
        message.error(`🦄 ${result.message}`)
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Đã có lỗi xảy ra')
    }
  })

  const onFinish = async (values: SignInFormValues) => {
    signinMutation.mutate({ username: values.username, password: values.password })
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50 p-4'>
      <Card className='w-full max-w-md shadow-md'>
        <div className='text-center mb-6'>
          <Title level={2} className='mb-2'>
            Đăng nhập
          </Title>
          <Text type='secondary'>Vui lòng nhập thông tin của bạn</Text>
        </div>

        <Form name='signin' initialValues={{ remember: true }} onFinish={onFinish} layout='vertical' size='large'>
          <Form.Item name='username' rules={[{ required: true, message: 'Email không được để trống!' }]}>
            <Input prefix={<UserOutlined className='mr-2' size={16} />} placeholder='email@gmail.com' />
          </Form.Item>

          <Form.Item name='password' rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}>
            <Input.Password prefix={<LockOutlined className='mr-2' size={16} />} placeholder='******' />
          </Form.Item>

          <div className='flex justify-between items-center mb-4'>
            <Form.Item name='remember' valuePropName='checked' noStyle>
              <Checkbox>Ghi nhớ</Checkbox>
            </Form.Item>
            <a className='text-primary hover:text-primary-dark'>Quên mật khẩu?</a>
          </div>

          <Form.Item>
            <Button type='primary' htmlType='submit' className='w-full' loading={signinMutation.isPending}>
              Đăng nhập
            </Button>
          </Form.Item>

          <Divider plain>Hoặc</Divider>

          <div className='text-center'>
            <Text type='secondary'>Bạn chưa có tài khoản?</Text>{' '}
            <a className='text-primary hover:text-primary-dark' onClick={() => navigate('/signup')}>Đăng ký</a>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default SigninPage
