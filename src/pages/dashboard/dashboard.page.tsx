import MetricCard from '@/components/dashboard/metric.card'
import Grid from '@mui/material/Grid2'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import PieChart from './charts/pie.chart'
import OrderStatusTable from '@/components/dashboard/order.status.table'
import LineChart from './charts/line.chart'


const DashboardPage = () => {

  return (
    <div>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon='chart'
            label='Tổng thu nhập'
            value='350000.40'
            subtext='+23% so với tháng trước'
            subIcon={<TrendingUpIcon fontSize='small' />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon='money'
            label='Thu nhập tháng này'
            value='600042.39'
            subtext='+23% so với tháng trước'
            subIcon={<TrendingDownIcon fontSize='small' />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon='task'
            label='Đơn hàng tháng này'
            value='154'
            isQuantity
            subtext='+23% so với tháng trước'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon='file'
            label='Tổng đơn hàng'
            value='2935'
            isQuantity
            subtext='+23% so với tháng trước'
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 8 }}>
          <LineChart />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ display: 'flex', alignItems: 'stretch' }}>
          <PieChart />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
          <OrderStatusTable />
        </Grid>
      </Grid>
    </div>
  )
}

export default DashboardPage