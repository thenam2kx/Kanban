import { Space, Spin } from 'antd'

const AppLoading = () => {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Space direction="vertical" style={{ textAlign: 'center' }}>
        <Spin size="default" />
        <h2>Loading...</h2>
      </Space>
    </div>
  )
}

export default AppLoading
