import {
  ShoppingCartOutlined,
  UserOutlined,
  TagOutlined,
  ShoppingOutlined
} from '@ant-design/icons'
import {
  Button,
  Card,
  Statistic,
  Table,
  Progress,
  Typography
} from 'antd'
import { Line } from '@ant-design/charts'

const { Title, Text } = Typography

const DashboardPage = () => {

  // Sample data for statistics
  const stats = [
    { title: 'Total Sales', value: '$12,456', icon: <ShoppingCartOutlined />, color: 'bg-green-50 text-green-600' },
    { title: 'New Orders', value: '48', icon: <ShoppingOutlined />, color: 'bg-blue-50 text-blue-600' },
    { title: 'New Customers', value: '24', icon: <UserOutlined />, color: 'bg-purple-50 text-purple-600' },
    { title: 'Products', value: '156', icon: <TagOutlined />, color: 'bg-amber-50 text-amber-600' }
  ]

  // Sample data for recent orders
  const recentOrders = [
    { key: '1', id: '#ORD-001', customer: 'John Smith', items: 5, total: '$78.50', status: 'Delivered' },
    { key: '2', id: '#ORD-002', customer: 'Sarah Johnson', items: 3, total: '$45.20', status: 'Processing' },
    { key: '3', id: '#ORD-003', customer: 'Michael Brown', items: 7, total: '$124.00', status: 'Delivered' },
    { key: '4', id: '#ORD-004', customer: 'Emily Davis', items: 2, total: '$32.75', status: 'Pending' },
    { key: '5', id: '#ORD-005', customer: 'David Wilson', items: 4, total: '$67.30', status: 'Processing' }
  ]

  // Sample data for popular products
  const popularProducts = [
    { key: '1', name: 'Organic Apples', category: 'Fruits', sold: 245, stock: 120, price: '$3.99/kg' },
    { key: '2', name: 'Fresh Salmon', category: 'Seafood', sold: 187, stock: 45, price: '$12.99/lb' },
    { key: '3', name: 'Organic Spinach', category: 'Vegetables', sold: 156, stock: 78, price: '$2.49/bunch' },
    { key: '4', name: 'Free-Range Eggs', category: 'Dairy', sold: 134, stock: 200, price: '$4.99/dozen' }
  ]

  // Sample data for sales chart
  const salesData = [
    { month: 'Jan', sales: 3800 },
    { month: 'Feb', sales: 4200 },
    { month: 'Mar', sales: 3900 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 5100 },
    { month: 'Jun', sales: 5800 },
    { month: 'Jul', sales: 6100 }
  ]

  // Order status colors
  const statusColors = {
    Delivered: 'bg-green-100 text-green-800',
    Processing: 'bg-blue-100 text-blue-800',
    Pending: 'bg-amber-100 text-amber-800'
  }

  // Order columns for table
  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <a className='text-green-600 font-medium'>{text}</a>
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer'
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items'
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (text: string) => <span className='font-medium'>{text}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}
        >
          {status}
        </span>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type='link' size='small' className='text-green-600 p-0'>
          View
        </Button>
      )
    }
  ]

  // Product columns for table
  const productColumns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a className='text-green-600 font-medium'>{text}</a>
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => <span className='text-gray-600'>{text}</span>
    },
    {
      title: 'Sold',
      dataIndex: 'sold',
      key: 'sold'
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <div className='flex items-center'>
          <span className='mr-2'>{stock}</span>
          <Progress
            percent={Math.min(100, (stock / 200) * 100)}
            size='small'
            showInfo={false}
            strokeColor={stock < 50 ? '#f5222d' : '#52c41a'}
          />
        </div>
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price'
    }
  ]

  // Chart config
  const config = {
    data: salesData,
    height: 300,
    xField: 'month',
    yField: 'sales',
    point: {
      size: 5,
      shape: 'diamond'
    },
    color: '#10b981'
  }

  return (
    <div className='rounded-lg overflow-auto'>
      <div className='mb-6'>
        <Title level={4} className='mb-6'>
          Dashboard Overview
        </Title>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {stats.map((stat, index) => (
            <Card key={index} className='shadow-sm'>
              <div className='flex items-center'>
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <Text type='secondary'>{stat.title}</Text>
                  <Statistic value={stat.value} valueStyle={{ fontSize: '1.5rem' }} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6'>
        <Card title='Sales Overview' className='lg:col-span-2 shadow-sm'>
          <Line {...config} />
        </Card>
        <Card title='Top Categories' className='shadow-sm'>
          <div className='space-y-4'>
            <div>
              <div className='flex justify-between mb-1'>
                <span className='text-sm font-medium'>Fruits & Vegetables</span>
                <span className='text-sm font-medium'>45%</span>
              </div>
              <Progress percent={45} showInfo={false} strokeColor='#10b981' />
            </div>
            <div>
              <div className='flex justify-between mb-1'>
                <span className='text-sm font-medium'>Meat & Seafood</span>
                <span className='text-sm font-medium'>30%</span>
              </div>
              <Progress percent={30} showInfo={false} strokeColor='#3b82f6' />
            </div>
            <div>
              <div className='flex justify-between mb-1'>
                <span className='text-sm font-medium'>Dairy & Eggs</span>
                <span className='text-sm font-medium'>15%</span>
              </div>
              <Progress percent={15} showInfo={false} strokeColor='#f59e0b' />
            </div>
            <div>
              <div className='flex justify-between mb-1'>
                <span className='text-sm font-medium'>Bakery</span>
                <span className='text-sm font-medium'>10%</span>
              </div>
              <Progress percent={10} showInfo={false} strokeColor='#8b5cf6' />
            </div>
          </div>
        </Card>
      </div>

      <div className='mb-6'>
        <Card
          title='Recent Orders'
          extra={
            <Button type='link' className='text-green-600'>
              View All
            </Button>
          }
          className='shadow-sm'
        >
          <Table columns={orderColumns} dataSource={recentOrders} pagination={false} className='overflow-x-auto' />
        </Card>
      </div>

      <div>
        <Card
          title='Popular Products'
          extra={
            <Button type='link' className='text-green-600'>
              View All
            </Button>
          }
          className='shadow-sm'
        >
          <Table
            columns={productColumns}
            dataSource={popularProducts}
            pagination={false}
            className='overflow-x-auto'
          />
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage