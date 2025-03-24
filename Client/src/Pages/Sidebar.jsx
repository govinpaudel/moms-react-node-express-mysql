import { NavLink } from "react-router-dom";
import "./Sidebar.scss";
import SidebarData from "./Sidebar-list";
import { useEffect,useState } from "react";
import axios from "axios";

const Sidebar = () => {
const Url = import.meta.env.VITE_API_URL + "auth/";
const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
const [data,setdata]=useState([])
const [operations,setoperations] = useState([])
const [reports,setreports] = useState([])
const loadsidebardata= async()=>{
  const response=await axios({
    method: "post",
    url: Url + "getSidebarlist",
    data:{
      user_id:loggedUser.id
    }
  });
  // setdata(response.data);
  console.log(response.data.data)
  setoperations(response.data.data.filter(data => data.type =='Operations'));
  setreports(response.data.data.filter(data => data.type =='Reports'));
  console.log("Operations",operations);
  console.log("Reports",reports);

}


useEffect(() => {
loadsidebardata();
}, [])

  return (
    <section id="sidebar" className="sidebar">
      <div className="sidebar__menus">
      <h6 className="sidebar__menus__menu-text">Operations</h6>
      <ul>
              {operations.map((item, i) => {
                return (
                  <li key={i}>
                    <NavLink to={item.path}>{item.name}</NavLink>
                  </li>
                );
              })}
            </ul>
            <h6 className="sidebar__menus__menu-text">Reports</h6>
      <ul>
              {reports.map((item, i) => {
                return (
                  <li key={i}>
                    <NavLink to={item.path}>{item.name}</NavLink>
                  </li>
                );
              })}
            </ul>
      </div>    
    </section>
  );
};

export default Sidebar;
