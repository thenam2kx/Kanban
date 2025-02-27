import Card from '@mui/material/Card'
import {
  DataGrid,
  GridColDef,
  gridPageCountSelector,
  useGridApiContext,
  useGridSelector
} from '@mui/x-data-grid'
import Chip from '@mui/material/Chip'
import { memo, useCallback, useEffect } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Pagination from '@mui/material/Pagination'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchListRoles, setCurrentPaginateRole } from '@/redux/slices/role.slice'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

const RolePage = () => {
  const dispatch = useAppDispatch()
  const currentPaginateRole = useAppSelector(state => state.role.currentPaginateRole)
  const isLoadingRole = useAppSelector(state => state.role.isLoadingRole)
  const listRoles = useAppSelector(state => state.role.listRoles)
  const metaRole = useAppSelector(state => state.role.metaRole)

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Tên vai trò',
      width: 150,
      editable: true,
      flex: 1
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      width: 150,
      editable: true,
      flex: 1
    },
    {
      field: 'isActive',
      headerName: 'Trạng thái',
      width: 110,
      editable: true,
      renderCell: (params) => renderStatus(params.row?.isActive ? 'Online' : 'Offline')
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 120,
      editable: true,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          alignItems={'center'}
          justifyContent={'flex-end'}
          sx={{ height: '100%' }}
        >
          <IconButton aria-label="view" size='small'>
            <RemoveRedEyeIcon fontSize='small' />
          </IconButton>
          <IconButton aria-label="edit" size='small'>
            <EditIcon fontSize='small' />
          </IconButton>
          <IconButton aria-label="delete" size='small'>
            <DeleteIcon fontSize='small' />
          </IconButton>
        </Stack>
      )
    }
  ]

  const renderStatus = useCallback((status: 'Online' | 'Offline') => {
    const colors: { [index: string]: 'success' | 'default' } = {
      Online: 'success',
      Offline: 'default'
    }
    return <Chip label={status} color={colors[status]} size="small" />
  }, [])

  const CustomPagination = memo(() => {
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
  })

  useEffect(() => {
    (async () => {
      try {
        await dispatch(fetchListRoles({ current: currentPaginateRole.page, pageSize: currentPaginateRole.pageSize }))
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('🚀 ~ error:', error)
      }
    })()
  }, [currentPaginateRole, dispatch])

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
      <Stack spacing={2} direction="row" justifyContent={'end'} sx={{ p: 1 }}>
        <Button variant="contained" startIcon={<AddIcon />}>Tạo mới</Button>
      </Stack>
      <DataGrid
        rows={listRoles}
        columns={columns}
        rowHeight={100}
        getRowId={(row) => row?._id ? row?._id : ''}
        loading={listRoles.length === 0 || isLoadingRole}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        paginationModel={currentPaginateRole}
        onPaginationModelChange={(model) => dispatch(setCurrentPaginateRole(model))}
        paginationMode="server"
        rowCount={metaRole.total || 0}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        disableRowSelectionOnClick
        isCellEditable={() => false}
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
    </Card>
  )
}

export default RolePage
