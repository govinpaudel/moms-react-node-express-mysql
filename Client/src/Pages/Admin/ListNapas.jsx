import React, { useState,useEffect } from 'react'
import axiosInstance from '../../axiosInstance';
import "./List.scss";
import { toast } from 'react-toastify';
const ListNapas = () => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    const initialdata = {
        napa_id:0,
        office_id:loggedUser.office_id,
        napa_name:"",
        display_order:0
    }
  const [listdata,setlistdata]=useState();
  const [data,setdata]=useState(initialdata);
  const Url = import.meta.env.VITE_API_URL;
  const loadEditData=async(data)=>{
      setdata(data)
   }

const OnSubmit=async(e)=>{
    e.preventDefault();
    console.log("data sent for updation",data);
  const url="/addOrUpdateNapas"
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
      id:id,
      table:'voucher_napa',
      status:status
    }
    console.log("data sent", data);
    const url="/toggleStatus"
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
      office_id: loggedUser.office_id,
      table:'voucher_napa'
    }
    console.log("data sent", data);
    const url="/getAll"
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
                loadEditData(item);
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