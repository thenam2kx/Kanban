import { memo } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import OutlinedInput from '@mui/material/OutlinedInput'

interface ForgotPasswordProps {
  open: boolean
  handleClose: () => void
}

const ForgotPassword = memo(({ open, handleClose }: ForgotPasswordProps) => {

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // handleClose()

    const data = new FormData(event.currentTarget)
    const email = data.get('email') as string
    console.log('🚀 ~ handleSubmit ~ email:', email)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      // onSubmit={handleSubmit}
      PaperProps={{
        component: 'form',
        onSubmit: () => handleSubmit,
        sx: { backgroundImage: 'none', minWidth: { xs: '90%', sm: '500px', md: '700px' } }
      }}
    >
      <DialogTitle>Quên mật khẩu ?</DialogTitle>
      <DialogContent sx={{
        gap: 2,
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <DialogContentText>
          Nhập địa chỉ email để đặt lại mật khẩu.
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          placeholder="email@gmail.com"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default ForgotPassword
