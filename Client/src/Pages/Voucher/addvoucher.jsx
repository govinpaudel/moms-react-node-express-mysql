import { convertToWords } from "../../Utils/Utils";
import Calendar from '@sbmdkl/nepali-datepicker-reactjs';
import '@sbmdkl/nepali-datepicker-reactjs/dist/index.css';
import "./Addvoucher.scss";
import { toast } from "react-toastify";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import PageHeaderComponent from "../../Components/PageHeaderComponent";
import { BsInfoCircleFill } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Addvoucher = () => {
  const initialdata = {
    id: 0,
    ndate: "",
    edate: "",
    fant_id: 0,
    staff_id: 0,
    sirshak_id: 0,
    napa_id: 0,
    voucherno: "",
    amount: "",
    deposited_by: "",
  };
  const [sirshaks, setsirshaks] = useState();
  const [fants, setfants] = useState();
  const [staffs, setstaffs] = useState();
  const [napas, setnapas] = useState();
  const [params, setparams] = useState();
  const [vdata, setVdata] = useState(initialdata);
  const Url = import.meta.env.VITE_API_URL + "voucher/";
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const navigate = useNavigate();
  const handleChange = (e) => {
    setVdata({ ...vdata, [e.target.name]: e.target.value });    
  };
  const handlesDate = ({ bsDate, adDate }) => {    
    vdata.ndate = bsDate;
    vdata.edate = adDate;
  };
  const getVoucherMaster = async () => {
    const response = await axios({
      method: "post",
      url: Url + "getVoucherMaster",
      data: {
        office_id: loggedUser.office_id,
      },
    });
    console.log(response.data.data);
    setsirshaks(response.data.data.sirshaks);
    setfants(response.data.data.fants);
    setnapas(response.data.data.napas);
    setstaffs(response.data.data.staffs);
    setparams(response.data.data.params);
  };

  const checkVoucher = (e) => {
    if(!loggedUser.isvoucherchecked){
      console.log("voucher not checked");
      return true;
    }
    else{
      console.log(e);
    console.log(params);
    let a = e.length;
    let b = e;
    let c = b.toString();
    let d = c.substring(0, 1);
    let f = d.toString() + a.toString();
    console.log(f);
    let status = params.find((temp) => temp.parm == f);
    if (status) {
      console.log("voucher ok");
      return true;
    } else {
      console.log("voucher not ok");
      return false;
    }
    }    
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    const myArray = vdata.ndate.split("-");
    vdata.office_id = loggedUser.office_id;
    vdata.aaba_id = loggedUser.aabaid;
    vdata.created_by_user_id = loggedUser.id;
    vdata.month_id = myArray[1];
    const vstatus = checkVoucher(vdata.voucherno);
    if (vdata.fant_id == 0) {
      toast.warning("कृपया फाँट चयन गर्नुहोस् ।");
      return;
    }   
    if (vdata.sirshak_id == 0) {
      toast.warning("कृपया शिर्षक चयन गर्नुहोस् ।");
      return;
    }
    if (vdata.sirshak_id == 2 && vdata.napa_id == 0) {
      toast.warning("कृपया रजिष्ट्रेशन शुल्क मा न.पा अनिवार्य चयन गर्नुहोस् ।");
      return;
    }
    if (!vstatus) {
      toast.warning("कृपया भौचर नं जाँच गर्नुहोस् ।");
      return;
    }
    const res = await axios({
      method: "post",
      url: Url + "addOrUpdateVoucher",
      data: vdata,
    });
    console.log(res.data);
    if (res.data.status == true) {
      toast.success(res.data.message);
      setVdata(initialdata);
      navigate("/home/listvoucher");
    } else {
      toast.warning(res.data.message);
    }
  };
  useEffect(() => {
    setVdata(initialdata);
    getVoucherMaster();
  }, []);

  return (
    <section id="Addvoucher" className="Addvoucher">
      <PageHeaderComponent
        headerText="भौचर दर्ता फाराम"
        icon={<BsInfoCircleFill size={40} />}
      />
      <div className="Addvoucher__calendardiv">
      <label className="Addvoucher__Form__part__item__label">मिति</label>
      <Calendar
              key={vdata.edate}
              onChange={handlesDate}
              theme="green"
              language="en"                            
              defaultDate={vdata.ndate}
              className="Addvoucher__Form__part__item__input calendar"
      />       
      </div>
      <form onSubmit={onSubmit} className="Addvoucher__Form">      
        <div className="Addvoucher__Form__part">           
          <div className="Addvoucher__Form__part__item">
          <label className="Addvoucher__Form__part__item__label">अंग्रेजी मिति</label>
            <input
              type="text"
              name="edate"
              className="Addvoucher__Form__part__item__input"
              value={vdata.edate}
              onChange={handleChange}
              readOnly              
            />
           
          </div>
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">फाँट</label>
            <select
              name="fant_id"
              className="Addvoucher__Form__part__item__input"
              value={vdata.fant_id}
              onChange={handleChange}
            >
              <option value="0">छान्नुहोस्</option>
              {fants
                ? fants.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.fant_name}
                    </option>
                  );
                })
                : null}
            </select>
          </div>
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">शिर्षक</label>
            <select
              name="sirshak_id"
              className="Addvoucher__Form__part__item__input"
              value={vdata.sirshak_id}
              onChange={handleChange}
            >
              <option value="0">छान्नुहोस्</option>
              {sirshaks
                ? sirshaks.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.sirshak_name}
                    </option>
                  );
                })
                : null}
            </select>
          </div>
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">न.पाः</label>
            <select
              name="napa_id"
              className="Addvoucher__Form__part__item__input"
              value={vdata.napa_id}
              onChange={handleChange}
            >
              {napas
                ? napas.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.napa_name}
                    </option>
                  );
                })
                : null}
            </select>
          </div>

        </div>
        {/* first row ends */}
        <div className="Addvoucher__Form__part">
        
        
        
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">जम्मा गर्ने व्यक्तिको नाम</label>
            <input
              type="text"
              className="Addvoucher__Form__part__item__input"
              name="deposited_by"
              required
              onChange={handleChange}
              value={vdata.deposited_by}
            />
          </div>
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">भौचर नं</label>
            <input
              type="text"
              name="voucherno"
              className="Addvoucher__Form__part__item__input"
              required
              value={vdata.voucherno}
              onChange={handleChange}
            />
          </div>

          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">रकम</label>
            <input
              type="number"
              name="amount"
              className="Addvoucher__Form__part__item__input"
              value={vdata.amount}
              onChange={handleChange}
              required
            />

          </div>
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">रकम अक्षरमा</label>
            <h6 className="Addvoucher__Form__part__item__input">{convertToWords(vdata.amount)}</h6>
          </div>
        </div>
        {/* second row ends */}
        <div className="Addvoucher__Form__part">          
          <div className="Addvoucher__Form__part__item">
            <input
              type="submit"
              className="Addvoucher__Form__part__item__button"
              value="सेभ गर्नुहोस्"
            />
          </div>
          <div className="Addvoucher__Form__part__item">
            <NavLink to={"/home/listvoucher"}>
              <input
                type="cancel"
                className="Addvoucher__Form__part__item__button"
                value="रद्द गर्नुहोस्"
              />
            </NavLink>
          </div>
        </div>
        {/* third row ends */}
      </form>

      {/* create voucher form ends */}
    </section>
  );
};

export default Addvoucher;
