import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import LogoutIcon from '@mui/icons-material/Logout'
import { styled, Theme, CSSObject } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useNavigate } from 'react-router'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router'
import ModeThemeSelect from '@/themes/mode.theme'
import { signout } from '@/redux/slices/auth.slice'
import AttributionIcon from '@mui/icons-material/Attribution'

const openedMixin = (theme: Theme): CSSObject => ({
  width: theme.kanban.appAside,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: theme.kanban.appAside,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme)
        }
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme)
        }
      }
    ]
  })
)


const AppDrawer = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const stateDrawer = useAppSelector(state => state.app.isOpenDrawer)

  const handleSignOut = () => {
    dispatch(signout())
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer variant="permanent" open={stateDrawer}>
        <DrawerHeader>
          <Link
            component={RouterLink}
            to={'/'}
            sx={{
              fontSize: '24px',
              fontWeight: 500,
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            {stateDrawer ? 'KANBAN' : 'K' }
          </Link>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            { text: 'Bảng điều khiển', icon: <DashboardIcon />, url: '/' },
            { text: 'Khách hàng', icon: <PeopleIcon />, url: '/customers' },
            { text: 'Đơn hàng', icon: <ShoppingCartIcon />, url: '/orders' },
            { text: 'Vai trò', icon: <AttributionIcon />, url: '/roles' }
          ].map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => navigate(`${item.url}`)}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  justifyContent: stateDrawer ? 'initial' : 'center'
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                  mr: stateDrawer ? 3 : 'auto'
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: stateDrawer ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        <List sx={{ mb: 3 }}>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 2.5,
                justifyContent: stateDrawer ? 'initial' : 'center'
              }}
            >
              <ModeThemeSelect />
            </ListItemButton>
          </ListItem>
        </List>

        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }} />
        <Divider />
        <List sx={{ mb: 3 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleSignOut()}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary={'Đăng xuất'} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  )
}

export default AppDrawer
