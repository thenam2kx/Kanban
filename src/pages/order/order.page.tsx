import { Chip } from '@mui/material'
import Card from '@mui/material/Card'
import {
  DataGrid,
  GridColDef,
  GridRowsProp
} from '@mui/x-data-grid'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { faker } from '@faker-js/faker'


const renderStatus = (status: 'Online' | 'Offline') => {
  const colors: { [index: string]: 'success' | 'default' } = {
    Online: 'success',
    Offline: 'default'
  }

  return <Chip label={status} color={colors[status]} size="small" />
}

const columns: GridColDef[] = [
  {
    field: 'customerName',
    headerName: 'Tên khách hàng',
    flex: 1.5,
    minWidth: 200,
    renderCell: (params) => (
      <>
        <Stack direction="row" spacing={2} sx={{ padding: '8px', alignItems: 'center' }}>
          <Avatar
            alt={params.value}
            src="https://picsum.photos/200/200"
            sx={{ height: 32, width: 32 }}
          />
          <Box>
            <Typography sx={{ fontSize: '16px', color: 'text.primary' }}>
              {params.value}
            </Typography>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
              {params.value}
            </Typography>
          </Box>
        </Stack>
      </>
    )
  },
  {
    field: 'status',
    headerName: 'Trạng thái',
    flex: 0.5,
    minWidth: 80,
    renderCell: (params) => renderStatus(params.value)
  },
  {
    field: 'phone',
    headerName: 'Số điện thoại',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 80
  },
  {
    field: 'address',
    headerName: 'Địa chỉ',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 100
  },
  {
    field: 'viewsPerUser',
    headerName: 'Views per User',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    minWidth: 120
  },
  {
    field: 'actions',
    headerName: 'Hành động',
    headerAlign: 'right',
    align: 'right',
    // flex: 1,
    minWidth: 120,
    renderCell: () => (
      <Stack
        direction="row"
        spacing={1}
        alignItems={'center'}
        justifyContent={'flex-end'}
        sx={{ height: '100%' }}
      >
        <IconButton aria-label="edit">
          <EditIcon />
        </IconButton>
        <IconButton aria-label="edit">
          <DeleteIcon />
        </IconButton>
      </Stack>
    )
  }
]

const rows: GridRowsProp = []
for (let i = 0; i < 100; i++) {
  const status = faker.helpers.arrayElement(['Online', 'Offline'])
  rows.push({
    id: faker.string.uuid(),
    customerName: faker.internet.username(),
    status,
    address: faker.location.streetAddress() + ', ' + faker.location.city() + ' - ' + faker.location.state() + ' - ' + faker.location.country(),
    phone: faker.helpers.arrayElement(['0363560798', '0123456789', '0388700628', '0987654321']),
    viewsPerUser: faker.number.int({ min: 10, max: 50 }),
    actions: `${faker.number.int({ min: 1, max: 5 })}m ${faker.number.int({ min: 1, max: 59 })}s`
  })
}


const OrderPage = () => {
  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flexGrow: 1,
        maxHeight: 'calc(100vh - 150px)'
      }}
    >
      <DataGrid
        checkboxSelection
        rows={rows}
        columns={columns}
        rowHeight={80}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
            rowCount: 10
          }
        }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        disableRowSelectionOnClick
        density="compact"
        slotProps={{
          filterPanel: {
            filterFormProps: {
              logicOperatorInputProps: {
                variant: 'outlined',
                size: 'small'
              },
              columnInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' }
              },
              operatorInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' }
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: 'outlined',
                  size: 'small'
                }
              }
            }
          }
        }}
        sx={{ flexGrow: 1, border: 'none' }}
      />
    </Card>
  )
}

export default OrderPage
