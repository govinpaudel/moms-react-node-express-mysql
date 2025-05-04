
import "./GuthiHome.scss";
import { Outlet } from "react-router-dom";
import MainHeaderComponent from "../../Components/MainHeaderComponent";
import GuthiSidebar from "./GuthiSidebar";
const GuthiHome = () => {
  return (
    <>
      <MainHeaderComponent
        headerText="मिसिल व्यवस्थापन प्रणाली" />
      <section id="home" className="home">
        <div className="home__left"> <GuthiSidebar /></div>
        <div className="home__right">
          <Outlet />
        </div>
      </section></>
  )
}

export default GuthiHome;