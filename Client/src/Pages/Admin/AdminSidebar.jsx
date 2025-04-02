import React from 'react';
import "./AdminSidebar.scss";
import { NavLink } from 'react-router-dom';


const AdminSidebar = () => {
    const data=[
      {id:1,path:'/home/',name:'GoBackToHome'},
        {id:2,path:'/admin/listusers',name:'ListUsers'},
        {id:3,path:'/admin/listfants',name:'ListFants'},
        {id:4,path:'/admin/liststaffs',name:'ListStaffs'},
        {id:5,path:'/admin/listnapas',name:'ListNapas'},
        {id:6,path:'/admin/listparms',name:'ListParms'},
        {id:7,path:'/admin/logout',name:'Logout'},
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