import "./Admin.scss";
import { Outlet } from "react-router-dom";
import MainHeaderComponent from "../../Components/MainHeaderComponent";
import AdminSidebar from "./AdminSidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Admin = () => {
  const loggedUser=JSON.parse(localStorage.getItem('loggedUser'));
  const navigate=useNavigate();
  const checkRole=()=>{
    console.log("role",loggedUser)
  if (!loggedUser.role==2){
    toast.warning("एडमिन प्रयोगकर्तालाई मात्र यो अख्तियारी उपलब्ध छ ।")
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
        <div className="home__left"> <AdminSidebar /></div>
        <div className="home__right">
          <Outlet />
        </div>
      </section></>
  )
}

export default Admin