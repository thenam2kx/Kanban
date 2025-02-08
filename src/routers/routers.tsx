import { Route, Routes } from "react-router"
import Layout from "../layout"


const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
    </Routes>
  )
}

export default Routers