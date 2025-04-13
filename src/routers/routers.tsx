import { Route, Routes } from 'react-router'
import NotFoundPage from '@/pages/notfound/notfound.page'
import PrivateRouter from './private.router'
import { useAppSelector } from '@/redux/hooks'
import LayoutPage from '@/layouts/layout.page'
import SigninPage from '@/pages/auth/signin/signin.page'
import SignupPage from '@/pages/auth/signup/signup.page'
import UserPage from '@/pages/user/user.page'
import CreateUserPage from '@/pages/user/create.user.page'
import UpdateUserPage from '@/pages/user/update.user.page'
import CategoryPage from '@/pages/category/category.page'
import CreateCategory from '@/pages/category/create.category'
import UpdateCategoryPage from '@/pages/category/update.category'


const Routers = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  return (
    <Routes>
      <Route element={<PrivateRouter isAllowed={isAuthenticated ? true : false} redirectTo='/signin' />}>
        <Route path='/' element={<LayoutPage />}>
          <Route path='/users' element={<UserPage />} />
          <Route path='/users/create' element={<CreateUserPage />} />
          <Route path='/users/update/:id' element={<UpdateUserPage />} />
          <Route path='/categories' element={<CategoryPage />} />
          <Route path='/categories/create' element={<CreateCategory />} />
          <Route path='/categories/update/:id' element={<UpdateCategoryPage />} />
          {/* <Route index element={<DashboardPage />} />
          <Route path='/orders' element={<OrderPage />} />
          <Route path='/customers' element={<CustomerPage />} />
          <Route path='/customers/:id' element={<DetailCustomer />} />
          <Route path='/account' element={<AccountPage />} />
          <Route path='/roles' element={<RolePage />} />
          <Route path='/roles/create' element={<CreateRole />} />
          <Route path='/roles/update/:id' element={<UpdateRole />} />
          <Route path='/categories' element={<CategoryPage />} />
          <Route path='/categories/create' element={<CreateCategory />} />
          <Route path='/categories/update/:id' element={<UpdateCategory />} /> */}
        </Route>
      </Route>
      <Route element={<PrivateRouter isAllowed={isAuthenticated ? false : true} redirectTo='/' />}>
        <Route path='/signin' element={<SigninPage />} />
        <Route path='/signup' element={<SignupPage />} />
        {/* <Route path='/verify-account' element={<VerifyPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/verify-password' element={<VerifyPasswordPage />} />
        <Route path='/change-password' element={<ChangePasswordPage />} /> */}
      </Route>
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default Routers
