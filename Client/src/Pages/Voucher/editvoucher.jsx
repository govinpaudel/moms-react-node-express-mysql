// import { convertToWords } from "../../Utils/Utils";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import "./addvoucher.scss";
import { toast } from "react-toastify";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
const EditVoucher = () => {
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
    remarks: "",
  };
  const [sirshaks, setsirshaks] = useState();
  const [fants, setfants] = useState();
  const [staffs, setstaffs] = useState();
  const [napas, setnapas] = useState();
  const [params, setparams] = useState();
  const [vdata, setVdata] = useState(initialdata);
  const Url = import.meta.env.VITE_API_URL + "voucher/";
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

  const handleChange = (e) => {
    setVdata({ ...vdata, [e.target.name]: e.target.value });
    console.log("data changed");
  };
  const handlesDate = ({ bsDate, adDate }) => {
    console.log("date is changed");
    vdata.ndate = bsDate;
    vdata.edate = adDate;
  };
  const loaddata = async ({ type }) => {
    const response = await axios({
      method: "post",
      url: Url + "getlist.php",
      data: {
        type: type,
        office_id: loggedUser.officeid,
      },
    });
    console.log(type, response);
    if (type == "getallsirshaks") {
      setsirshaks(response.data.data);
    } else if (type == "getfantbyoffices") {
      setfants(response.data.data);
    } else if (type == "getnapabyoffices") {
      setnapas(response.data.data);
    } else if (type == "getstaffbyoffices") {
      setstaffs(response.data.data);
    } else if (type == "getparameterbyoffices") {
      setparams(response.data.data);
    }
  };
  const loadeditdata = async () => {
    setVdata(initialdata);
    if (props.data > 0) {
      const data = {
        voucherid: props.data,
        type: "getdetailbyvoucherid",
      };
      console.log("data sent with voucherid", data);
      const response = await axios({
        method: "post",
        url: Url + "voucher.php",
        data: data,
      });
      console.log("data received with voucherid", response);
      setVdata(response.data.data[0]);
    }
  };

  const loadalldata = async () => {
    console.log("data loading started");
    await loaddata({ type: "getallsirshaks" });
    await loaddata({ type: "getfantbyoffices" });
    await loaddata({ type: "getnapabyoffices" });
    await loaddata({ type: "getstaffbyoffices" });
    await loaddata({ type: "getparameterbyoffices" });
    console.log("data loaded completed");
  };
  const checkVoucher = (e) => {
    console.log(e);
    let a = e.length;
    let b = e;
    let c = b.toString();
    let d = c.substring(0, 1);
    let f = d.toString() + a.toString();
    let status = params.find((temp) => temp.parm == f);
    if (status) {
      console.log("voucher ok");
      return true;
    } else {
      console.log("voucher not ok");
      return false;
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    const myArray = vdata.ndate.split("-");
    vdata.office_id = loggedUser.officeid;
    vdata.aaba_id = loggedUser.aabaid;
    vdata.created_by_user_id = loggedUser.id;
    vdata.type = "save";
    vdata.month_id = myArray[1];
    if (!vdata.oldvoucher) {
      vdata.oldvoucher = "off";
    }
    if (!vdata.id) {
      vdata.id = 0;
    }
    const vstatus = checkVoucher(vdata.voucherno);
    console.log("voucher status", vstatus);
    console.log(vdata);
    if (vdata.fant_id == 0) {
      toast.warning("कृपया फाँट चयन गर्नुहोस् ।");
      return;
    }
    if (vdata.staff_id == 0) {
      toast.warning("कृपया कर्मचारी चयन गर्नुहोस् ।");
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
      url: Url + "voucher.php",
      data: vdata,
    });
    console.log(res.data);
    if (res.data.status == true) {
      toast.success(res.data.message);
      setVdata(initialdata);
      props.Close();
    } else {
      toast.warning(res.data.message);
    }
  };
  useEffect(() => {
    setVdata(initialdata);
    loadalldata();
    loadeditdata();
  }, []);

  return (
    <>
      {/* create voucher form starts */}
      <h5 className="heading1 center">
        {props.data == 0 ? "भौचर दर्ता फारम" : "भौचर संशोधन फाराम"}
      </h5>
      <form onSubmit={onSubmit} className="entryForm">
        <div className="main-div flex">
          <div className="form-group">
            <label className="datelabel">मिति</label>
            <input
              type="hidden"
              name="id"
              value={vdata.id ? vdata.id : 0}
              onChange={handleChange}
            />
            <Calendar
              key={vdata.ndate}
              onChange={handlesDate}
              theme="green"
              language="en"
              className="input"
              defaultDate={vdata.ndate}
            />
          </div>
          <div className="form-group">
            <label className="datelabel">अंग्रेजी मिति</label>
            <input
              type="text"
              name="edate"
              className="input"
              value={vdata.edate}
              readOnly
            />
          </div>
          <div className="form-group">
            <label className="datelabel">फाँट</label>
            <select
              name="fant_id"
              className="input"
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
          <div className="form-group">
            <label className="datelabel">कर्मचारी</label>
            <select
              name="staff_id"
              className="input"
              value={vdata.staff_id}
              onChange={handleChange}
            >
              <option value="0">छान्नुहोस्</option>
              {staffs
                ? staffs.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.staff_name}
                      </option>
                    );
                  })
                : null}
            </select>
          </div>
        </div>
        <div className="main-div flex">
          <div className="form-group">
            <label className="datelabel">शिर्षक</label>
            <select
              name="sirshak_id"
              className="input"
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
          <div className="form-group">
            <label className="datelabel">न.पाः</label>
            <select
              name="napa_id"
              className="input"
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
          <div className="form-group">
            <label className="datelabel">भौचर नं</label>
            <input
              type="text"
              name="voucherno"
              className="input"
              required
              value={vdata.voucherno}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="datelabel">रकम</label>
            <input
              type="number"
              name="amount"
              className="input"
              value={vdata.amount}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <h6 className="amttowords center">{convertToWords(vdata.amount)}</h6>
        <div className="main-div flex">
          <div className="form-group">
            <label className="datelabel">जम्मा गर्ने व्यक्तिको नाम</label>
            <input
              type="text"
              className="input"
              name="remarks"
              required
              onChange={handleChange}
              value={vdata.remarks}
            />
          </div>
          <div className="form-group center">
            <input
              type="submit"
              className="button center small"
              value="सेभ गर्नुहोस्"
            />
          </div>
          <div className="form-group center">
            <div
              onClick={() => {
                props.Close();
              }}
              className="button center small"
            >
              <span>रद्द गर्नुहोस्</span>
            </div>
          </div>
        </div>
      </form>

      {/* create voucher form ends */}
    </>
  );
};

export default EditVoucher;
