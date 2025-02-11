import AppDrawer from './components/app/app.drawer'
import AppBarTop from './components/app/app.bar.top'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Outlet } from 'react-router'
import { useAppSelector } from './redux/hooks'

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: open ? `-${theme.kanban.appAside}px` : `-${theme.spacing(7)}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
}))


const Layout = () => {
  const stateDrawer = useAppSelector(state => state.app.isOpenDrawer)


  return (
    <Box sx={{ display: 'flex' }}>
      <AppBarTop />
      <AppDrawer />
      <Main open={stateDrawer}>
        <Box sx={{ height: 64 }} />
        <Outlet />
      </Main>
    </Box>
  )
}

export default Layout