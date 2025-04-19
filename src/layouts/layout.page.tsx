import { Layout, theme } from 'antd'
import AppHeader from '@/components/app/app.header'
import AppSidebar from '@/components/app/app.sidebar'
import AppFooter from '@/components/app/app.footer'
import { Outlet } from 'react-router'

const { Content } = Layout

const LayoutPage = () => {
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken()

  return (
    <Layout hasSider>
      <AppSidebar />
      <Layout style={{ overflow: 'auto', position: 'relative' }}>
        <AppHeader />
        <Content style={{ margin: '16px' }}>
          <div className="" style={{
            padding: 24,
            height: '100%',
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}>
            <Outlet />
          </div>
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  )
}

export default LayoutPage
