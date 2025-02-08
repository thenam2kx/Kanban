import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CustomizeContainer from '@/pages/auth/customizations/container.customize'
import CustomizeCard from '@/pages/auth/customizations/card.customize'
import { SitemarkIcon } from '@/pages/auth/customizations/icons.customize'
import SocialMedia from '../customizations/social.media'
import { FormHelperText, IconButton, InputAdornment, OutlinedInput } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useNavigate } from 'react-router'

const SignupPage = () => {
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [nameError, setNameError] = useState(false)
  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement
    const password = document.getElementById('password') as HTMLInputElement
    const name = document.getElementById('name') as HTMLInputElement

    let isValid = true

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true)
      setEmailErrorMessage('Vui lòng nhập địa chỉ email.')
      isValid = false
    } else {
      setEmailError(false)
      setEmailErrorMessage('')
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true)
      setPasswordErrorMessage('Mật khẩu phải lớn hơn 6 ký tự.')
      isValid = false
    } else {
      setPasswordError(false)
      setPasswordErrorMessage('')
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true)
      setNameErrorMessage('Họ tên không được để trống.')
      isValid = false
    } else {
      setNameError(false)
      setNameErrorMessage('')
    }

    return isValid
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (nameError || emailError || passwordError) {
      toast.error('🦄 Email hoặc mật khẩu không hợp lệ!')
      return
    }

    const data = new FormData(event.currentTarget)
    const fullname = data.get('name') as string
    const email = data.get('email') as string
    const password = data.get('password') as string

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
          Đăng ký
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="name">Họ tên</FormLabel>
            <TextField
              autoComplete="name"
              name="name"
              required
              fullWidth
              id="name"
              placeholder="nexthub 123"
              error={nameError}
              helperText={nameErrorMessage}
              color={nameError ? 'error' : 'primary'}
              size='small'
              sx={{ mt: '6px' }}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              required
              fullWidth
              id="email"
              placeholder="email@gmail.com"
              name="email"
              autoComplete="email"
              variant="outlined"
              error={emailError}
              helperText={emailErrorMessage}
              color={passwordError ? 'error' : 'primary'}
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
            control={<Checkbox value="allowExtraEmails" color="primary" />}
            label="Nhận thông báo qua email"
          />

          <LoadingButton
            type="submit"
            size="medium"
            onClick={validateInputs}
            loading={isLoading}
            loadingPosition="center"
            variant="contained"
            sx={{ '&.Mui-disabled': { bgcolor: 'primary.main', opacity: 0.5, cursor: 'wait' } }}
          >
            Đăng ký
          </LoadingButton>
        </Box>
        <SocialMedia
          txtFacebook='Đăng ký với Facebook'
          txtGoogle='Đăng ký với Google'
          txtsub='Bạn đã có tài khoản ?'
          txtRedirect='Đăng nhập'
          urlDirect='/signin'
        />
      </CustomizeCard>
    </CustomizeContainer>
  )
}

export default SignupPage