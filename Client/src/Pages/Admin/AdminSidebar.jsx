import React, { useEffect, useState } from 'react';
import "./AdminSidebar.scss";
import { NavLink } from 'react-router-dom';
import axios from 'axios';
const AdminSidebar = () => {
  const [data, setdata] = useState([])  
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const loadSidebar = async () => {
    const data = {
      user_id: loggedUser.id,
      module: 'Admin'
    }
    const response = await axios.post("/getSidebarlist", data);    
    setdata(response.data.data);
    console.log(response.data.data)
  }

  useEffect(() => {
    loadSidebar()
  }, [])
  return (
    <section id='AdminSidebar' className='AdminSidebar'>
      <div className='AdminSidebar__menus'>
        <ul>
          {data.map((item, i) => {
            return (
              <li key={i}>
                <NavLink to={item.path}>{item.name}</NavLink>
              </li>
            );
          })}
        </ul>

      </div>
    </section>
  )
}

export default AdminSidebar