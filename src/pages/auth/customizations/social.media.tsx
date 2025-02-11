import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { GoogleIcon, FacebookIcon } from '@/pages/auth/customizations/icons.customize'


interface IProps {
  txtFacebook: string
  txtGoogle: string
  txtsub: string
  txtRedirect: string
  urlDirect: string
}

const SocialMedia = (props: IProps) => {
  const { txtFacebook, txtGoogle, txtRedirect, txtsub, urlDirect } = props

  return (
    <>
      <Divider>
        <Typography sx={{ color: 'text.secondary' }}>Hoặc</Typography>
      </Divider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant='outlined'
          onClick={() => alert('Sign up with Google')}
          startIcon={<GoogleIcon />}
          sx={{ color: 'text.primary' }}
        >
          {txtGoogle}
        </Button>
        <Button
          fullWidth
          variant='outlined'
          onClick={() => alert('Sign up with Facebook')}
          startIcon={<FacebookIcon />}
          sx={{ color: 'text.primary' }}
        >
          {txtFacebook}
        </Button>
        <Typography sx={{ textAlign: 'center' }}>
          {txtsub}{' '}
          <Link href={urlDirect} variant='body2' sx={{ alignSelf: 'center' }}>
            {txtRedirect}
          </Link>
        </Typography>
      </Box>
    </>
  )
}

export default SocialMedia
