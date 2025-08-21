import { convertToWords } from '../../Utils/convertToWords';
import Calendar from '@sbmdkl/nepali-datepicker-reactjs';
import '@sbmdkl/nepali-datepicker-reactjs/dist/index.css';
import "./Addvoucher.scss";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import axiosInstance from '../../axiosInstance';
import PageHeaderComponent from "../../Components/PageHeaderComponent";
import { BsInfoCircleFill } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { adToBs, bsToAd } from '@sbmdkl/nepali-date-converter';
const Addvoucher = () => {
  const edate = new Date().toISOString().slice(0, 10);
  console.log("आजको अंग्रेजी मिति", edate);
  const ndate = adToBs(edate);
  console.log("आजको नेपाली मिति", ndate);
  const initialdata = {
    id: 0,
    ndate_voucher: ndate,
    edate_voucher: edate,
    ndate_transaction: ndate,
    edate_transaction: edate,
    fant_id: 0,
    sirshak_id: 0,
    napa_id: 0,
    voucherno: "",
    amount: 0,
    deposited_by: "",
  };
  const fant_idref = useRef()
  const sirshak_idref = useRef()
  const napa_idref = useRef()
  const vouchernoref = useRef()
  const [sirshaks, setsirshaks] = useState();
  const [fants, setfants] = useState();
  const [napas, setnapas] = useState();
  const [params, setparams] = useState();
  const [vdata, setVdata] = useState(initialdata);
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const navigate = useNavigate();
  const handleChange = (e) => {
    setVdata({ ...vdata, [e.target.name]: e.target.value });
  };
  const handlesVoucherDate = ({ bsDate, adDate }) => {
    vdata.ndate_voucher = bsDate;
    vdata.edate_voucher = adDate;
  };
  const handlesTransactionDate = ({ bsDate, adDate }) => {
    vdata.ndate_transaction = bsDate;
    vdata.edate_transaction = adDate;
  };
  const getVoucherMaster = async () => {
    const data = {
      office_id: loggedUser.office_id,
    }
    const response = await axiosInstance.post("/voucher/getVoucherMaster", data)
    console.log(response.data.data);
    setsirshaks(response.data.data.sirshaks);
    setfants(response.data.data.fants);
    setnapas(response.data.data.napas);
    setparams(response.data.data.params);
  };

  const checkVoucher = (e) => {
    if (!loggedUser.isvoucherchecked) {
      console.log("voucher not checked");
      return true;
    }
    else {
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
    console.log(vdata);
    const myArray = vdata.ndate_transaction.split("-");
    vdata.office_id = loggedUser.office_id;
    vdata.aaba_id = loggedUser.aabaid;
    vdata.created_by_user_id = loggedUser.id;
    vdata.month_id = myArray[1];
    const vstatus = checkVoucher(vdata.voucherno);
    if (vdata.fant_id == 0) {
      fant_idref.current.focus()
      fant_idref.current.style.color = "blue";
      toast.warning("कृपया फाँट चयन गर्नुहोस् ।");
      return;
    }
    if (vdata.sirshak_id == 0) {
      sirshak_idref.current.focus()
      sirshak_idref.current.style.color = "blue";
      toast.warning("कृपया शिर्षक चयन गर्नुहोस् ।");
      return;
    }
    if (vdata.sirshak_id == 2 && vdata.napa_id == 0) {
      napa_idref.current.focus()
      napa_idref.current.style.color = "blue";
      toast.warning("कृपया रजिष्ट्रेशन शुल्क मा न.पा अनिवार्य चयन गर्नुहोस् ।");
      return;
    }
    if (!vstatus) {
      vouchernoref.current.focus()
      vouchernoref.current.style.color = "blue";
      toast.warning("कृपया भौचर नं जाँच गर्नुहोस् ।");
      return;
    }
    const res= await axiosInstance.post("voucher/addOrUpdateVoucher",vdata);    
    console.log(res.data);
    if (res.data.status == true) {
      toast.success(res.data.message);
      setVdata(initialdata);
      navigate("/voucher/listvoucher");
    } else {
      toast.warning(res.data.message);
    }
  };
  useEffect(() => {
    setVdata(initialdata);
    getVoucherMaster();
    document.title = "MOMS | भौचर दर्ता फाराम";
  }, []);

  return (
    <section id="Addvoucher" className="Addvoucher">
      <PageHeaderComponent
        headerText="भौचर दर्ता फाराम"
        icon={<BsInfoCircleFill size={40} />}
      />
      <label className="Addvoucher__Form__part__item__label msglabel">कृपया बैंक भौचर प्रविष्ट गर्दा LRIMS मा गरेको कारोबारको आधारमा दर्ता गर्नु होला ।
        जस्तै लिखत पारित, धितो रोक्का, ठाडो रोक्का, प्रतिलिपि, नामसारी , संशोधन आदि </label>
      {loggedUser.usenepcalendar ?
        <div className="Addvoucher__calendardiv">
          <div className="Addvoucher__calendardiv__datediv">
            <label className="Addvoucher__Form__part__item__label">बैंक दाखिला मिति : </label>
            <Calendar
              key={vdata.edate_voucher}
              onChange={handlesVoucherDate}
              theme="green"
              language="en"
              defaultDate={vdata.ndate_voucher}
              className="Addvoucher__Form__part__item__input calendar"
              maxDate={ndate}
            />
          </div>
          <div className="Addvoucher__calendardiv__datediv">
            <label className="Addvoucher__Form__part__item__label">कार्यालयमा कारोबार मिति :</label>
            <Calendar
              key={vdata.edate_transaction}
              onChange={handlesTransactionDate}
              theme="green"
              language="en"
              defaultDate={vdata.ndate_transaction}
              className="Addvoucher__Form__part__item__input calendar"
              maxDate={ndate}
            />
          </div>

        </div>
        :
        <div className="Addvoucher__calendardiv">
          <div className="Addvoucher__calendardiv__datediv">
            <label className="Addvoucher__Form__part__item__label">बैंक दाखिला मिति :</label>
            <input type="date" max={edate} onChange={handleChange} name="edate_voucher" value={vdata.edate_voucher} className="Addvoucher__Form__part__item__input calendar" />
          </div>
          <div className="Addvoucher__calendardiv__datediv">
            <label className="Addvoucher__Form__part__item__label">कार्यालयमा कारोबार मिति :</label>
            <input type="date" max={edate} onChange={handleChange} name="edate_transaction" value={vdata.edate_transaction} className="Addvoucher__Form__part__item__input calendar" />
          </div>
        </div>
      }

      <form onSubmit={onSubmit} className="Addvoucher__Form">
        <div className="Addvoucher__Form__part">
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">फाँट</label>
            <select ref={fant_idref}
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
            <select ref={sirshak_idref}
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
              ref={napa_idref}
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
              ref={vouchernoref}
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

        </div>
        {/* second row ends */}
        <div className="Addvoucher__Form__part">
          <div className="Addvoucher__Form__part__item">
            <label className="Addvoucher__Form__part__item__label">रकम अक्षरमा</label>
            <h6 className="Addvoucher__Form__part__item__input">{convertToWords(vdata.amount)}</h6>
          </div>
          <div className="Addvoucher__Form__part__item">
            <input
              type="submit"
              className="Addvoucher__Form__part__item__button"
              value="सेभ गर्नुहोस्"
            />
          </div>
          <div className="Addvoucher__Form__part__item">
            <NavLink to={"/voucher/listvoucher"}>
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
