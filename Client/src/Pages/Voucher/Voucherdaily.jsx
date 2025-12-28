import { BsInfoCircleFill } from "react-icons/bs";
import PageHeaderComponent from "../../Components/PageHeaderComponent";
import { useState,useEffect } from "react";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "./Voucherdaily.scss";
import axiosInstance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";

const Voucherdaily = () => {
  const navigate=useNavigate();
  const Url = import.meta.env.VITE_API_URL;
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const initialdata = {
    nep_start_date: "",
    nep_end_date: "",
    eng_start_date: "",
    eng_end_date: "",
    fant_id: 0
  };
  const [sdata, setSdata] = useState(initialdata);
  const [fselected, setfselected] = useState([]);
  const [fdata, setfdata] = useState(0);
  const [total, settotal] = useState(0);
  const [repdata,setrepdata]=useState([{}]);
  const loadfants = async () => {
    const data = {
      office_id: loggedUser.office_id,
      aaba_id: loggedUser.aabaid,
    };
    console.log(Url);
    console.log("getting fantlist", data)
    
    const response = await axiosInstance.post("/Fantlist",data)    
    console.log(response.data);
    setfdata(response.data.fants);
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
  useEffect(() => {    
    loadfants();
    document.title = "MOMS | दिन अनुसारको विवरण";
  }, [])

const dototal =()=>{
    var x =0;
    if(repdata){
    repdata.forEach((a) => {      
        x=x+ parseInt(a.amount);         
    })
    settotal(x);
  }
  }
  useEffect(() => {    
  dototal();   
  }, [repdata])


  const handleStartDate = ({ bsDate, adDate }) => {
    sdata.nep_start_date = bsDate;
    sdata.eng_start_date = adDate;
  };

  const handleEndDate = ({ bsDate, adDate }) => {
    sdata.nep_end_date = bsDate;
    sdata.eng_end_date = adDate;
  };

  const genReport = async () => {   
    const data = {      
      start_date:sdata.eng_start_date,
      end_date:sdata.eng_end_date,
      fant_id: fselected,
      office_id:loggedUser.office_id,
      aaba_id:loggedUser.aabaid
    };
    console.log("data sent", data);
    const response = await axiosInstance.post("/VoucherSumByDate",data)    
    console.log(response.data.data);
    setrepdata(response.data.data);    
  };


  return <section id="Voucherdetails" className="Voucherdetails">
    <PageHeaderComponent
      officeText={`(${loggedUser.office_name})`}
      headerText="दैनिक भौचर प्रतिवेदन"
      icon={<BsInfoCircleFill size={40} />}
    />
<div className="Voucherdetails__fant">
        {fdata ? fdata.map((item, i) => {
          return (
            <div className="Voucherdetails__fant__item" key={i}>
              <input
                className="Voucherdetails__fant__item__box"
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

    <div className="Voucherdetails__dateform">
      <div className="Voucherdetails__dateform__item">
        <label className="Voucherdetails__dateform__item__label">शुरु मिति</label>
        <Calendar
          key={sdata.nep_start_date}
          onChange={handleStartDate}
          theme="green"
          language="en"
          className="Addvoucher__Form__part__item__input wide"
          defaultDate={sdata.nep_start_date}
        />
      </div>
      <div className="Voucherdetails__dateform__item">
      <label className="Voucherdetails__dateform__item__label">अन्तिम मिति</label>
      <Calendar
          key={sdata.nep_end_date}
          onChange={handleEndDate}
          theme="green"
          language="en"
          className="Addvoucher__Form__part__item__input wide"
          defaultDate={sdata.nep_end_date}
        />
      </div>
      <div className="Voucherdetails__dateform__item">     
          <button onClick={genReport}  className="Vouchermonthly__month__button__button">
            रीपोर्ट हेर्नुहोस्
          </button>
        </div>
    </div>
      {/* List voucher starts */}
      <div className="listvoucher__list">
        <table className="listvoucher__list__table">
          <thead>
            <tr>  
              <th>कारोबार शिर्षक</th>
              <th>रकम</th>              
            </tr>
          </thead>
          <tbody>
            {repdata ? repdata.length > 0 ? (
              repdata.map((data, i) => {
                return (
                  <tr key={i}>                     
                    <td>{data.sirshak_name}</td>                    
                    <td>{data.amount}</td>                   
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10}>
                  <h1 className="heading center">
                    कुनै पनि भौचर दर्ता भएको छैन ।
                  </h1>
                </td>
              </tr>
            ):null}
            <tr><td colSpan={9}>जम्मा रकम : {total}</td></tr>
          </tbody>
        </table>
      </div>
      {/* list voucher ends */}



  </section>
}

export default Voucherdaily;