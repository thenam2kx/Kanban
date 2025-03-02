import { useEffect, useState } from 'react'
import { Save as SaveIcon, Cancel as CancelIcon, Info as InfoIcon } from '@mui/icons-material'
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
import { useParams } from 'react-router'
import { fetchRoleAPI } from '@/apis/role.api'


const permissionGroups = [
  {
    name: 'User Management',
    permissions: [
      { id: 'user.view', name: 'View Users' },
      { id: 'user.create', name: 'Create Users' },
      { id: 'user.edit', name: 'Edit Users' },
      { id: 'user.delete', name: 'Delete Users' },
    ]
  },
  {
    name: 'Content Management',
    permissions: [
      { id: 'content.view', name: 'View Content' },
      { id: 'content.create', name: 'Create Content' },
      { id: 'content.edit', name: 'Edit Content' },
      { id: 'content.delete', name: 'Delete Content' },
      { id: 'content.publish', name: 'Publish Content' },
    ]
  },
  {
    name: 'Settings',
    permissions: [
      { id: 'settings.view', name: 'View Settings' },
      { id: 'settings.edit', name: 'Edit Settings' },
    ]
  }
]


const initialRole = {
  id: 1,
  name: 'Editor',
  description: 'Can edit and manage content',
  isActive: true,
  permissions: ['user.view', 'content.view', 'content.create', 'content.edit']
}

interface IGroupPermissions {
  name: string
  permissions: IPermissions[]
}

const UpdateRole = () => {
  const { id } = useParams<{ id: string }>()
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [listPermissions, setListPermissions] = useState<IPermissions[]>([])
  const [groupPermissions, setGroupPermissions] = useState<IGroupPermissions[]>([])
  const [role, setRole] = useState<IRole>({
    _id: '',
    name: '',
    description: '',
    isActive: false,
    permissions: []
  })

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole({ ...role, description: event.target.value })
  }

  const handleActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole({ ...role, isActive: event.target.checked })
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
      setSelectedPermissions((prev) => prev.filter((_id) => !groupPermissions.includes(_id)))
    } else {
      const missingPermissions = groupPermissions.filter((p) => !selectedPermissions.includes(p))
      setSelectedPermissions((prev) => [...prev, ...missingPermissions])
    }
  }

  const handleSave = () => {
    const updatedRole = {
      ...role,
      permissions: selectedPermissions
    }
    console.log('Saving updated role:', updatedRole)
  }

  useEffect(() => {
    (async () => {
      const res = await fetchRoleAPI(id as string)
      if (res && res.data) {
        setRole(res.data)
        setListPermissions(res.data.permissions)
        setSelectedPermissions(res.data?.permissions?.map((p) => p._id))

        // Group permissions by module
        const groupPermissions = res.data?.permissions?.reduce(
          (acc: Record<string, string[]>, permission) => {
            if (!acc[permission.module]) {
              acc[permission.module] = []
            }
            acc[permission.module].push(permission)
            return acc
          },
          {} as Record<string, string[]>
        )

        // Convert groupPermissions to array
        const resultPermissions = Object.entries(groupPermissions).map(
          ([key, value]) => ({
            name: key,
            permissions: value
          })
        )
        setGroupPermissions(resultPermissions)
      }
    })()
  }, [id])

  return (
    <Container maxWidth='lg' sx={{ margin: '0 auto', p: 2 }}>
      <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
        <Typography variant='h4' gutterBottom>
          Cập nhật vai trò: {'role.name'}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField
              fullWidth
              label='Mô tả'
              value={role.description}
              onChange={handleDescriptionChange}
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
          <Typography variant='h5'>Permissions</Typography>
          <Tooltip title='Manage what this role can access and modify'>
            <IconButton size='small' sx={{ ml: 1 }}>
              <InfoIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {groupPermissions.map((group) => (
          <Card key={group.name} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={group.permissions?.every((p) => selectedPermissions?.includes(p._id))}
                      indeterminate={
                        group.permissions.some((p) => selectedPermissions?.includes(p._id)) &&
                        !group.permissions.every((p) => selectedPermissions?.includes(p._id))
                      }
                      onChange={() => handleGroupToggle(group.permissions?.map((p) => p._id))}
                    />
                  }
                  label={<Typography variant='h6'>{group.name}</Typography>}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {group.permissions?.map((permission) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={permission._id}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedPermissions?.includes(permission._id)}
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
          <Button variant='outlined' startIcon={<CancelIcon />} color='inherit'>
            Cancel
          </Button>
          <Button variant='contained' startIcon={<SaveIcon />} color='primary' onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default UpdateRole
