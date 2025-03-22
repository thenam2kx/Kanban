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
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { useNavigate } from 'react-router'
import DeleteCategory from './delete.category'
import { useQuery } from '@tanstack/react-query'
import { fetchListCategoryAPI } from '@/apis/category.apis'
import { useState } from 'react'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'

const renderStatus = (status: 'Online' | 'Offline') => {
  const colors: { [index: string]: 'success' | 'default' } = {
    Online: 'success',
    Offline: 'default'
  }
  return <Chip label={status} color={colors[status]} size="small" />
}


const CategoryPage = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)

  const { data: listCategories, isLoading } = useQuery({
    queryKey: ['fetch-categories', currentPage],
    queryFn: async () => {
      try {
        const { data: results } = await fetchListCategoryAPI({ current: currentPage, pageSize: 10 })
        return results
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('🚀 ~ error:', error)
      }
    }
  })

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
      field: 'name',
      headerName: 'Tên danh mục',
      flex: 1.5,
      minWidth: 200
    },
    {
      field: 'slug',
      headerName: 'Slug',
      headerAlign: 'left',
      align: 'left',
      flex: 1,
      minWidth: 80
    },
    {
      field: 'isPublished',
      headerName: 'Trạng thái',
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => renderStatus(params.row?.isPublished ? 'Online' : 'Offline')
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
          <IconButton aria-label="edit" size='small' onClick={() => navigate(`/categories/update/${params.row?._id}`)}>
            <EditIcon fontSize='small' />
          </IconButton>
          <DeleteCategory categoryId={params.row?._id} />
        </Stack>
      )
    }
  ]

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
      <Stack spacing={2} direction="row" justifyContent={'space-between'} sx={{ p: 1 }}>
        <Paper
          component="form"
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: 400,
            p: '1px 4px',
            boxShadow: 'none'
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Tìm kiếm..."
            inputProps={{ 'aria-label': 'Tìm kiếm...' }}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/categories/create')}
        >
          Tạo mới
        </Button>
      </Stack>
      <DataGrid
        rows={listCategories?.result || []}
        columns={columns}
        rowHeight={100}
        getRowId={(row) => row?._id ? row?._id : ''}
        loading={listCategories?.result.length === 0 || isLoading}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        paginationModel={{
          page: listCategories?.meta.current ? listCategories?.meta.current - 1 : 0,
          pageSize: listCategories?.meta.pageSize ?? 10
        }}
        onPaginationModelChange={(model) => setCurrentPage(model.page + 1)}
        paginationMode="server"
        rowCount={listCategories?.meta?.total || 0}
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
    </Card>
  )
}

export default CategoryPage
