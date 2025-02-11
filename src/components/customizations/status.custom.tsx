import Chip from '@mui/material/Chip'


interface IProps {
  status: 'Online' | 'Offline',
  styleChip?: React.CSSProperties
}

const StatusCustom = (props: IProps) => {
  const { status, styleChip } = props

  const colors: { [index: string]: 'success' | 'default' } = {
    Online: 'success',
    Offline: 'default'
  }

  return (
    <>
      <Chip label={status} color={colors[status]} size="small" sx={{ ...styleChip }} />
    </>
  )
}

export default StatusCustom
