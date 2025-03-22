import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Save from '@mui/icons-material/Save'
import CloudUpload from '@mui/icons-material/CloudUpload'
import Delete from '@mui/icons-material/Delete'
import { toast } from 'react-toastify'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchInfoCategoryAPI, updateCategoryAPI } from '@/apis/category.apis'
import { useNavigate, useParams } from 'react-router'

const UpdateCategoryPage = () => {
  const [imageFile, setImageFile] = useState<File | null>(null)
  // eslint-disable-next-line no-console
  console.log('🚀 ~ CreateCategory ~ imageFile:', imageFile)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const navigate = useNavigate()

  const { id } = useParams()

  const { data: infoCategory, isLoading } = useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const result = await fetchInfoCategoryAPI(id!)
      return result.data
    }
  })

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ICategoryFormData>({
    defaultValues: {
      name: '',
      description: '',
      isPublished: true
    }
  })

  // Clean up object URL when component unmounts or when image changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files && files.length > 0) {
      const file = files[0]

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setImageError('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP)')
        return
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setImageError('Kích thước ảnh không được vượt quá 2MB')
        return
      }

      // Clear previous preview
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }

      // Create new preview
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      setImageFile(file)
      setImageError(null)
    }
  }

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    setImagePreview(null)
    setImageFile(null)
  }

  const updateCategoryMutation = useMutation({
    mutationFn: async (data: ICategoryFormData) => {
      const result = await updateCategoryAPI({ name: data.name, description: data.description, isPublished: data.isPublished }, id!)
      return result.data
    },
    onSuccess: () => {
      toast.success('Cập nhật danh mục thành công')
      reset()
      // Clear image preview
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
        setImagePreview(null)
        setImageFile(null)
      }
      navigate('/categories')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Đã có lỗi xảy ra')
    }
  })

  const onSubmit = (category: ICategoryFormData) => {
    updateCategoryMutation.mutate(category)
  }

  useEffect(() => {
    if (infoCategory) {
      reset(infoCategory)
      setImagePreview(infoCategory.image || null)
    }
  }, [infoCategory, reset])

  if (isLoading) {
    return <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</Typography>
  }

  return (
    <Card>
      <CardHeader title='Cập nhật danh mục' subheader='Nhập thông tin chi tiết của danh mục' />
      <Divider />
      <CardContent>
        <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid size={12}>
              <TextField
                fullWidth
                label='Tên danh mục'
                required
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register('name', {
                  required: 'Tên danh mục không được để trống'
                })}
              />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label='Mô tả' multiline rows={4} {...register('description')} />
            </Grid>

            {/* Image Upload Section */}
            <Grid size={12}>
              <Typography variant='subtitle1' gutterBottom>
                Hình ảnh
              </Typography>
              <Box sx={{ mt: 1 }}>
                {imagePreview ? (
                  <Box sx={{ position: 'relative', width: 'fit-content' }}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        position: 'relative'
                      }}
                    >
                      <img
                        src={imagePreview || '/placeholder.svg'}
                        alt='Category preview'
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          display: 'block',
                          borderRadius: '4px'
                        }}
                      />
                      <IconButton
                        size='small'
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          bgcolor: 'error.main',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'error.dark'
                          }
                        }}
                        onClick={handleRemoveImage}
                      >
                        <Delete fontSize='small' />
                      </IconButton>
                    </Paper>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      border: '2px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover'
                      }
                    }}
                    onClick={() => {
                      const input = document.getElementById('category-image-upload')
                      if (input) input.click()
                    }}
                  >
                    <input
                      id='category-image-upload'
                      type='file'
                      name='image'
                      accept='image/jpeg, image/png, image/gif, image/webp'
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <CloudUpload color='primary' sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant='body1' gutterBottom>
                      Kéo thả hoặc nhấp để tải lên hình ảnh
                    </Typography>
                    <Typography variant='caption' color='textSecondary'>
                      Hỗ trợ JPEG, PNG, GIF, WEBP. Tối đa 2MB.
                    </Typography>
                    {imageError && (
                      <Typography color='error' variant='caption' sx={{ display: 'block', mt: 1 }}>
                        {imageError}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid size={12}>
              <Controller
                name='isPublished'
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                    label='Kích hoạt'
                  />
                )}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant='outlined'
              sx={{ mr: 2 }}
              onClick={() => {
                reset()
                handleRemoveImage()
              }}
            >
              Hủy
            </Button>
            <Button type='submit' variant='contained' startIcon={<Save />}>
              Lưu
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default UpdateCategoryPage
