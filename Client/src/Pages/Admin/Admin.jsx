import "../Home.scss";
import { Outlet } from "react-router-dom";
import MainHeaderComponent from "../../Components/MainHeaderComponent";
import AdminSidebar from "./AdminSidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const loggedUser=JSON.stringify(sessionStorage.getItem('loggedUser'));
  const navigate=useNavigate();
  const checkRole=()=>{
    console.log("role",loggedUser)
  if (loggedUser.role!=1){
    // navigate('/home')
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