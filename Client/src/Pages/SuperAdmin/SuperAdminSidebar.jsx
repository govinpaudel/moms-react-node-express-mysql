import React from 'react';
import "./SuperAdminSidebar.scss";
import { NavLink } from 'react-router-dom';


const SuperAdminSidebar = () => {
    const data=[
      {id:1,path:'/apphome/',name:'पछाडि जानुहोस्'},
        {id:2,path:'/superadmin/listadminusers',name:'एडमिन प्रयोगकर्ताहरु'},   
        {id:2,path:'/superadmin/listbadhfand',name:'बाडफाँड सेटअप'},      
        {id:3,path:'/superadmin/listoffices',name:'कार्यालय सेटअप'},      
        {id:4,path:'/superadmin/logout',name:'बाहिर जानुहोस्'},
    ]
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