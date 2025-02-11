import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

interface IProps {
  children: React.ReactNode
  cardContentStyle?: React.CSSProperties
  cardContainerStyle?: React.CSSProperties
}

const WrapperCard = ({ children, cardContainerStyle, cardContentStyle }: IProps) => {
  return (
    <Card sx={{ boxShadow: 'none', ...cardContainerStyle }}>
      <CardContent sx={{ flexGrow: 1, ...cardContentStyle }}>
        {children}
      </CardContent>
    </Card>
  )
}

export default WrapperCard