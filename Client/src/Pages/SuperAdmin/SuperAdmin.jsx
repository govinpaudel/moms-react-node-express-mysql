import "./SuperAdmin.scss";
import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSidebar";
import MainHeaderComponent from "../../Components/MainHeaderComponent";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SuperAdmin = () => {
  const loggedUser=JSON.parse(sessionStorage.getItem('loggedUser'));
  const navigate=useNavigate();
  const checkRole=()=>{
    console.log("role",loggedUser.role)
  if (loggedUser.role!=1){
    toast.warning("सुपर एडमिन प्रयोगकर्तालाई मात्र यो अख्तियारी उपलब्ध छ ।")
    navigate('/apphome')
  }    
  }
  useEffect(() => {
    checkRole()
  }, [])
  
  return (
    <>
      <MainHeaderComponent
        headerText="मालपोत कार्यालय व्यवस्थापन प्रणाली" />
      <section id="home" className="home">
        <div className="home__left"> <SuperAdminSidebar /></div>
        <div className="home__right">
          <Outlet />
        </div>
      </section></>
  )
}

export default SuperAdmin