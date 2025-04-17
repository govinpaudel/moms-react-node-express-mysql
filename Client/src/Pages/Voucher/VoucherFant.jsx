import React, { useState, useEffect } from "react";
import "./VoucherFant.scss";
import axios from "axios";
import { toast } from "react-toastify";
import PageHeaderComponent from "../../Components/PageHeaderComponent";
import { BsInfoCircleFill } from "react-icons/bs";
const VoucherFant = () => {
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const Url = import.meta.env.VITE_API_URL + "voucher/";
  const [mselected, setmselected] = useState([]);
  const [fselected, setfselected] = useState([]);
  const [summary, setsummary] = useState([{}]);
  const [mdata, setmdata] = useState(0);
  const [fdata, setfdata] = useState(0);
  const [total, settotal] = useState(0);
  const loadmonths = async () => {
    const data = {
      office_id: loggedUser.office_id,
      aaba_id: loggedUser.aabaid,
      month_id: mselected,
      fant_id: fselected,
    };
    console.log("getting monthlist", data)
    const response = await axios({
      method: "post",
      url: Url + "Monthlist",
      data: data,
    });
    console.log(response.data);
    setmdata(response.data.months);
  }
  const loadfants = async () => {
    const data = {
      office_id: loggedUser.office_id,
      aaba_id: loggedUser.aabaid,
    };
    console.log("getting fantlist", data)
    const response = await axios({
      method: "post",
      url: Url + "Fantlist",
      data: data,
    });
    console.log(response.data);
    setfdata(response.data.fants);
  }

  useEffect(() => {
    loadmonths();
    loadfants();
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
      return
    }
    const data = {
      office_id: loggedUser.office_id,
      aaba_id: loggedUser.aabaid,
      month_id: mselected,
      fant_id: fselected
    };
    console.log("data sent", data);
    const response = await axios({
      method: "post",
      url: Url + "VoucherFant",
      data: data,
    });
    console.log(response.data.data);
    setsummary(response.data.data);
    
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
  }

  return (
    <section id="Vouchermonthly" className="Vouchermonthly">
       <PageHeaderComponent
       officeText={`(${loggedUser.office_name})`}
        headerText="को फाँट अनुसारको प्रतिवेदन"
        icon={<BsInfoCircleFill size={40} />}
      />
      <div className="Vouchermonthly__month">
        {mdata ? mdata.map((item, i) => {
          return (
            <div className="Vouchermonthly__month__item" key={i}>
              <h4>{item.mid}</h4>
              <input
                className="Vouchermonthly__month__item__box"
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
      <div className="Vouchermonthly__month">
        {fdata ? fdata.map((item, i) => {
          return (
            <div className="Vouchermonthly__month__item" key={i}>
              <input
                className="Vouchermonthly__month__item__box"
                type="checkbox"
                name="fant"
                value={item.fid}
                onClick={handlefant}
              />
              <h4>{item.fname}</h4>
            </div>
          );
        }) : null}
        <div className="Vouchermonthly__month__button no-print">
          <button onClick={genReport} className="Vouchermonthly__month__button__button">
            रीपोर्ट हेर्नुहोस्
          </button>
        </div>
      </div>
      <table className="Vouchermonthly__table">
        <thead>
          <tr>
          <th>महिना</th>
          <th>फाँट</th>
            <th>शिर्षक</th>
            <th>रकम</th>
          </tr>
        </thead>
        <tbody>
          {summary ? summary.map((item, i) => {
            return <tr key={i}>
              <td>{item.month_name}</td>
              <td>{item.fant_name}</td>
            <td>{item.sirshak_name}</td>
            <td>{Math.round(item.amount)}</td></tr>
          }) : null}
          <tr><td>जम्मा</td>
          <td></td>
          <td></td>
            <td>{total}</td></tr>
        </tbody>
      </table>
    </section>
  );
};

export default VoucherFant;
