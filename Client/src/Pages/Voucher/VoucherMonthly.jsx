import React, { useState,useEffect } from "react";
import "./VoucherMonthly.scss";
import axios from "axios";
const VoucherMonthly = () => {
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const Url = import.meta.env.VITE_API_URL + "voucher/";
  const [mselected, setmselected] = useState(0);
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
    if(mselected==0){
      return;
    }
    const data = {     
      office_id: loggedUser.office_id,
      aaba_id: loggedUser.aabaid,
      monthid: mselected,
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
    if (e.target.checked) {      
      setmselected(e.target.value);     
      console.log("new value", mselected); 
    } else {      
      setmselected(0);
    }
    
  }
  return (
    <section id="Vouchermonthly" className="Vouchermonthly">
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
      <table className="reporttable">
        <thead>
          <tr>
            <th>शिर्षक</th> 
            <th>रकम</th>            
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{ regi[0].sirshak_name}</td>
            <td>{regi[0].amount}</td>
          </tr>
          <tr>
            <td>संचितकोषमा जाने</td>
            <td>{summary[0].sanchitkosh}</td>
          </tr>
          <tr>
            <th colSpan={2}>स्थानियमा जाने</th>
          </tr>
          {isthaniye ? isthaniye.map((item,i)=>{
              return <tr key={i}><td>{item.napa_name}</td><td>{item.isthaniye}</td></tr>
          }):null}

          <tr>
            <td>स्थानियमा जाने</td>
            <td>{summary[0].isthaniye}</td>
          </tr>
          <tr>
            <td colSpan={2}>प्रदेशमा जाने</td>            
          </tr>
          {
            pardesh.map((item,i)=>{
              return <tr key={i}>
                <td>{item.sirshak_name}</td>
                <td>{item.pardesh}</td>
              </tr>
            })
          }
          <tr>
            <td>जम्मा प्रदेशमा जाने</td>
            <td>{summary[0].pardesh}</td>
          </tr>          
          <tr>
            <td>संघमा जाने</td>
            <td>{summary[0].sangh}</td>
          </tr>
        </tbody>
      </table>     
    </section>
  );
};

export default VoucherMonthly;
