import React, { useState,useEffect } from 'react'
import axios from 'axios';
import "./List.scss";
import { toast } from 'react-toastify';
const ListBadhfand = () => { 
  const initialdata={
    id:0,
    aaba_id:0,
    aaba_name:'',
    state_id:0,
    state_name:'',
    sirshak_id:0,
    sirshak_name:"",
    sangh:0,
    pardesh:0,
    isthaniye:0,
    sanchitkosh:0
  }

  const [data,setdata]=useState();  
  const [bdata,setbdata]=useState([]);
  const [sselected, setsselected] = useState([]);
  const [statedata,setstatedata]=useState();
  const Url = import.meta.env.VITE_API_URL + "superadmin/";
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

const onSubmit=async(e)=>{
  e.preventDefault();
  console.log(bdata);
  console.log(parseFloat(bdata.sangh)+parseFloat(bdata.pardesh)+parseFloat(bdata.isthaniye)+parseFloat(bdata.sanchitkosh))
  if(parseFloat(bdata.sangh)+parseFloat(bdata.pardesh)+parseFloat(bdata.isthaniye)+parseFloat(bdata.sanchitkosh)!=100){
    toast.warning("कृपया सबैको जोड 100 हुने गरि रकम राख्नुहोस्");
    return;
  }
  const response = await axios({
    method: "post",
    url: Url + "updateBadhfand",
    data: bdata,
  });
  console.log(response);  
  if(response.data.status==true){
    toast.success(response.data.message);
    loadBadhfandData();
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
    setdata([]);
    loadBadhfandData();
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
    setstatedata(response.data.states);

  }

  const loadEditData=async(id)=>{
    const data = {        
        id:id        
      }
      console.log("getting data by id", data);
      const response = await axios({
        method: "post",
        url: Url + "getBadhfandById",
        data: data
      });
      setbdata(response.data.data[0])
      console.log(response.data.data[0]);  
  }
 
  const loadBadhfandData= async()=>{
    const data = {
      aaba_id: loggedUser.aabaid,
      state_id:sselected
    }
    console.log("data sent", data);
    const response = await axios({
      method: "post",
      url: Url + "listBadhfandByStates",
      data: data
    });
    console.log(response.data.data);
    setdata(response.data.data);

  }
  useEffect(() => {
    loadStates();
    document.title = "MOMS | बाँडफाँडको सेटअप";
  }, [])
  return (
    <section id="listusers" className='listusers'>
      <form onSubmit={onSubmit} className="Addvoucher__Form">
        <div className="Addvoucher__Form__part">         
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">आ.व.</label>
            <input
              type="text"
              name="aaba_name"
              className="Addvoucher__Form__part__item__input"
              value={bdata.aaba_name}              
              disabled             
            />
          </div>
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">प्रदेश</label>
            <input
              type="text"
              name="state_name"
              className="Addvoucher__Form__part__item__input"
              value={bdata.state_name}              
              disabled          
            />
          </div>
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">शिर्षक</label>
            <input
              type="text"
              name="sirshak_name"
              className="Addvoucher__Form__part__item__input"
              value={bdata.sirshak_name}              
              disabled               
            />
          </div>
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">संचितकोष</label>
            <input
              type="text"
              name="sanchitkosh"
              className="Addvoucher__Form__part__item__input"
              value={bdata.sanchitkosh}
              onChange={handlechange}            
            />
          </div>
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">संघ</label>
            <input
              type="text"
              name="sangh"
              className="Addvoucher__Form__part__item__input"
              value={bdata.sangh}
              onChange={handlechange}            
            />
          </div>         
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">प्रदेश</label>
            <input
              type="text"
              name="pardesh"
              className="Addvoucher__Form__part__item__input"
              value={bdata.pardesh}
              onChange={handlechange}            
            />
          </div>
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">स्थानिय</label>
            <input
              type="text"
              name="isthaniye"
              className="Addvoucher__Form__part__item__input"
              value={bdata.isthaniye}
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
<div className="Vouchermonthly__month">
        {statedata ? statedata.map((item, i) => {
          return (
            <div className="Vouchermonthly__month__item" key={i}>
              <input
                className="Vouchermonthly__month__item__box"
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
        <th>आ.व.</th>
        <th>प्रदेशको नाम</th>
        <th>शिर्षकको नाम</th>
        <th>संघ</th>
        <th>प्रदेश</th>
        <th>स्थानिय</th>
        <th>संचितकोष</th>
        <th>अवस्था</th>
        <th colSpan={2}>कृयाकलाप</th>
        </tr>
        </thead>
        <tbody>
          { data ? data.map((item,i)=>{
            return  <tr key={i}>
            <td>{item.aaba_name}</td>
            <td>{item.state_name}</td>
            <td>{item.sirshak_name}</td>
            <td>{item.sangh}</td>
            <td>{item.pardesh}</td>
            <td>{item.isthaniye}</td>
            <td>{item.sanchitkosh}</td>
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

export default ListBadhfand;