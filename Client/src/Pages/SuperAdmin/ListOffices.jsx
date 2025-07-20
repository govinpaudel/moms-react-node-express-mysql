import React, { useState,useEffect } from 'react'
import axios from 'axios';
import "./ListOffices.scss";
import { toast } from 'react-toastify';
const ListOffices = () => { 
  const initialdata={
    id:0,    
    state_id:0,
    state_name:'',
    office_id:0,
    office_name:'',
    isvoucherchecked:0,
    isactive:1  
  }

  const [officeData,setOfficedata]=useState();  
  const [bdata,setbdata]=useState([]);
  const [sselected, setsselected] = useState([]);
  const [stateData,setStateData]=useState();
  const Url = import.meta.env.VITE_API_URL + "superadmin/";
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

const onSubmit=async(e)=>{
  e.preventDefault();
  console.log(bdata);
  if(bdata.state_id==0){
    toast.warning("कृपया प्रदेश नं राख्नुहोस्");
    return;
  }  
  const response = await axios({
    method: "post",
    url: Url + "updateStateOfOffice",
    data: bdata,
  });
  console.log(response);  
  if(response.data.status==true){
    toast.success(response.data.message);
    loadOfficesData();
    setbdata(initialdata);
  }
 }
const handlechange=(e)=>{
  setbdata({...bdata,[e.target.name]:e.target.value})
  console.log(bdata);
}

  function handlestateclicked(e) {
    const x = sselected;
    if (e.target.checked) {
      x.push(e.target.value);
      setsselected(x);
    } else {
      const index = sselected.indexOf(e.target.value);
      x.splice(index, 1);
      setsselected(x);
    }
    console.log(sselected);
    setbdata(initialdata)
    setOfficedata([]);
    loadOfficesData();
  }

  const loadStates  = async () => {
    const data = {     
      aaba_id: loggedUser.aabaid,
    };
    console.log("getting statelist", data)
    const response = await axios({
      method: "post",
      url: Url + "listStates",
      data: data,
    });
    console.log(response.data);
    setStateData(response.data.states);

  }

  const loadEditData=async(id)=>{
    const data = {        
        id:id        
      }
      console.log("getting data by id", data);
      const response = await axios({
        method: "post",
        url: Url + "getOfficesById",
        data: data
      });
      console.log(response);
      setbdata(response.data.data[0]);      
  }
 
  const loadOfficesData= async()=>{
    const data = {      
      state_id:sselected
    }
    console.log("data sent", data);
    const response = await axios({
      method: "post",
      url: Url + "listOfficesByStates",
      data: data
    });
    console.log(response.data);
    setOfficedata(response.data.offices);
      }
  useEffect(() => {
    loadStates();
    document.title = "MOMS | कार्यालयको सेटअप";
  }, [])

  return (
    <section id="listoffices" className='listoffices'>
      <form onSubmit={onSubmit} className="Addvoucher__Form">
        <div className="Addvoucher__Form__part">         
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">कार्यालय कोड</label>
            <input
              type="text"
              name="id"
              className="Addvoucher__Form__part__item__input"
              value={bdata.id}              
              disabled             
            />
          </div>
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">कार्यालयको नाम</label>
            <input
              type="text"
              name="office_name"
              className="Addvoucher__Form__part__item__input"
              value={bdata.office_name}              
              disabled          
            />
          </div>
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">प्रदेश कोड</label>
            <input
              type="text"
              name="state_id"
              className="Addvoucher__Form__part__item__input"
              value={bdata.state_id}              
              onChange={handlechange}          
            />
          </div>
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">प्रदेशको नाम</label>
            <input
              type="text"
              name="state_name"
              className="Addvoucher__Form__part__item__input"
              value={bdata.state_name}
              onChange={handlechange} 
              disabled           
            />
          </div>
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">भौचर चेक</label>
            <input
              type="text"
              name="isvoucherchecked"
              className="Addvoucher__Form__part__item__input"
              value={bdata.isvoucherchecked}
              onChange={handlechange}            
            />
          </div>  
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">सेभ</label>
            <input
              type="submit"
              className="Addvoucher__Form__part__item__button"
              value="सेभ गर्नुहोस्"
            />
            </div>
          </div>
</form>
<div className="listoffices__statedata">
        {stateData ? stateData.map((item, i) => {
          return (
            <div className="listoffices__statedata__item" key={i}>
              <input
                className="Vlistoffices__statedata__item__box"
                type="checkbox"
                name="month"
                value={item.id}
                onClick={handlestateclicked}
              />
              <h4>{item.state_name}</h4>
            </div>
          );
        }) : null}
      </div>


      <table className='listvoucher__list__table'>
        <thead>
          <tr>
        <td>क्र.सं</td>
        <th>प्रदेशको कोड</th>
        <th>प्रदेशको नाम</th>
        <th>कार्यालय कोड</th>        
        <th>कार्यालयको नाम</th>
        <th>भौचर चेक</th>        
        <th>अवस्था</th>
        <th colSpan={2}>कृयाकलाप</th>
        </tr>
        </thead>
        <tbody>
          { officeData ? officeData.map((item,i)=>{
            return  <tr key={i}>
              <td>{i+1}</td>
              <td>{item.state_id}</td>
            <td>{item.state_name}</td>
            <td>{item.id}</td>
            <td>{item.office_name}</td>
            <td>{item.isvoucherchecked?"सक्रिय" : "निष्कृय" }</td>            
            <td> {item.isactive?"सक्रिय" : "निष्कृय" }</td>
            <td>
              <button className='listvoucher__list__editbtn' onClick={()=>{
                loadEditData(item.id);
              }}>संशोधन</button>
            </td>
          </tr>
          }):null
          }        

        </tbody>
      </table>
    </section>
  )
}

export default ListOffices;