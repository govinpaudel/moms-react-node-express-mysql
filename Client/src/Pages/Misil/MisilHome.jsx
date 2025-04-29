
import "./MisilHome.scss";
import { Outlet } from "react-router-dom";
import MainHeaderComponent from "../../Components/MainHeaderComponent";
import MisilSidebar from "./MisilSidebar";
const MisilHome = () => {
  return (
    <>
      <MainHeaderComponent
        headerText="मिसिल व्यवस्थापन प्रणाली" />
      <section id="home" className="home">
        <div className="home__left"> <MisilSidebar /></div>
        <div className="home__right">
          <Outlet />
        </div>
      </section></>
  )
}

export default MisilHome;