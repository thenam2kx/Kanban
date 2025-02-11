import MetricCard, { IMetricCard } from '@/components/dashboard/metric.card'
import Grid from '@mui/material/Grid2'
import PieChart from './charts/pie.chart'
import OrderStatusTable from '@/components/dashboard/order.status.table'
import LineChart from './charts/line.chart'
import BarChart from './charts/bar.chart'
import TreeChart from './charts/tree.chart'


const data: IMetricCard[] = [
  {
    title: 'Users',
    value: '14k',
    interval: 'Last 30 days',
    trend: 'up',
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
      360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920
    ]
  },
  {
    title: 'Conversions',
    value: '325',
    interval: 'Last 30 days',
    trend: 'down',
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
      780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220
    ]
  },
  {
    title: 'Event count',
    value: '200k',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
      520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510
    ]
  },
  {
    title: 'Event count',
    value: '200k',
    interval: 'Last 30 days',
    trend: 'up',
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
      520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510
    ]
  }
]

const DashboardPage = () => {

  return (
    <div>
      <Grid container spacing={3}>
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <MetricCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', alignItems: 'stretch' }}>
          <LineChart />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', alignItems: 'stretch' }}>
          <BarChart />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, sm: 7, lg: 9 }}>
          <OrderStatusTable />
        </Grid>
        <Grid size={{ xs: 12, sm: 5, lg: 3 }}>
          <PieChart />
          <TreeChart />
        </Grid>
      </Grid>
    </div>
  )
}

export default DashboardPage
