import { ConfigProvider, theme } from 'antd'
import Routers from './routers/routers'
import { useAppSelector } from './redux/hooks'

const App = () => {
  const currentTheme = useAppSelector(state => state.app.themeMode)

  return (
    <>
      <ConfigProvider theme={{ algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
        <Routers />
      </ConfigProvider>
    </>
  )
}

export default App
