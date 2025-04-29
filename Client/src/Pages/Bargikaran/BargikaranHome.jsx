
import "./BargikaranHome.scss";
import { Outlet } from "react-router-dom";
import Sidebar from "./BargikaranSidebar";
import MainHeaderComponent from "../../Components/MainHeaderComponent";
const BargikaranHome = () => {
  return (
    <>
      <MainHeaderComponent
        headerText="मालपोत कार्यालय व्यवस्थापन प्रणाली" />
      <section id="home" className="home">
        <div className="home__left"> <Sidebar /></div>
        <div className="home__right">
          <Outlet />
        </div>
      </section></>
  )
}

export default BargikaranHome