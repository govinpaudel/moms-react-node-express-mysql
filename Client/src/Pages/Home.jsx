
import "./Home.scss";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MainHeaderComponent from "../Components/MainHeaderComponent";
const Home = () => {
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

export default Home