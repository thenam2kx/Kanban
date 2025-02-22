import { fetchInfoUserAPI } from '@/apis/user.api'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import styled from '@mui/material/styles/styled'
import EditIcon from '@mui/icons-material/Edit'
import Grid from '@mui/material/Grid2'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import OrderHistory from './order.history'
import EditCustomer from '../edit.customer/edit.customer'
import { useAppDispatch } from '@/redux/hooks'
import { setOpenDrawerEdit, setUserId } from '@/redux/slices/user.slice'

const SectionTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2)
}))

const InfoRow = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2)
}))


const DetailCustomer = () => {
  const [user, setUser] = useState<ICustomer | undefined>()
  const { id } = useParams<{ id: string }>()
  console.log('🚀 ~ DetailCustomer ~ user:', user)
  const dispatch = useAppDispatch()

  const handleEdit = () => {
    dispatch(setUserId(id as string))
    dispatch(setOpenDrawerEdit(true))
  }


  useEffect(() => {
    (async () => {
      const res = await fetchInfoUserAPI(id as string)
      if (res.data) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setUser(res.data)
      }
    })()
  }, [id])
  return (
    <Box>
      {/* Header Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid>
            <Avatar
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-glL7KkAQPaLCopmDdi2jS3r3YZ6OGa.png"
              sx={{ width: 100, height: 100 }}
            />
          </Grid>

          <Grid flex={1}>
            <Typography variant="h5" gutterBottom>
              {user?.fullname}
            </Typography>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              UI - UX Designer
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Product Department
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  Số điện thoại:
                </Typography>
                <Typography variant="body1">{user?.phone}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  Quyền hạn:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: user?.role?.name === 'SUPER_ADMIN' ? 'red' : 'text.primary' }}
                >
                  {user?.role?.name ? user?.role?.name : 'USER'}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  Email:
                </Typography>
                <Typography variant="body1">{user?.email}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary">
                  Trạng thái:
                </Typography>
                <Typography variant="body1">{user?.isVerified ? 'Đã kích hoạt' : 'Chưa kích hoạt'}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Personal Information Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <SectionTitle>
          <Typography variant="h6">Thông tin chi tiết</Typography>
          <IconButton size="small" onClick={() => handleEdit()}>
            <EditIcon />
          </IconButton>
        </SectionTitle>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoRow container>
              <Grid size={4}>
                <Typography color="text.secondary">ID tài khoản</Typography>
              </Grid>
              <Grid size={8}>
                <Typography>{user?._id}</Typography>
              </Grid>
            </InfoRow>
            <InfoRow container>
              <Grid size={4}>
                <Typography color="text.secondary">Loại tài khoản</Typography>
              </Grid>
              <Grid size={8}>
                <Typography>{user?.type}</Typography>
              </Grid>
            </InfoRow>
            <InfoRow container>
              <Grid size={4}>
                <Typography color="text.secondary">Giới tính</Typography>
              </Grid>
              <Grid size={8}>
                <Typography>{user?.gender === 'MALE' ? 'Nam' : 'Nữ'}</Typography>
              </Grid>
            </InfoRow>
            <InfoRow container>
              <Grid size={4}>
                <Typography color="text.secondary">Ngày sinh</Typography>
              </Grid>
              <Grid size={8}>
                <Typography>19/05/2005</Typography>
              </Grid>
            </InfoRow>
            <InfoRow container>
              <Grid size={4}>
                <Typography color="text.secondary">Địa chỉ</Typography>
              </Grid>
              <Grid size={8}>
                <Typography>Hai Duong city</Typography>
              </Grid>
            </InfoRow>
          </Grid>
        </Grid>
      </Paper>

      {/* Education Information Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <SectionTitle>
          <Typography variant="h6">Education information</Typography>
          <IconButton size="small">
            <EditIcon />
          </IconButton>
        </SectionTitle>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Bachelor in Management Information System
              </Typography>
              <Typography color="text.secondary">
                National Economic University
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2014-2018
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">
                Certificate of Graphic Design
              </Typography>
              <Typography color="text.secondary">
                FPT Arena University
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2018-2019
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>


      <OrderHistory />
      <EditCustomer />

    </Box>
  )
}

export default DetailCustomer
