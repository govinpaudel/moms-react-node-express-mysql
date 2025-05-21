import React, { useState,useEffect } from "react";
import "./VoucherMonthly.scss";
import axios from "axios";
import PageHeaderComponent from "../../Components/PageHeaderComponent";
import { BsInfoCircleFill } from "react-icons/bs";
const VoucherAccount = () => {
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const Url = import.meta.env.VITE_API_URL + "voucher/";
  const [mselected, setmselected] = useState([]);  
  const [summary,setsummary]=useState([{}]);  
  const [mdata,setmdata]=useState([]); 
  const [total, settotal] = useState(0);  
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

  const dototal =()=>{
    var x =0;
    summary.forEach((a) => {      
      console.log(x);
      x=x+ parseInt(a.amount);
    })
    settotal(x);
  }

useEffect(() => {
  loadmonth();
  document.title = "MOMS | महिना अनुसारको विवरण";
}, [])  

useEffect(()=>{
 dototal();
},[summary])

  const genReport = async () => {    
    setsummary([{}]);       
    const data = {     
      office_id: loggedUser.office_id,
      aaba_id: loggedUser.aabaid,
      month_id: mselected,
    };
    console.log("data sent", data);
    const response = await axios({
      method: "post",
      url: Url + "VoucherAccount",
      data: data,
    });
    console.log(response.data.data);
   setsummary(response.data.data);   
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
        headerText="को मासिक प्रतिवेदन"
        icon={<BsInfoCircleFill size={40} />}
      />
      <div className="Vouchermonthly__month">
        {mdata.map((item, i) => {
          return (
            <div className="Vouchermonthly__month__item" key={i}>
              <h4>{item.mid}</h4>
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
      <table className="listvoucher__list__table">
        <thead>
          <tr>
            <th>शिर्षक</th> 
            <th>रकम</th>            
          </tr>
        </thead>
        <tbody>
          {summary?summary.map((item,i)=>{
            return <tr key={i}><td>{item.acc_sirshak_name}</td><td>{item.amount}</td></tr>
          }):null}
          <tr>
            <td>जम्मा रकम:</td>
            <td>{total}</td>
          </tr>
          </tbody>
          </table>
    </section>
  );
};

export default VoucherAccount;
