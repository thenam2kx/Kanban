import { Layout, theme } from 'antd'
import AppHeader from '@/components/app/app.header'
import AppSidebar from '@/components/app/app.sidebar'
import AppFooter from '@/components/app/app.footer'
import { Outlet } from 'react-router'

const { Content } = Layout

const LayoutPage = () => {
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSidebar />
      <Layout>
        <AppHeader />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}
        >
          <Outlet />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  )
}

export default LayoutPage
