import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import CustomizeCard from '@/pages/auth/customizations/card.customize'
import { SitemarkIcon } from '@/pages/auth/customizations/icons.customize'
import CustomizeContainer from '@/pages/auth/customizations/container.customize'
import { useNavigate, useSearchParams } from 'react-router'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LoadingButton from '@mui/lab/LoadingButton'
import SigninSchema from '@/validations/auth.validations/signin.validate'
import { changeForgotPasswordAPI } from '@/apis/auth.apis'

const ChangePasswordPage = () => {
  const [passwordError, setPasswordError] = useState<boolean>(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('')
  const [verifyPasswordError, setVerifyPasswordError] = useState<boolean>(false)
  const [verifyPasswordErrorMessage, setVerifyPasswordErrorMessage] = useState<string>('')
  const [showVerifyPassword, setShowVerifyPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleClickShowVerifyPassword = () => setShowVerifyPassword((show) => !show)
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const password= data.get('password') as string

    // Validate data
    const { error } = SigninSchema.validate({ email, password }, { abortEarly: false })
    if (error) {
      error.details.forEach((err) => {
        if (err.path[0] === 'password') {
          setPasswordError(true)
          setPasswordErrorMessage(err.message)
        }
      })
      return
    }
    try {
      setIsLoading(true)
      const res = await changeForgotPasswordAPI(email, password)
      if (res.data) {
        toast.success(res.message)
        navigate('/signin')
      } else {
        toast.error(res.error)
      }

    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('🚀 ~ handleSubmit ~ error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const validateInputs = () => {
    const password = document.getElementById('password') as HTMLInputElement
    const verifyPassword = document.getElementById('verifyPassword') as HTMLInputElement

    let isValid = true


    if (!password.value || password.value.length < 8) {
      setPasswordError(true)
      setPasswordErrorMessage('Mật khẩu phải nhiều hơn 8 ký tự!')
      isValid = false
    } else {
      setPasswordError(false)
      setPasswordErrorMessage('')
    }

    if (!verifyPassword.value || password.value.length < 8) {
      setVerifyPasswordError(true)
      setVerifyPasswordErrorMessage('Mật khẩu phải nhiều hơn 8 ký tự!')
      isValid = false
    } else if (verifyPassword.value !== password.value) {
      setVerifyPasswordError(true)
      setVerifyPasswordErrorMessage('Mật khẩu xác nhận không giống nhau!')
    } else {
      setVerifyPasswordError(false)
      setVerifyPasswordErrorMessage('')
    }
    return isValid
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
          Thay đổi mật khẩu
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

          <FormControl>
            <FormLabel htmlFor="verifyPassword" sx={{ '&.Mui-focused': { color: 'inherit' } }}>Xác nhận mật khẩu</FormLabel>
            <OutlinedInput
              id="verifyPassword"
              size='small'
              name="verifyPassword"
              autoFocus
              required
              fullWidth
              placeholder="••••••"
              autoComplete="current-password"
              error={verifyPasswordError}
              color={verifyPasswordError ? 'error' : 'primary'}
              type={showVerifyPassword ? 'text' : 'password'}
              sx={{ mt: '6px' }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showVerifyPassword ? 'hide the password' : 'display the password'
                    }
                    onClick={handleClickShowVerifyPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showVerifyPassword ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {!!verifyPasswordErrorMessage && (
              <FormHelperText error id="accountId-error">
                {verifyPasswordErrorMessage}
              </FormHelperText>
            )}
          </FormControl>
          <LoadingButton
            type="submit"
            size="medium"
            onClick={validateInputs}
            loading={isLoading}
            loadingPosition="center"
            variant="contained"
            sx={{ '&.Mui-disabled': { bgcolor: 'primary.main' } }}
          >
            Xác nhận
          </LoadingButton>
        </Box>
      </CustomizeCard>
    </CustomizeContainer>
  )
}

export default ChangePasswordPage
