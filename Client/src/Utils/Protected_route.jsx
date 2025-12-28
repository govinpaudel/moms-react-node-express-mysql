import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
const Protected_route = () => {
const access_token=localStorage.getItem('access_token');
  return access_token ? <Outlet/> : <Navigate to={"/login"}/>    
}

export default Protected_route