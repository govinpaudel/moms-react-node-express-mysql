import React, { useState, useEffect } from "react";
import "./VoucherFant.scss";
import axiosInstance from "../../axiosInstance";
import { toast } from "react-toastify";
import PageHeaderComponent from "../../Components/PageHeaderComponent";
import { BsInfoCircleFill } from "react-icons/bs";
import { Circles } from "react-loader-spinner";
const VoucherFant = () => {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const Url = import.meta.env.VITE_API_URL;
  const [mselected, setmselected] = useState([]);
  const [fselected, setfselected] = useState([]);
  const [uselected, setuselected] = useState([]);
  const [summary, setsummary] = useState([{}]);
  const [mdata, setmdata] = useState(0);
  const [fdata, setfdata] = useState(0);
  const [udata, setudata] = useState(0);
  const [total, settotal] = useState(0);
  const [loading,setLoading]= useState(false);

  const loadmonths = async () => {
    setLoading(true);
    const data = {
      office_id: loggedUser.office_id,
      aaba_id: loggedUser.aabaid      
    };
    console.log("getting monthlist", data)
    const response = await axiosInstance.post("/MonthlistByAaba",data)
    console.log(response.data);
    setmdata(response.data.months);
    setLoading(false);
  }
  const loadfants = async () => {
    setLoading(true);
    setfdata([]);
    setudata([]);
    if(mselected.length>0){   
    const data = {
      office_id: loggedUser.office_id,
      aaba_id: loggedUser.aabaid,
      month_id: mselected
    };
    console.log("getting fantlist", data)
    const response = await axiosInstance.post("/FantlistByAabaMonth",data)    
    console.log(response.data);
    setfdata(response.data.fants);
   
  }
 setLoading(false);
  }

  const loadusers = async () => {
    setLoading(true);
    setudata([]);
    if(fselected.length>0 || fselected.length>0){ 
    const data = {
      office_id: loggedUser.office_id,
      aaba_id: loggedUser.aabaid,
      month_id: mselected,
      fant_id:fselected
    };
    console.log("getting userlist", data)
    const response = await axiosInstance.post("/UserlistByAabaMonthFant",data)   
    console.log(response.data);
    setudata(response.data.users);
    
  }
  setLoading(false);
  }

  useEffect(() => {
    loadmonths();    
    document.title = "MOMS | फाँट अनुसारको विवरण";
  }, []) 


  const genReport = async () => {
   
    setsummary([{}]);
    if (mselected.length == 0) {
      toast.warning("कृपया महिना छनौट गर्नुहोस् ।");
      return;

    }
    if (fselected.length == 0) {
      toast.warning("कृपया फाँट छनौट गर्नुहोस् ।");
      return;
    }
    if (uselected.length == 0) {
      toast.warning("कृपया प्रयोगकर्ता छनौट गर्नुहोस् ।");
      return
    }
    const data = {
      office_id: loggedUser.office_id,
      aaba_id: loggedUser.aabaid,
      month_id: mselected,
      fant_id: fselected,
      user_id:uselected
    };    
    console.log("data sent", data);
    setLoading(true);
    const response = await axiosInstance.post("/VoucherFant",data)
    console.log(response.data.data);
    setsummary(response.data.data);    
    setLoading(false);
  };

  const dototal =()=>{
    var x =0;
    summary.forEach((a) => {      
      console.log(x);
      x=x+ parseInt(a.amount);
    })
    settotal(x);
  }

  useEffect(() => {    
  dototal();   
  }, [summary])
  

  function handlemonth(e) {
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
    loadfants();
    loadusers();
  }
  
  function handlefant(e) {
    const x = fselected;
    if (e.target.checked) {
      x.push(e.target.value);
      setfselected(x);
    } else {
      const index = fselected.indexOf(e.target.value);
      x.splice(index, 1);
      setfselected(x);
    }
    console.log("Fant", fselected);
    loadusers();
  }
   function handleuser(e) {
    const x = uselected;
    if (e.target.checked) {
      x.push(e.target.value);
      setuselected(x);
    } else {
      const index = uselected.indexOf(e.target.value);
      x.splice(index, 1);
      setuselected(x);
    }
  }



  return (
    <section id="Voucherfant" className="Voucherfant">
       <PageHeaderComponent
       officeText={`(${loggedUser.office_name})`}
        headerText="को फाँट र प्रयोगकर्ता अनुसारको प्रतिवेदन"
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
      <div className="Voucherfant__month">        
        {mdata ? mdata.map((item, i) => {
          return (
            <div className="Voucherfant__month__item" key={i}>
              <h4>{item.mid}</h4>
              <input
                className="Voucherfant__month__item__box"
                type="checkbox"
                name="month"
                value={item.mid}
                onClick={handlemonth}
              />
              <h4>{item.mname}</h4>
            </div>
          );
        }) : null}
      
      </div>
      <div className="Voucherfant__month">
        {fdata ? fdata.map((item, i) => {
          return (
            <div className="Voucherfant__month__item" key={i}>
              <input
                className="Voucherfant__month__item__box"
                type="checkbox"
                name="fant"
                value={item.fid}
                onClick={handlefant}
              />
              <h4>{item.fname}</h4>
            </div>
          );
        }) : null}
        
      </div>
      <div className="Voucherfant__month">
        
        {udata ? udata.map((item, i) => {
          return (
            <div className="Voucherfant__month__item" key={i}>
              <input
                className="Voucherfant__month__item__box"
                type="checkbox"
                name="user"
                value={item.uid}
                onClick={handleuser}
              />
              <h4>{item.uname}</h4>
            </div>
          );
        }) : null}
        <div className="spacer">
          
        </div>
        <div className="Voucherfant__month__button no-print">
          <button onClick={genReport} className="Voucherfant__month__button__button">
            रीपोर्ट हेर्नुहोस्
          </button>
        </div>
      </div>
      <table className="listvoucher__list__table">
        <thead>
          <tr>
          <th>महिना</th>
          <th>फाँट</th>
            <th>कारोबार शिर्षक</th>
            <th>लेखा शिर्षक</th>
            <th>रकम</th>
          </tr>
        </thead>
        <tbody>
          {summary ? summary.map((item, i) => {
            return <tr key={i}>
              <td>{item.month_name}</td>
              <td>{item.fant_name}</td>
            <td>{item.sirshak_name}</td>
            <td>{item.acc_sirshak_name}</td>
            <td>{Math.round(item.amount)}</td></tr>
          }) : null}
          <tr><td>जम्मा</td>
          <td></td>
          <td></td>
          <td></td>
          <td>{total}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default VoucherFant;
