import React, { useState,useEffect } from "react";
import "./VoucherMonthly.scss";
import axios from "axios";
import { toast } from "react-toastify";
import PageHeaderComponent from "../../Components/PageHeaderComponent";
import { BsInfoCircleFill } from "react-icons/bs";
const VoucherMonthly = () => {
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const Url = import.meta.env.VITE_API_URL + "voucher/";
  const [mselected, setmselected] = useState([]);
  const [regi,setregi]=useState([{}]);
  const [summary,setsummary]=useState([{}]);
  const [isthaniye,setisthaniye]=useState();
  const [pardesh,setpardesh]=useState([]);
  const [mdata,setmdata]=useState([]); 

  const loadmonth=async()=>{
    const data = {     
      office_id: loggedUser.office_id,
      aaba_id: loggedUser.aabaid,      
    };
    console.log("getting monthlist",data)
    const response = await axios({
      method: "post",
      url: Url + "Monthlist",
      data: data,
    });
    console.log(response.data);
    setmdata(response.data.months);
  }


useEffect(() => {
  loadmonth()
}, [])
  

  const genReport = async () => {
    setregi([{}]); 
    setsummary([{}]);
    setisthaniye([{}]);
    setpardesh([{}]);
    if(mselected.length==0){
      toast.warning("कृपया महिना छनौट गर्नुहोला ।")
      return;
    }
    const data = {     
      office_id: loggedUser.office_id,
      aaba_id: loggedUser.aabaid,
      month_id: mselected,
    };
    console.log("data sent", data);
    const response = await axios({
      method: "post",
      url: Url + "VoucherMonthly",
      data: data,
    });
    console.log(response.data.data);    
    setregi(response.data.data.registration); 
    setsummary(response.data.data.summary);
    setisthaniye(response.data.data.isthaniye);
    setpardesh(response.data.data.pardesh);
  };

  function handleclick(e) { 
    const x = mselected;  
    if (e.target.checked) {            
      x.push(e.target.value);
      setmselected(x);
    } else {      
      const index = mselected.indexOf(e.target.value);
      x.splice(index, 1);
      setmselected(x);      
    }
    console.log("Month", mselected);
  }
  return (
    <section id="Vouchermonthly" className="Vouchermonthly">
       <PageHeaderComponent
       officeText={`(${loggedUser.office_name})`}
        headerText="कार्यालयको मासिक प्रतिवेदन"
        icon={<BsInfoCircleFill size={40} />}
      />
      <div className="Vouchermonthly__month">
        {mdata.map((item, i) => {
          return (
            <div className="Vouchermonthly__month__item" key={i}>
              <input
                className="Vouchermonthly__month__item__box"
                type="checkbox"
                name="month"
                value={item.mid}
                onClick={handleclick}
              />
              <h4>{item.mname}</h4>
            </div>
          );
        })}
        <div className="Vouchermonthly__month__button no-print">
          <button onClick={genReport} className="Vouchermonthly__month__button__button">
            रीपोर्ट हेर्नुहोस्
          </button>
        </div>
      </div>      
      <table className="Vouchermonthly__table">
        <thead>
          <tr>
            <th>शिर्षक</th> 
            <th>रकम</th>            
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{ regi[0].sirshak_name}</td>
            <td>{Math.round(regi[0].amount,2)}</td>
          </tr>
          <tr>
            <td>संचितकोषमा जाने</td>
            <td>{Math.round(summary[0].sanchitkosh,2)}</td>
          </tr>
          <tr><td colSpan={2}><hr className="line"/></td></tr> 
        </tbody>
        </table>       
        <table className="Vouchermonthly__table">
          <tbody>         
          <tr>
            <th>स्थानियमा जाने</th>
            <th>रकम</th>
          </tr>
          {isthaniye ? isthaniye.map((item,i)=>{
              return  <tr key={i}><td>{item.napa_name}</td><td>{Math.round(item.isthaniye)}</td></tr>                            
          }):null}
          <tr>
            <td>जम्मा स्थानियमा जाने</td>
            <td>{Math.round(summary[0].isthaniye)}</td>
          </tr>
          <tr><td colSpan={2}><hr className="line"/></td></tr> 
          </tbody> 
          </table>          
          <table className="Vouchermonthly__table">
          <tbody>
          <tr>
            <th>प्रदेशमा जाने</th> <th>रकम</th>      
          </tr>
          {
            pardesh.map((item,i)=>{
              return <><tr key={i}>
                <td>{item.sirshak_name}</td>
                <td>{Math.round(item.pardesh)}</td>
              </tr>              
              </>
            })
          }
          <tr>
            <td>जम्मा प्रदेशमा जाने</td>
            <td>{Math.round(summary[0].pardesh)}</td>
          </tr>
          <tr><td colSpan={2}><hr className="line"/></td></tr>  
          </tbody>
            </table>
           
          <table className="Vouchermonthly__table">
          <tbody>
          <tr>
            <td>संघमा जाने</td>
            <td>{Math.round(summary[0].sangh)}</td>
          </tr>
          <tr><td colSpan={2}><hr className="line"/></td></tr>      
          <tr>
            <td>कार्यालय जम्मा </td>
            <td>{Math.round(summary[0].amount)}</td>
          </tr>
          </tbody>
          </table>
    </section>
  );
};

export default VoucherMonthly;
