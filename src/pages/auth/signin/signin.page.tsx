import { useState } from 'react'
import { toast } from 'react-toastify'
import { Link as RouterLink, useNavigate } from 'react-router'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CustomizeCard from '@/pages/auth/customizations/card.customize'
import { SitemarkIcon } from '@/pages/auth/customizations/icons.customize'
import CustomizeContainer from '@/pages/auth/customizations/container.customize'
import SocialMedia from '../customizations/social.media'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LoadingButton from '@mui/lab/LoadingButton'
import { signinAPI } from '@/apis/auth.apis'
import { useAppDispatch } from '@/redux/hooks'
import { signin } from '@/redux/slices/auth.slice'
import SigninSchema from '@/validations/auth.validations/signin.validate'

const SigninPage = () => {
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Get data from form
    const data = new FormData(event.currentTarget)
    const email = data.get('email') as string
    const password= data.get('password') as string

    // Validate data
    const { error } = SigninSchema.validate({ email, password }, { abortEarly: false })
    if (error) {
      error.details.forEach((err) => {
        if (err.path[0] === 'email') {
          setEmailError(true)
          setEmailErrorMessage(err.message)
        }
        if (err.path[0] === 'password') {
          setPasswordError(true)
          setPasswordErrorMessage(err.message)
        }
      })
    }

    try {
      setIsLoading(true)
      const res = await signinAPI({ username: email, password })
      if (res.data) {
        const user = {
          ...res.data.user,
          permissions: res.data.user.permissions.map((permission: string) => ({
            _id: permission,
            name: permission,
            apiPath: '',
            method: '',
            module: ''
          }))
        }
        dispatch(signin({ user, accessToken: res.data.access_token }))
        toast.success(`🦄 ${res.message}`)
        navigate('/')
      } else if (res.statusCode === 401) {
        toast.error(`🦄 ${res.message}`)
        navigate(`/verify-account?email=${encodeURIComponent(email)}`)
      } else {
        toast.error(`🦄 ${res.message}`)
      }

    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('🚀 ~ handleSubmit ~ error:', error)
    } finally {
      setIsLoading(false)
    }

  }


  return (
    <CustomizeContainer>
      <CustomizeCard>
        <SitemarkIcon />
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Đăng nhập
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="email@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? 'error' : 'primary'}
              size='small'
              sx={{ mt: '6px' }}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password" sx={{ '&.Mui-focused': { color: 'inherit' } }}>Mật khẩu</FormLabel>
            <OutlinedInput
              id="password"
              size='small'
              name="password"
              autoFocus
              required
              fullWidth
              placeholder="••••••"
              autoComplete="current-password"
              error={passwordError}
              color={passwordError ? 'error' : 'primary'}
              type={showPassword ? 'text' : 'password'}
              sx={{ mt: '6px' }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? 'hide the password' : 'display the password'
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {!!passwordErrorMessage && (
              <FormHelperText error id="accountId-error">
                {passwordErrorMessage}
              </FormHelperText>
            )}
          </FormControl>
          <FormControlLabel
            name='remember'
            control={<Checkbox value="remember" color="primary" />}
            label="Ghi nhớ cho lần sau"
            sx={{ width: 'fit-content' }}
          />
          <LoadingButton
            type="submit"
            size="medium"
            // onClick={validateInputs}
            loading={isLoading}
            loadingPosition="center"
            variant="contained"
            sx={{ '&.Mui-disabled': { bgcolor: 'primary.main' } }}
          >
            Đăng nhập
          </LoadingButton>

          <Link
            component={RouterLink}
            to={'/forgot-password'}
            variant="body2"
            sx={{ alignSelf: 'center' }}
          >
            Quên mật khẩu?
          </Link>
        </Box>
        <SocialMedia
          txtFacebook='Đăng nhập với Facebook'
          txtGoogle='Đăng nhập với Google'
          txtsub='Chưa có tài khoản ?'
          txtRedirect='Đăng ký'
          urlDirect='/signup'
        />
      </CustomizeCard>
    </CustomizeContainer>
  )
}

export default SigninPage
