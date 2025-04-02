import React, { useState,useEffect } from 'react'
import axios from 'axios';
import "./ListUsers.scss";
import { toast } from 'react-toastify';
const ListUsers = () => {
  const [data,setdata]=useState();
  const Url = import.meta.env.VITE_API_URL + "admin/";
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));


  const changeStatus=async(id,status)=>{
    const data = {
      office_id: loggedUser.office_id,
      user_id:id,
      status:status
    }
    console.log("data sent", data);
    const response = await axios({
      method: "post",
      url: Url + "changeUserStatus",
      data: data
    });
    console.log(response);  
    if(response.data.status){
      toast.success(response.data.message);
      loadData();
    }
    else{
      toast.warning(response.data.message);
    }
  }

  const loadData= async()=>{
    const data = {
      office_id: loggedUser.office_id
    }
    console.log("data sent", data);
    const response = await axios({
      method: "post",
      url: Url + "listUsers",
      data: data
    });
    console.log(response);
    setdata(response.data.data);

  }

  useEffect(() => {
    loadData();
  }, [])
  
  

  return (
    <section id="listusers" className='listusers'>
      <table>
        <thead>
          <tr>
        <th>प्रयोगकर्ताको नाम</th>
        <th>नाम नेपालीमा</th>
        <th>नाम अंग्रेजीमा</th>
        <th>ईमेल</th>
        <th>सम्पर्क नं</th>
        <th>अवस्था</th>
       
        </tr>
        </thead>
        <tbody>
          { data?data.map((item,i)=>{
            return  <tr key={i}>
            <td>{item.username}</td>
            <td>{item.nepname}</td>
            <td>{item.engname}</td>
            <td>{item.email}</td>
            <td>{item.contactno}</td>
            <td className={item.isactive?'activeuser':'inactiveuser'}><span className="userstatus" onClick={()=>{
              changeStatus(item.id,item.isactive);
            }}>{item.isactive?"सक्रिय" : "निष्कृय" }</span></td>
          </tr>
          }):null
          }        

        </tbody>
      </table>
    </section>
  )
}

export default ListUsers