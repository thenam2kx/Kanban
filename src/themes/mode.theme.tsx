import { useColorScheme } from '@mui/material/styles'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Box from '@mui/material/Box'

import LightModeIcon from '@mui/icons-material/LightMode'
import NightsStayIcon from '@mui/icons-material/NightsStay'
import Brightness6Icon from '@mui/icons-material/Brightness6'

const ModeThemeSelect = () => {
  const { mode, setMode } = useColorScheme()

  if (!mode) { return null }

  const handleChange = (event: SelectChangeEvent) => {
    setMode(event.target.value as 'system' | 'light' | 'dark')
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="select-label-theme">Theme select</InputLabel>
      <Select
        labelId="select-label-theme"
        id="select-theme"
        value={mode}
        label="Theme select"
        onChange={handleChange}
      >
        <MenuItem value='light'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LightModeIcon sx={{ fontSize: 'medium' }}/> Light
          </Box>
        </MenuItem>
        <MenuItem value='dark'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <NightsStayIcon sx={{ fontSize: 'medium' }}/> Dark
          </Box>
        </MenuItem>
        <MenuItem value='system'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Brightness6Icon sx={{ fontSize: 'medium' }}/> System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

export default ModeThemeSelect
