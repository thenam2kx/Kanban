import Card from '@mui/material/Card'
import {
  DataGrid,
  GridColDef,
  gridPageCountSelector,
  useGridApiContext,
  useGridSelector
} from '@mui/x-data-grid'
import Chip from '@mui/material/Chip'
import Pagination from '@mui/material/Pagination'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import { useEffect } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { useNavigate } from 'react-router'
import EditCustomer from './update.customer/update.customer'
import { fetchListUsers, setIsLoading, setListPaginate, setOpenModalUpdate, setUserId } from '@/redux/slices/user.slice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import DeleteCustomer from './action.customer/delete.customer'

const renderStatus = (status: 'Online' | 'Offline') => {
  const colors: { [index: string]: 'success' | 'default' } = {
    Online: 'success',
    Offline: 'default'
  }
  return <Chip label={status} color={colors[status]} size="small" />
}

const renderRole = (roles: 'SUPER_ADMIN' | 'ADMIN' | 'PARTNER' | 'EMPLOYEE' | 'USER') => {
  switch (roles) {
  case 'SUPER_ADMIN': {
    return <Chip label={'SUPER_ADMIN'} color={'error'} size="small" />
  }
  case 'ADMIN':
    return <Chip label={'ADMIN'} color={'warning'} size="small" />
  case 'PARTNER':
    return <Chip label={'PARTNER'} color={'primary'} size="small" />
  case 'EMPLOYEE':
    return <Chip label={'EMPLOYEE'} color={'secondary'} size="small" />
  case 'USER':
    return <Chip label={'USER'} color={'default'} size="small" />
  default:
    return <Chip label={'USER'} color={'default'} size="small" />
  }
}

const CustomerPage = () => {
  const listUser = useAppSelector((state) => state.user.listUsers)
  const meta = useAppSelector((state) => state.user.listUserMeta)
  const listPaginate = useAppSelector((state) => state.user.listPaginate)
  const isLoading = useAppSelector((state) => state.user.isLoading)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleEdit = (userId: string) => {
    dispatch(setOpenModalUpdate(true))
    dispatch(setUserId(userId))
  }

  const CustomPagination = () => {
    const apiRef = useGridApiContext()
    const pageCount = useGridSelector(apiRef, gridPageCountSelector)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paginationModel = useGridSelector(apiRef, (state: { pagination: { paginationModel: any } }) =>
      state.pagination.paginationModel
    )

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
      apiRef.current.setPage(value - 1)
    }

    return (
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
        <Typography>
          Trang {paginationModel.page + 1} / {pageCount}
        </Typography>
        <Pagination
          color="primary"
          count={pageCount}
          page={paginationModel.page + 1}
          onChange={handlePageChange}
          showFirstButton
          showLastButton
        />
      </Stack>
    )
  }

  const columns: GridColDef[] = [
    {
      field: 'customerName',
      headerName: 'Tên khách hàng',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={2}
          sx={{ padding: '8px', alignItems: 'center', height: '100%' }}
        >
          <Avatar alt={params.row?.avatar} src={params.row?.avatar} sx={{ height: 40, width: 40 }} />
          <Box>
            <Typography sx={{ fontSize: '16px', color: 'text.primary' }}>{params.row?.fullname}</Typography>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>{params.row?.email}</Typography>
          </Box>
        </Stack>
      )
    },
    {
      field: 'phone',
      headerName: 'Số điện thoại',
      headerAlign: 'left',
      align: 'left',
      flex: 1,
      minWidth: 80
    },
    {
      field: 'role',
      headerName: 'Vai trò',
      headerAlign: 'left',
      align: 'left',
      flex: 1,
      minWidth: 80,
      // valueGetter: (params) => params?.name || 'USER'
      renderCell: (params) => renderRole(params.row?.role?.name)
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => renderStatus(params.row?.isVerified ? 'Online' : 'Offline')
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      headerAlign: 'right',
      align: 'right',
      minWidth: 120,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          alignItems={'center'}
          justifyContent={'flex-end'}
          sx={{ height: '100%' }}
        >
          <IconButton aria-label="view" size='small' onClick={() => navigate(`/customers/${params.row?._id}`)}>
            <RemoveRedEyeIcon fontSize='small' />
          </IconButton>
          <IconButton aria-label="edit" size='small' onClick={() => handleEdit(params.row?._id)}>
            <EditIcon fontSize='small' />
          </IconButton>
          <DeleteCustomer userId={params.row?._id} />
        </Stack>
      )
    }
  ]

  useEffect(() => {
    (async () => {
      try {
        dispatch(setIsLoading(true))
        dispatch(fetchListUsers({ current: listPaginate.page + 1, pageSize: listPaginate.pageSize }))
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('🚀 ~ error:', error)
      } finally {
        dispatch(setIsLoading(false))
      }
    })()
  }, [dispatch, listPaginate.page, listPaginate.pageSize])

  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flexGrow: 1,
        maxHeight: 'calc(100vh - 120px)'
      }}
    >
      <DataGrid
        rows={listUser}
        columns={columns}
        rowHeight={100}
        getRowId={(row) => row?._id ? row?._id : ''}
        loading={listUser.length === 0 || isLoading}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        paginationModel={listPaginate}
        onPaginationModelChange={(model) => dispatch(setListPaginate(model))}
        paginationMode="server"
        rowCount={meta.total || 0}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        disableRowSelectionOnClick
        density="compact"
        slots={{ pagination: CustomPagination }}
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

      <EditCustomer />
    </Card>
  )
}

export default CustomerPage
