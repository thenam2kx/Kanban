import LoadingButton from '@mui/lab/LoadingButton'
import { toast } from 'react-toastify'
import { sendForgotPasswordAPI } from '@/apis/auth.apis'
import { useSearchParams } from 'react-router'
import { useState } from 'react'

const ResendPassword = () => {
  const [isLoadingResend, setIsLoadingResend] = useState<boolean>(false)

  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const handleResend = async () => {
    try {
      setIsLoadingResend(true)

      const res = await sendForgotPasswordAPI(email)
      if (res.data) {
        toast.success(`🦄 ${res.message}`)
      } else {
        toast.error(`🦄 ${res.message}`)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('🚀 ~ handleSubmit ~ error:', error)
    } finally {
      setIsLoadingResend(false)
    }
  }

  return (
    <LoadingButton
      size='medium'
      loading={isLoadingResend}
      onClick={() => handleResend()}
      loadingPosition='center'
      variant='text'
      sx={{
        textTransform: 'none',
        '&.Mui-disabled': { bgcolor: 'primary.main' }
      }}
    >
      Gửi lại mã kích hoạt
    </LoadingButton>
  )
}

export default ResendPassword
