
import "./VoucherHome.scss";
import { Outlet } from "react-router-dom";
import VoucherSidebar from "./VoucherSidebar";
import MainHeaderComponent from "../../Components/MainHeaderComponent";
const VoucherHome = () => {
  return (
    <>
      <MainHeaderComponent
        headerText="भौचर व्यवस्थापन प्रणाली" />
      <section id="home" className="home">
        <div className="home__left"> <VoucherSidebar /></div>
        <div className="home__right">
          <Outlet />
        </div>
      </section></>
  )
}

export default VoucherHome;