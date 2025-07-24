import React, { useState,useEffect } from 'react'
import axiosInstance from '../../axiosInstance';
import "./List.scss";
import { toast } from 'react-toastify';
const ListNapas = () => {
    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
    const initialdata = {
        napa_id:0,
        office_id:loggedUser.office_id,
        napa_name:"",
        display_order:0
    }
  const [listdata,setlistdata]=useState();
  const [data,setdata]=useState(initialdata);
  const Url = import.meta.env.VITE_API_URL + "admin/";
  const loadEditData=async(id)=>{
    const data = {
        office_id: loggedUser.office_id,
        napa_id:id        
      }
      console.log("data sent", data);
const url="admin/getNapaById"
      const response = await axiosInstance.post(url,data); 

      
      setdata(response.data.data[0])
      console.log(response.data.data[0]);  
  }

const OnSubmit=async(e)=>{
    e.preventDefault();
    console.log("data sent for updation",data);
  const url="admin/addOrUpdateNapas"
    const response = await axiosInstance.post(url,data); 
    
      console.log(response);
      if(response.data.status==true){
        toast.success(response.data.message);
        loadData();
        setdata(initialdata);
      }   
 
}
  const changeStatus=async(id,status)=>{
    const data = {
      office_id: loggedUser.office_id,
      napa_id:id,
      status:status
    }
    console.log("data sent", data);
    const url="admin/changeNapaStatus"
    const response = await axiosInstance.post(url,data);     
    console.log(response);  
    if(response.data.status){
      toast.success(response.data.message);
      loadData();
    }
    else{
      toast.warning(response.data.message);
    }
  }

  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
    console.log("data changed", data);
  };

  const loadData= async()=>{
    const data = {
      office_id: loggedUser.office_id
    }
    console.log("data sent", data);
    const url="admin/listNapas"
    const response = await axiosInstance.post(url,data);
    
    console.log(response);
    setlistdata(response.data.data);

  }

  useEffect(() => {
    loadData();
    document.title = "MOMS | न.पा.हरु";
  }, [])
  
  

  return (
    <section id="list" className='list'>
        <div className="list__outerdiv">
        <h5 className="list__outerdiv__header-text">नगरपालिका दर्ता तथा संशोधन फाराम</h5>
            <form className='list__form' onSubmit={OnSubmit}>
                <div className="list__form__item">
                <input type="text" onChange={handleChange} className='list__form__item__input' value={data.napa_name} name='napa_name' placeholder='नगरपालिका नाम नेपालीमा' required/> 
                </div>
                <div className="list__form__item">
                <input type="number" onChange={handleChange} className='list__form__item__input' value={data.display_order} name='display_order' placeholder='देखिने क्रमसंख्या' required/>
                </div>
                <div className="list__form__item">
                <input type="submit" value="सेभ गर्नुहोस्" className='list__form__item__button'/>
                </div>
            </form>
        </div>
      <table className='listvoucher__list__table table-800'>
        <thead>
          <tr>
        <th>नगरपालिकाको नाम</th>
        <th>देखिने क्रम</th>        
        <th>अवस्था</th>
        <th>कृयाकलाप</th>
        </tr>
        </thead>
        <tbody>
          { listdata?listdata.map((item,i)=>{
            return  <tr key={i}>
            <td>{item.napa_name}</td>
            <td>{item.display_order}</td>
            <td >
            {item.isactive?"सक्रिय" : "निष्कृय" } </td>            
            <td>
            <button className='editbtn' onClick={()=>{
              changeStatus(item.id,item.isactive);
            }}>{item.isactive?"निस्कृय पार्नुहोस्" : "सकृय पार्नुहोस्" }</button>              
              
            <button className='editbtn' onClick={()=>{
                loadEditData(item.id);
            }}>संशोधन गर्नुहोस्</button></td>
          </tr>
          }):null
          }        

        </tbody>
      </table>
    </section>
  )
}

export default ListNapas;