import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setStateSidebar } from '@/redux/slices/app.slice'
import ThemeSelect from '@/themes/theme.select'
import { BellOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Dropdown, Flex, MenuProps, Space, theme, Tooltip } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { Link } from 'react-router'

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <Link rel="noopener noreferrer" to="/">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <SettingOutlined />
          Tài khoản
        </div>
      </Link>
    )
  },
  {
    key: '2',
    label: (
      <Link rel="noopener noreferrer" to="/">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoutOutlined />
          Đăng xuất
        </div>
      </Link>
    )
  }
]

const AppHeader = () => {
  const dispatch = useAppDispatch()
  const isOpenSidebar = useAppSelector((state) => state.app.isOpenSidebar)

  const { token: { colorBgContainer } } = theme.useToken()

  return (
    <Header style={{
      background: colorBgContainer,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px 0 0'
    }}>
      <Button
        type='text'
        icon={isOpenSidebar ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => dispatch(setStateSidebar())}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <ThemeSelect />

        <Flex gap="small" vertical>
          <Flex wrap gap="small">
            <Tooltip title="Thông báo">
              <Badge size='small' count={5}>
                <Button type="default" shape="circle" icon={<BellOutlined />} />
              </Badge>
            </Tooltip>
          </Flex>
        </Flex>

        <Dropdown menu={{ items }} trigger={['click']}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Avatar size={'default'} icon={<UserOutlined />} />
            </Space>
          </a>
        </Dropdown>
      </div>
    </Header>
  )
}

export default AppHeader
