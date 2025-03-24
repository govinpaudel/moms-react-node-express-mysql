
import "./Home.scss";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Home = () => {
  return (
    <section id="home" className="home">
      <div className="home__left"> <Sidebar /></div>
      <div className="home__right">
        <Outlet />
      </div>
    </section>
  )
}

export default Home