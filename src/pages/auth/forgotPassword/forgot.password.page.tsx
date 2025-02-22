import Box from '@mui/material/Box'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import CustomizeCard from '@/pages/auth/customizations/card.customize'
import { SitemarkIcon } from '@/pages/auth/customizations/icons.customize'
import CustomizeContainer from '@/pages/auth/customizations/container.customize'
import LoadingButton from '@mui/lab/LoadingButton'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import { CardHeader } from '@mui/material'
import ForgotPasswordSchema from '@/validations/auth.validations/forgot.password.validate'
import { sendForgotPasswordAPI } from '@/apis/auth.apis'

const ForgotPasswordPage = () => {
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailMessage] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const navigate = useNavigate()

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement
    let isValid = true
    if (!email.value) {
      setEmailError(true)
      setEmailMessage('Email không được để trống!')
      isValid = false
    } else {
      setEmailError(false)
      setEmailMessage('')
    }
    return isValid
  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Get data from form
    const data = new FormData(event.currentTarget)
    const email = data.get('email') as string

    // Validate data
    const { error } = ForgotPasswordSchema.validate({ email }, { abortEarly: false })
    if (error) {
      error.details.forEach((err) => {
        if (err.path[0] === 'email') {
          setEmailError(true)
          setEmailMessage(err.message)
        }
      })
      return
    }

    try {
      setIsLoading(true)

      const res = await sendForgotPasswordAPI(email)
      if (res.data) {
        toast.success(`🦄 ${res.message}`)
        navigate(`/verify-password?email=${encodeURIComponent(email)}`)
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
        <CardHeader
          title='Tìm tài khoản của bạn?'
          subheader="Vui lòng nhập email để tìm kiếm tài khoản của bạn."
          sx={{
            paddingX: 0,
            paddingY: '8px',
            '& .MuiCardHeader-title.MuiTypography-root': {
              fontSize: 'clamp(2rem, 10vw, 2.15rem)'
            },
            '& .MuiCardHeader-subheader.MuiTypography-root': {
              fontSize: 'clamp(1rem, 5vw, 1rem)'
            }
          }}
        />
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
              type="text"
              name="email"
              placeholder="email@gmail.com"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? 'error' : 'primary'}
              size='small'
              sx={{ mt: '6px' }}
            />
          </FormControl>
          <LoadingButton
            type="submit"
            size="medium"
            loading={isLoading}
            onClick={() => validateInputs()}
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

export default ForgotPasswordPage
