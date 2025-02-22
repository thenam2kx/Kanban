import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Popper from '@mui/material/Popper'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const DeleteCustomer = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }
  const openPopper = Boolean(anchorEl)
  const id = openPopper ? 'delete-popper' : undefined

  return (
    <>
      <IconButton
        aria-label="delete"
        size='small'
        aria-describedby={id}
        type="button"
        onClick={handleClick}
      >
        <DeleteIcon fontSize='small' />
      </IconButton>
      <Popper id={id} open={openPopper} anchorEl={anchorEl} placement='bottom-end'>
        <Box sx={{
          border: 1,
          p: '6px 12px',
          borderRadius: 1,
          boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
          borderColor: 'background.default',
          bgcolor: 'background.paper'
        }}>
          <Typography sx={{ py: '12px' }}>Bạn có chắc chắn muốn xóa</Typography>
          <Stack spacing={2} direction="row" justifyContent={'flex-end'}>
            <Button variant="text" size='small' onClick={handleClick}>Hủy</Button>
            <Button variant="contained" size='small'>Xóa</Button>
          </Stack>
        </Box>
      </Popper>
    </>
  )
}

export default DeleteCustomer
