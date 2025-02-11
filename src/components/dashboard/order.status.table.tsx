import { useState } from 'react'
import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Pagination from '@mui/material/Pagination'
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import WrapperCard from './wrapper.card'
import { formatCurrencyVND } from '@/utils/helpers'

// Styled components
const StyledTableCell = styled(TableCell)(() => ({
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  color: '#fff',
  '&.MuiTableCell-head': {
    color: '#8b8d9b',
    fontWeight: 500
  }
}))

const SearchWrapper = styled(Paper)(() => ({
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  width: 400,
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)'
}))

const StatusChip = styled(Chip)(({ status }: { status: string }) => {
  const getColor = () => {
    switch (status) {
    case 'Đã giao hàng':
      return '#4CAF50'
    case 'Đã hủy':
      return '#f44336'
    case 'Đang giao hàng':
      return '#ff9800'
    default:
      return '#8b8d9b'
    }
  }

  return {
    backgroundColor: `${getColor()}20`,
    color: getColor(),
    borderRadius: 4,
    '& .MuiChip-label': {
      padding: '0 8px'
    }
  }
})

// Sample data
const orders = [
  {
    id: '#1532',
    client: { name: 'John Carter', email: '0363560798' },
    date: 'Jan 30, 2024',
    status: 'Đã giao hàng',
    country: 'United States',
    total: '1099.24'
  },
  {
    id: '#1531',
    client: { name: 'Sophie Moore', email: 'contact@sophiemoore.com' },
    date: 'Jan 27, 2024',
    status: 'Đã hủy',
    country: 'United Kingdom',
    total: '5870.32'
  },
  {
    id: '#1530',
    client: { name: 'Matt Cannon', email: 'info@mattcannon.com' },
    date: 'Jan 24, 2024',
    status: 'Đã giao hàng',
    country: 'Australia',
    total: '13899.48'
  },
  {
    id: '#1529',
    client: { name: 'Graham Hills', email: 'hi@grahamhills.com' },
    date: 'Jan 21, 2024',
    status: 'Đang giao hàng',
    country: 'India',
    total: '1569.12'
  },
  {
    id: '#1528',
    client: { name: 'Sandy Houston', email: 'contact@sandyhouston.com' },
    date: 'Jan 18, 2024',
    status: 'Đã giao hàng',
    country: 'Canada',
    total: '899.16'
  },
  {
    id: '#1527',
    client: { name: 'Andy Smith', email: 'hello@andysmith.com' },
    date: 'Jan 15, 2024',
    status: 'Đang giao hàng',
    country: 'United States',
    total: '2449.64'
  }
]

const OrderStatusTable = () => {
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = orders.map((n) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    setSelected(newSelected)
  }

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  return (
    <WrapperCard>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant='h5' color='white' fontWeight='medium'>
          Trạng thái đơn hàng
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <SearchWrapper>
            <SearchIcon sx={{ color: '#8b8d9b' }} />
            <InputBase
              sx={{ ml: 1, flex: 1, color: 'white' }}
              placeholder='Tìm kiếm...'
              inputProps={{ 'aria-label': 'search orders' }}
            />
          </SearchWrapper>
          <Button
            variant='contained'
            sx={{
              bgcolor: '#9333EA',
              '&:hover': { bgcolor: '#7E22CE' },
              textTransform: 'none',
              px: 3
            }}
          >
            Tạo đơn hàng
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell padding='checkbox'>
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < orders.length}
                  checked={orders.length > 0 && selected.length === orders.length}
                  onChange={handleSelectAllClick}
                  sx={{ color: '#8b8d9b' }}
                />
              </StyledTableCell>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Khách hàng</StyledTableCell>
              <StyledTableCell>Ngày đặt hàng</StyledTableCell>
              <StyledTableCell>Trạng thái</StyledTableCell>
              <StyledTableCell>Số lượng</StyledTableCell>
              <StyledTableCell align='right'>Tổng tiền</StyledTableCell>
              <StyledTableCell align='right'>Hành động</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((row) => {
              const isItemSelected = isSelected(row.id)

              return (
                <TableRow
                  hover
                  onClick={() => handleClick(row.id)}
                  role='checkbox'
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                  sx={{ '&.Mui-selected': { backgroundColor: 'rgba(255, 255, 255, 0.08)' } }}
                >
                  <StyledTableCell padding='checkbox'>
                    <Checkbox checked={isItemSelected} sx={{ color: 'text.secondary' }} />
                  </StyledTableCell>
                  <StyledTableCell sx={{ color: 'text.secondary' }}>{row.id}</StyledTableCell>
                  <StyledTableCell>
                    <Box>
                      <Typography color='text.primary'>{row.client.name}</Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {row.client.email}
                      </Typography>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell sx={{ color: 'text.secondary' }}>{row.date}</StyledTableCell>
                  <StyledTableCell>
                    <StatusChip label={row.status} status={row.status} />
                  </StyledTableCell>
                  <StyledTableCell sx={{ color: 'text.secondary' }}>{row.country}</StyledTableCell>
                  <StyledTableCell align='right' sx={{ color: 'text.secondary' }}>{formatCurrencyVND(+row.total)}</StyledTableCell>
                  <StyledTableCell align='right'>
                    <IconButton size='small' sx={{ color: 'text.secondary' }}>
                      <EditIcon fontSize='small' />
                    </IconButton>
                    <IconButton size='small' sx={{ color: 'text.secondary' }}>
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </StyledTableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          color: '#8b8d9b'
        }}
      >
        <Typography>1-6 of 12</Typography>
        <Pagination
          count={2}
          page={page}
          onChange={(_, value) => setPage(value)}
          sx={{
            '& .MuiPaginationItem-root': {
              color: '#8b8d9b'
            },
            '& .Mui-selected': {
              bgcolor: '#9333EA !important',
              color: 'white'
            }
          }}
        />
      </Box>
    </WrapperCard>
  )
}

export default OrderStatusTable