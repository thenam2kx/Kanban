import {
  LineChart as MUILineChart,
  lineElementClasses,
  markElementClasses
} from '@mui/x-charts/LineChart'
import WrapperCard from '@/components/dashboard/wrapper.card'
import { faker } from '@faker-js/faker'

const xLabels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(item => `Tháng ${item}`)
const uData = xLabels.map(() => faker.number.int({ min: 0, max: 10000000 }))
const pData = xLabels.map(() => faker.number.int({ min: 0, max: 10000000 }))

const LineChart = () => {
  return (
    <WrapperCard>
      <MUILineChart
        height={450}
        series={[
          { data: pData, label: 'pv', id: 'pvId' },
          { data: uData, label: 'uv', id: 'uvId' }
        ]}
        xAxis={[{ scaleType: 'point', data: xLabels }]}
        sx={{
          [`.${lineElementClasses.root}, .${markElementClasses.root}`]: {
            strokeWidth: 1
          },
          '.MuiLineElement-series-pvId': {
            strokeDasharray: '5 5'
          },
          '.MuiLineElement-series-uvId': {
            strokeDasharray: '3 4 5 2'
          },
          [`.${markElementClasses.root}:not(.${markElementClasses.highlighted})`]: {
            fill: '#fff'
          },
          [`& .${markElementClasses.highlighted}`]: {
            stroke: 'none'
          },
          width: '100%',
          height: '500px'
        }}
      />
    </WrapperCard>
  )
}

export default LineChart