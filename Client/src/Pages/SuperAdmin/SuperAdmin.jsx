import "./SuperAdmin.scss";
import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSidebar";
import MainHeaderComponent from "../../Components/MainHeaderComponent";
const SuperAdmin = () => {  
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