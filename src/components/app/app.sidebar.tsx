import { signoutAPI } from '@/apis/auth.apis'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { signout } from '@/redux/slices/auth.slice'
import { DashboardOutlined, ProductOutlined, UserOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Button, Menu, MenuProps, message } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { Link, useLocation, useNavigate } from 'react-router'

const items: MenuProps['items'] = [
  {
    key: 'overview',
    type: 'group',
    label: 'Tổng quan',
    children: [
      {
        key: '/',
        icon: <DashboardOutlined />,
        label: <Link to={'/'}>Thống kê</Link>
      }
    ]
  },
  {
    key: 'management',
    type: 'group',
    label: 'Quản lý',
    children: [
      {
        key: '/users',
        icon: <UserOutlined />,
        label: <Link to={'/users'} style={{ color: 'inherit' }}>Người dùng</Link>
      },
      {
        key: '/categories',
        icon: <UserOutlined />,
        label: <Link to={'/categories'} style={{ color: 'inherit' }}>Danh mục</Link>
      },
      {
        key: '/products',
        icon: <ProductOutlined />,
        label: <Link to={'/products'}>Sản phẩm</Link>
      },
      {
        key: '/blogs',
        icon: <ProductOutlined />,
        label: <Link to={'/blogs'}>Blog</Link>
      }
    ]
  }
]

const AppSidebar = () => {
  const isOpenDrawer = useAppSelector((state) => state.app.isOpenSidebar)
  const currentTheme = useAppSelector(state => state.app.themeMode)
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const signoutMutation = useMutation({
    mutationFn: async () => {
      const result = await signoutAPI()
      return result
    },
    onSuccess: (result) => {
      if (result.data) {
        dispatch(signout())
        message.success(`🦄 ${result.message}.`)
        navigate('/')
      } else {
        message.error(`🦄 ${result.message}`)
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Đã có lỗi xảy ra')
    }
  })

  const handleSignout = () => {
    signoutMutation.mutate()
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={!isOpenDrawer}
      width={250}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        scrollbarWidth: 'thin',
        scrollbarGutter: 'stable',
        background: currentTheme === 'light' ? 'white' : ''
      }}
      // style={{ overflow: 'auto', height: '100vh', background: currentTheme === 'light' ? 'white' : '' }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        padding: '0 0 20px 0'
      }}>
        <section>

          <Menu
            theme={currentTheme === 'light' ? 'light' : 'dark'}
            mode='inline'
            style={{ minHeight: '100%' }}
            selectedKeys={[location.pathname]}
            defaultSelectedKeys={['/']}
            items={items}
          />
        </section>
        <section className='px-4'>
          <Button
            type="primary"
            className='w-full'
            onClick={handleSignout}
            loading={signoutMutation.isPending}
          >
            Đăng xuất
          </Button>
        </section>
      </div>

    </Sider>
  )
}

export default AppSidebar
