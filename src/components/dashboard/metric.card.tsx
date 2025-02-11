import { Card, CardContent, Typography, Box } from '@mui/material'
import { BarChart, AttachMoney, FileCopy } from '@mui/icons-material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { formatCurrencyVND } from '@/utils/helpers'

interface MetricCardProps {
  icon: 'chart' | 'money' | 'task' | 'file'
  label: string
  value: string
  subtext?: string
  isQuantity?: boolean
  subIcon?: React.ReactNode
}

const MetricCard = (props: MetricCardProps) => {
  const { icon, label, value, subtext, isQuantity, subIcon } = props

  const getIcon = () => {
    switch (icon) {
    case 'chart':
      return <BarChart sx={{ color: '#6366f1', fontSize: 28 }} />
    case 'money':
      return <AttachMoney sx={{ color: '#6366f1', fontSize: 28 }} />
    case 'task':
      return <AssignmentIcon sx={{ color: '#6366f1', fontSize: 28 }} />
    case 'file':
      return <FileCopy sx={{ color: '#6366f1', fontSize: 28 }} />
    }
  }

  return (
    <Card
      sx={{
        bgcolor: 'background.default',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
        borderRadius: 3,
        height: '100%'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {getIcon()}
          </Box>

          <Box>
            <Typography
              color='text.secondary'
              sx={{ mb: 1, fontSize: '0.875rem' }}
            >
              {label}
            </Typography>
            <Typography
              variant='h4'
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {
                isQuantity ? value : formatCurrencyVND(+value)
              }
            </Typography>
            {subtext && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {subIcon}
                <Typography
                  sx={{
                    mt: 0.5,
                    color: subtext.includes('+') ? '#10b981' : 'text.secondary',
                    fontSize: '0.875rem'
                  }}
                >
                  {subtext}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default MetricCard
