import React from 'react';
import "./AdminSidebar.scss";
import { NavLink } from 'react-router-dom';


const AdminSidebar = () => {
    const data=[
      {id:1,path:'/apphome/',name:'पछाडि जानुहोस्'},
        {id:2,path:'/admin/listusers',name:'प्रयोगकर्ताहरु'},
        {id:3,path:'/admin/listfants',name:'फाँटहरु'},
        {id:4,path:'/admin/listnapas',name:'न.पा.हरु'},
        {id:5,path:'/admin/listparms',name:'भौचर सेटअप'},
        {id:6,path:'/admin/logout',name:'बाहिर जानुहोस्'},
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

export default AdminSidebar