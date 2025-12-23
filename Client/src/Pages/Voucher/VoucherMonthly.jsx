import React, { useState,useEffect } from "react";
import "./VoucherMonthly.scss";
import axiosInstance from "../../axiosInstance";
import { toast } from "react-toastify";
import PageHeaderComponent from "../../Components/PageHeaderComponent";
import { BsInfoCircleFill } from "react-icons/bs";
import { Circles } from "react-loader-spinner";
const VoucherMonthly = () => {
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const Url = import.meta.env.VITE_API_URL + "voucher/";
  const [mselected, setmselected] = useState([]);
  const [regi,setregi]=useState([]);
  const [summary,setsummary]=useState([{}]);
  const [isthaniye,setisthaniye]=useState();
  const [pardesh,setpardesh]=useState([]);
  const [mdata,setmdata]=useState([]); 
const [loading,setLoading]= useState(false);

  const loadmonth=async()=>{
    setLoading(true);
    const data = {     
      office_id: loggedUser.office_id,
      aaba_id: loggedUser.aabaid,      
    };
    console.log("getting monthlist",data)
    const response = await axiosInstance.post("getMonthlistByAaba",data)
    console.log(response.data);
    setmdata(response.data.data);
    setLoading(false);
  }

useEffect(() => {
  loadmonth();
  document.title = "MOMS | महिना अनुसारको विवरण";
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
    setLoading(true);
    console.log("data sent", data);
    const response = await axiosInstance.post("getVoucherMonthly",data)    
    console.log(response.data.data);    
    setregi(response.data.data.registration); 
    setsummary(response.data.data.summary);
    setisthaniye(response.data.data.isthaniye);
    setpardesh(response.data.data.pardesh);
    setLoading(false);
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
      {loading ?
              (
                <div className="fullscreen-loader">
                  <div className="loader">
                    <Circles height={150} width={150} color="#ffdd40" ariaLabel="loading" />
                    <h2 className="loader-text" >कृपया प्रतिक्षा गर्नुहोस् ।</h2>
                  </div>
                </div>
              ) : null
            }
      <div className="Vouchermonthly__monthlist">
        {mdata.map((item, i) => {
          return (
            <div className="Vouchermonthly__monthlist__item" key={i}>
              <h4>{item.mid}</h4>
              <input
                className="Vouchermonthly__monthlist__item__box"
                type="checkbox"
                name="month"
                value={item.mid}
                onClick={handleclick}
              />
              <h4>{item.mname}</h4>
            </div>
          );
        })}
        <div className="spacer">
          
        </div>
        <div className="Vouchermonthly__month__button no-print">
          <button onClick={genReport} className="Vouchermonthly__monthlist__button__button">
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
          <tr>
            <td>{regi[0] ? regi[0].acc_sirshak_name : null}</td>
            <td>{regi[0] ? Math.round(regi[0].amount,2): null}</td>
          </tr>
          <tr>
            <td>संचितकोषमा जाने</td>
            <td>{summary[0] ? Math.round(summary[0].sanchitkosh,2): null}</td>
          </tr>
          <tr><td colSpan={2}><hr className="line"/></td></tr>              
          <tr>
            <th>स्थानियमा जाने</th>
            <th>रकम</th>
          </tr>
          {isthaniye ? isthaniye.map((item,i)=>{
              return  <tr key={i}><td>{item.napa_name}</td><td>{Math.round(item.isthaniye)}</td></tr>                            
          }):null}
          <tr>
            <td>जम्मा स्थानियमा जाने</td>
            <td>{summary[0] ? Math.round(summary[0].isthaniye):0}</td>
          </tr>
          <tr><td colSpan={2}><hr className="line"/></td></tr>           
          <tr>
            <th>प्रदेशमा जाने</th> <th>रकम</th>      
          </tr>
          {pardesh ?
            pardesh.map((item,i)=>{
              return <tr key={i}>
                <td>{item.acc_sirshak_name}</td>
                <td>{Math.round(item.pardesh)}</td>
              </tr>           
              
            }) :null
          }
          <tr>
            <td>जम्मा प्रदेशमा जाने</td>
            <td>{summary[0] ? Math.round(summary[0].pardesh): 0}</td>
          </tr>
          <tr><td colSpan={2}><hr className="line"/></td></tr>
          <tr>
            <td>जम्मा बाँडफाँड हुने</td>
            <td>{summary[0] ? Math.round(parseInt(summary[0].pardesh)+parseInt(summary[0].isthaniye)+parseInt(summary[0].sanchitkosh)): 0}</td>
          </tr>
          <tr><td colSpan={2}><hr className="line"/></td></tr>           
          <tr>
            <td>संघमा जाने</td>
            <td>{summary[0] ? Math.round(summary[0].sangh):0}</td>
          </tr>
          <tr><td colSpan={2}><hr className="line"/></td></tr>      
          <tr>
            <td>कार्यालय जम्मा </td>
            <td>{summary[0] ? Math.round(summary[0].amount):0}</td>
          </tr>
          </tbody>
          </table>
    </section>
  );
};

export default VoucherMonthly;
