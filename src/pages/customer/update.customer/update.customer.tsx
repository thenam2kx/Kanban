import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchDetailUser, fetchListUsers, setIsLoading, setOpenModalUpdate } from '@/redux/slices/user.slice'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Avatar from '@mui/material/Avatar'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { FormHelperText } from '@mui/material'
import { useEffect } from 'react'
import { fetchInfoUserAPI, fetchListRoleAPI, updateUserAPI } from '@/apis/user.api'
import { setRoles } from '@/redux/slices/role.slice'
import { toast } from 'react-toastify'
import Modal from '@mui/material/Modal'
import { useLocation } from 'react-router'

interface IFormInput {
  fullname: string
  email: string
  phone: string
  role: string
  gender: string
  avatar: string
  type: string
  isActive: boolean
}

const UpdateCustomer = () => {
  const location = useLocation()
  const { pathname } = location

  const userId = useAppSelector(state => state.user.userId)
  const roles = useAppSelector(state => state.role.roles)
  const listPaginate = useAppSelector((state) => state.user.listPaginate)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<IFormInput>({
    defaultValues: {
      fullname: '',
      email: '',
      phone: '',
      role: '',
      gender: '',
      avatar: '',
      type: '',
      isActive: false
    }
  })


  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      dispatch(setIsLoading(true))
      const { fullname, isActive, role, phone } = data
      const roleId = roles.find(r => r.name === role)?._id
      const res = await updateUserAPI({ userId, dataUpdate: { fullname, isVerified: isActive, role: roleId, phone } })
      if (res.data) {
        toast.success('Cập nhật thông tin người dùng thành công')
        dispatch(setOpenModalUpdate(false))
        if (pathname === '/customers') {
          await dispatch(fetchListUsers({ current: listPaginate.page === 0 ? listPaginate.page + 1 : listPaginate.page, pageSize: listPaginate.pageSize }))
        } else {
          await dispatch(fetchDetailUser({ userId: userId }))
        }
      }

    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('🚀 ~ onSubmit ~ error:', error)
    } finally {
      dispatch(setIsLoading(false))
    }
  }

  const dispatch = useAppDispatch()
  const openModalUpdate = useAppSelector(state => state.user.openModalUpdate)

  const toggleDrawer = (newOpen: boolean) => () => {
    dispatch(setOpenModalUpdate(newOpen))
  }

  useEffect(() => {
    (async () => {
      try {
        if (userId) {
          const res = await fetchInfoUserAPI(userId)
          if (res.data) {
            reset({
              fullname: res.data?.fullname,
              email: res.data?.email,
              phone: res.data?.phone,
              role: res.data?.role?.name || 'USER',
              gender: res.data?.gender === 'MALE' ? 'Nam' : 'Nữ',
              avatar: res.data?.avatar,
              type: res.data?.type,
              isActive: res.data?.isVerified
            })
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('🚀 ~ useEffect ~ error:', error)
      }
    })()
  }, [userId, reset])

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchListRoleAPI()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (res.data && res.data?.result) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
          dispatch(setRoles(res.data?.result))
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('🚀 ~ useEffect ~ error:', error)
      }
    })()
  }, [dispatch])


  return (
    <Modal
      open={openModalUpdate}
      onClose={() => toggleDrawer(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '40vw',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 2
      }}>
        <Typography
          variant='h4'
          sx={{ fontSize: '16px', flexGrow: 1, textAlign: 'center', mb: 2 }}
        >
          Cập nhật thông tin người dùng
        </Typography>

        <Box sx={{ padding: '12px 24px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
            <Avatar alt="Remy Sharp" src="https//" sx={{ height: 120, width: 120 }} />
          </Box>
          <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              <Grid size={12}>
                <TextField
                  error={!!errors.fullname}
                  fullWidth
                  label='Họ tên'
                  {...register('fullname', {
                    required: 'Họ tên không được để trống',
                    minLength: { value: 3, message: 'Họ tên phải có ít nhất 3 ký tự' },
                    maxLength: {
                      value: 50,
                      message: 'Họ tên không được vượt quá 50 ký tự'
                    },
                    pattern: {
                      value: /^[A-Za-zÀ-ỹ\s]+$/u,
                      message: 'Họ tên chỉ được chứa chữ cái và khoảng trắng'
                    }
                  })}
                  aria-describedby="fullname-error-text"
                />
                {
                  errors.fullname &&
                  <FormHelperText error={!!errors.fullname} id="fullname-error-text">
                    {errors.fullname.message}
                  </FormHelperText>
                }
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label='Địa chỉ email'
                  type='email'
                  {...register('email', {
                    required: 'Email không được để trống',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Email không đúng định dạng'
                    }
                  })}
                  error={!!errors.email}
                  aria-describedby="email-error-text"
                />
                {
                  errors.email &&
                  <FormHelperText error={!!errors.email} id="email-error-text">
                    {errors.email.message}
                  </FormHelperText>
                }
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label='Số điện thoại'
                  {...register('phone', {
                    required: 'Số điện thoại không được để trống',
                    pattern: {
                      value: /^(0|\+84)(3|5|7|8|9)\d{8}$/,
                      message: 'Số điện thoại không hợp lệ (VD: 0363560798 hoặc +84363560798)'
                    }
                  })}
                  error={!!errors.email}
                  aria-describedby="phone-error-text"
                />
                {
                  errors.phone &&
                  <FormHelperText error={!!errors.phone} id="phone-error-text">
                    {errors.phone.message}
                  </FormHelperText>
                }
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl sx={{ minWidth: 120, width: '100%' }} size="medium">
                  <InputLabel id="role">Vai trò</InputLabel>
                  <Controller
                    name="role"
                    control={control}
                    rules={{
                      required: 'Vai trò là bắt buộc',
                      validate: (value) =>
                        value !== '' || 'Vui lòng chọn ít nhất một vai trò'
                    }}
                    render={({ field }) => (
                      <Select
                        labelId="role"
                        id="select-role"
                        label="Vai trò"
                        {...field}
                        value={field.value || 'USER'}
                        onChange={(e) => field.onChange(e)}
                      >
                        {
                          roles && roles.length > 0 && roles.map(role => (
                            <MenuItem key={role._id} value={role.name}>{role.name}</MenuItem>
                          ))
                        }
                      </Select>
                    )}
                  />
                  {
                    errors.phone &&
                    <FormHelperText error={!!errors.phone} id="phone-error-text">
                      {errors.phone.message}
                    </FormHelperText>
                  }
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label='Giới tính'
                  {...register('gender', { required: true })}
                  name='type'
                  disabled
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label='Type'
                  {...register('type', { required: true })}
                  name='type'
                  disabled
                />
                {
                  errors.type && <Typography variant='caption' color='error'>{errors.type.message}</Typography>
                }
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          {...field}
                          checked={field.value}
                          color="primary"
                        />
                      }
                      label="Active User"
                    />
                  )}
                />
              </Grid>
              <Grid size={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant='outlined' color='secondary' onClick={() => dispatch(setOpenModalUpdate(false))}>
                    Đóng
                  </Button>
                  <Button type='submit' variant='contained' color='primary'>
                    Lưu thay đổi
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Modal>

  )
}

export default UpdateCustomer
