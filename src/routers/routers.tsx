import { Route, Routes } from 'react-router'
import Layout from '../layout'
import SigninPage from '@/pages/auth/signin/signin.page'
import SignupPage from '@/pages/auth/signup/signup.page'
import VerifyPage from '@/pages/auth/verify/verify.page'
import ForgotPasswordPage from '@/pages/auth/forgotPassword/forgot.password.page'
import VerifyPasswordPage from '@/pages/auth/forgotPassword/verify.password.page'
import ChangePasswordPage from '@/pages/auth/forgotPassword/change.password.page'
import DashboardPage from '@/pages/dashboard/dashboard.page'
import CustomerPage from '@/pages/customer/customer.page'
import OrderPage from '@/pages/order/order.page'
import NotFoundPage from '@/pages/notfound/notfound.page'
import AccountPage from '@/pages/account/account.page'
import PrivateRouter from './private.router'
import { useAppSelector } from '@/redux/hooks'
import DetailCustomer from '@/pages/customer/detail.customer/detail.customer'
import RolePage from '@/pages/role/role.page'
import UpdateRole from '@/pages/role/update.role'


const Routers = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  return (
    <Routes>
      <Route element={<PrivateRouter isAllowed={isAuthenticated ? true : false} redirectTo='/signin' />}>
        <Route path='/' element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path='/orders' element={<OrderPage />} />
          <Route path='/customers' element={<CustomerPage />} />
          <Route path='/customers/:id' element={<DetailCustomer />} />
          <Route path='/account' element={<AccountPage />} />
          <Route path='/roles' element={<RolePage />} />
          <Route path='/roles/update/:id' element={<UpdateRole />} />
        </Route>
      </Route>
      <Route element={<PrivateRouter isAllowed={isAuthenticated ? false : true} redirectTo='/' />}>
        <Route path='/signin' element={<SigninPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/verify-account' element={<VerifyPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/verify-password' element={<VerifyPasswordPage />} />
        <Route path='/change-password' element={<ChangePasswordPage />} />
      </Route>
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default Routers
