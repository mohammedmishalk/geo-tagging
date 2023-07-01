import { Navigate, Outlet } from 'react-router-dom'
 
let auth=localStorage.getItem('token')

const PrivateRoutes = () => {
//   let auth = {token:true}
return (
    auth ? <Outlet/> : <Navigate to="/"/>
  )
}

export default PrivateRoutes