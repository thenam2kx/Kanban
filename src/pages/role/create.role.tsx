import { useEffect, useState } from 'react'
import { Info as InfoIcon } from '@mui/icons-material'
import Grid from '@mui/material/Grid2'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import { fetchListPermissionsAPI } from '@/apis/permission.api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import { createRoleAPI } from '@/apis/role.api'

const CreateRole = () => {
  const navigate = useNavigate()
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [permissionGroups, setPermissionGroups] = useState<IPermissionsGroup[]>([])
  const [role, setRole] = useState<IRole>({
    _id: '',
    name: '',
    description: '',
    isActive: false,
    permissions: []
  })


  const handleActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole({ ...role, isActive: event.target.checked })
  }

  const handleChangeForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole({ ...role, [event.target.name]: event.target.value })
  }


  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId)
      } else {
        return [...prev, permissionId]
      }
    })
  }

  const handleGroupToggle = (groupPermissions: string[]) => {
    const allSelected = groupPermissions.every((p) => selectedPermissions.includes(p))

    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((id) => !groupPermissions.includes(id)))
    } else {
      const missingPermissions = groupPermissions.filter((p) => !selectedPermissions.includes(p))
      setSelectedPermissions((prev) => [...prev, ...missingPermissions])
    }
  }

  const handleSave = async () => {
    const createdRole = {
      name: role.name,
      description: role.description,
      isActive: role.isActive,
      permissions: selectedPermissions
    }
    const res = await createRoleAPI(createdRole)
    if (res && res.data) {
      navigate('/roles')
      toast.success(res.message)
    } else {
      toast.error(res.message[0])
    }
  }

  useEffect(() => {
    (async () => {
      const res = await fetchListPermissionsAPI()
      if (res && res.data) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setPermissionGroups(res.data.result)
      }
    })()
  }, [])

  return (
    <Container maxWidth='lg' sx={{ margin: '0 auto', p: 2 }}>
      <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
        <Typography variant='h4' gutterBottom>
          Tạo vai trò mới
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField
              fullWidth
              name='name'
              label='Tên vai trò'
              value={role.name}
              onChange={handleChangeForm}
              variant='outlined'
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label='Mô tả'
              name='description'
              value={role.description}
              onChange={handleChangeForm}
              variant='outlined'
              multiline
              rows={2}
            />
          </Grid>
          <Grid size={12}>
            <FormControlLabel
              control={<Switch checked={role.isActive} onChange={handleActiveChange} color='primary' />}
              label='Trang thái'
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant='h5'>Phân quyền</Typography>
          <Tooltip title='Manage what this role can access and modify'>
            <IconButton size='small' sx={{ ml: 1 }}>
              <InfoIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {permissionGroups.map((group, index) => (
          <Card key={`${group.name}-${index}`} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={group.permissions.every((p) => selectedPermissions.includes(p._id))}
                      indeterminate={
                        group.permissions.some((p) => selectedPermissions.includes(p._id)) &&
                        !group.permissions.every((p) => selectedPermissions.includes(p._id))
                      }
                      onChange={() => handleGroupToggle(group.permissions.map((p) => p._id))}
                    />
                  }
                  label={<Typography variant='h6'>{group.name}</Typography>}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {group.permissions.map((permission) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={permission._id}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedPermissions.includes(permission._id)}
                          onChange={() => handlePermissionToggle(permission._id)}
                          color='primary'
                        />
                      }
                      label={permission.name}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
          <Button variant='outlined' color='inherit' onClick={() => navigate('/roles')}>
            Hủy
          </Button>
          <Button variant='contained' color='primary' onClick={handleSave}>
            Tạo mới
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default CreateRole
