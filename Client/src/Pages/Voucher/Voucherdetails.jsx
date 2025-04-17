import { BsInfoCircleFill } from "react-icons/bs";
import PageHeaderComponent from "../../Components/PageHeaderComponent";
import { useState,useEffect } from "react";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "./Voucherdetails.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Voucherdetails = () => {
  const navigate=useNavigate();
  const Url = import.meta.env.VITE_API_URL + "voucher/";
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
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
  const [repdata,setrepdata]=useState([]);
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
    document.title = "MOMS | भौचर अनुसारको विवरण";
  }, [])

const dototal =()=>{
    var x =0;
    repdata.forEach((a) => {      
      console.log(x);
      x=x+ parseInt(a.amount);
    })
    settotal(x);
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
      office_id:loggedUser.office_id
    };
    console.log("data sent", data);
    const response = await axios({
      method: "post",
      url: Url + "VoucherByDate",
      data: data,
    });
    console.log(response.data.data);
    setrepdata(response.data.data);
    
  };


  return <section id="Voucherdetails" className="Voucherdetails">
    <PageHeaderComponent
      officeText={`(${loggedUser.office_name})`}
      headerText="भौचर अुनसारको प्रतिवेदन"
      icon={<BsInfoCircleFill size={40} />}
    />
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
      </div>

    <div className="Voucherdetails__dateform">
      <div className="Voucherdetails__dateform__item">
        <label className="Voucherdetails__dateform__item__label">शुरु मिति</label>
        <Calendar
          key={sdata.nep_start_date}
          onChange={handleStartDate}
          theme="green"
          language="en"
          className="Addvoucher__Form__part__item__input"
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
          className="Addvoucher__Form__part__item__input"
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
              <th>क्र.सं</th>
              <th>बैंक दाखिला मिति</th>
              <th>कारोबार मिति</th>
              <th>शिर्षक</th>
              <th>गा.पा । न.पा</th>
              <th>फाँट</th>              
              <th>भौचर नं</th>
              <th>जम्मा गर्ने</th>
              <th>रकम</th>
              {/* <th colSpan={2} className="no-print">कृयाकलाप</th> */}
            </tr>
          </thead>
          <tbody>
            {repdata.length > 0 ? (
              repdata.map((data, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{data.ndate_voucher}</td>
                    <td>{data.ndate_transaction}</td>
                    <td>{data.sirshak_name}</td>
                    <td>{data.napa_name}</td>
                    <td>{data.fant_name}</td> 
                    <td onClick={() => navigate("/home/editvoucher",{state:{id:data.id}})}>{data.voucherno}</td>
                    <td>{data.deposited_by}</td>
                    <td>{data.amount}</td>
                    {/* <td>
                      <button
                        className="listvoucher__list__editbtn no-print"
                        onClick={() => navigate("/home/editvoucher",{state:{id:data.id}})}
                      >
                        संशोधन
                      </button>
                      <button className="listvoucher__list__delbtn no-print">हटाउनुहोस्</button>
                    </td> */}
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
            )}
            <tr><td colSpan={9}>जम्मा रकम : {total}</td></tr>
          </tbody>
        </table>
      </div>
      {/* list voucher ends */}



  </section>
}

export default Voucherdetails