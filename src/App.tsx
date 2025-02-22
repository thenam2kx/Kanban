import { useEffect } from 'react'
import { useAppDispatch } from './redux/hooks'
import Routers from './routers/routers'
import { fetchAccount } from './redux/slices/auth.slice'

const App = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchAccount())
  }, [])
  return (
    <>
      <Routers />
    </>
  )
}

export default App
