import Box from '@mui/material/Box'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CustomizeCard from '@/pages/auth/customizations/card.customize'
import { SitemarkIcon } from '@/pages/auth/customizations/icons.customize'
import CustomizeContainer from '@/pages/auth/customizations/container.customize'
import LoadingButton from '@mui/lab/LoadingButton'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams } from 'react-router'
import { verifyAccountAPI } from '@/apis/auth.apis'
import ResendEmail from './resend.email'

const VerifyPage = () => {
  const [verifyCodeError, setVerifyCodeError] = useState(false)
  const [verifyCodeErrorMessage, setVerifyCodeErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''


  const validateInputs = () => {
    const verifyCode = document.getElementById('verifyCode') as HTMLInputElement
    let isValid = true
    if (!verifyCode.value) {
      setVerifyCodeError(true)
      setVerifyCodeErrorMessage('Mã kích hoạt không được để trống!')
      isValid = false
    } else {
      setVerifyCodeError(false)
      setVerifyCodeErrorMessage('')
    }
    return isValid
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (verifyCodeError) {
      toast.error('🦄 Email không được để trống!')
      return
    }

    const data = new FormData(event.currentTarget)
    const code = data.get('verifyCode') as string

    try {
      setIsLoading(true)
      const res = await verifyAccountAPI(email, code)
      if (res.data) {
        toast.success(`🦄 ${res.message}!`)
        navigate('/auth/signin')
      } else {
        toast.error(`🦄 ${res.message}!`)
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
          Kích hoạt tài khoản
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
            <FormLabel htmlFor="verifyCode">Mã kích hoạt</FormLabel>
            <TextField
              error={verifyCodeError}
              helperText={verifyCodeErrorMessage}
              id="verifyCode"
              type="text"
              name="verifyCode"
              placeholder="123456"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={verifyCodeError ? 'error' : 'primary'}
              size='small'
              sx={{ mt: '6px' }}
            />
          </FormControl>

          <ResendEmail />

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

export default VerifyPage
