import { NavLink } from "react-router-dom";
import "./BargikaranSidebar.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from '../../axiosInstance'

const BargikaranSidebar = () => {
  const Url = import.meta.env.VITE_API_URL + "auth/";
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const [data, setdata] = useState([]) 
  const loadsidebardata = async () => {
    const url = "auth/"+"getSidebarlist"
    const data={
        user_id: loggedUser.id,
        module:'Bargikaran'
      }
    const response = await axiosInstance.post(url,data);
    setdata(response.data.data);
    console.log(response.data.data);
  }
  useEffect(() => {
    loadsidebardata();
  }, [])

  return (
    <section id="sidebar" className="sidebar no-print">
      <div className="sidebar__menus">
        <h5 className="sidebar__menus__menu-text">{loggedUser.role_name}</h5>
        <h6 className="sidebar__menus__menu-text">( {loggedUser.username} )</h6>
        <ul>
        <li>
          <NavLink to={'/apphome'}>पछाडि जानुहोस्</NavLink>
          </li> 
          {data?data.map((item, i) => {
            return (
              <li key={i}>
                <NavLink to={item.path}>{item.name}</NavLink>
              </li>
            );
          }):null}            
          <li >
            <NavLink to={"/logout"}>लगआउट</NavLink>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default BargikaranSidebar;
