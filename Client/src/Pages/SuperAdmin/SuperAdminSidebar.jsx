import React, { useEffect, useState } from 'react';
import "./SuperAdminSidebar.scss";
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const SuperAdminSidebar = () => {
  const [data, setdata] = useState([])
  const Url = import.meta.env.VITE_API_URL + "auth/";
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

  const LoadSidebar = async () => {
    const response = await axios({
      method: "post",
      url: Url + "getSidebarlist",
      data: {
        user_id: loggedUser.id,
        module: 'SuperAdmin'
      }
    });
    setdata(response.data.data);
    console.log(response.data.data)
  }


  useEffect(() => {
    LoadSidebar()
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

export default SuperAdminSidebar