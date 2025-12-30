import "./Admin.scss";
import { Outlet } from "react-router-dom";
import MainHeaderComponent from "../../Components/MainHeaderComponent";
import AdminSidebar from "./AdminSidebar";
const Admin = () => {
 
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