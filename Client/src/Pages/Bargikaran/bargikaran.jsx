import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./bargikaran.scss";

const Bargikaran = () => {
  const Url = import.meta.env.VITE_API_URL + "bargikaran/";
  const [data, setData] = useState({
    type: "getalloffices",
    office_id: 0,
    napa_id: 0,
    gabisa_id: 0,
    ward_no: 0,
    kitta_no: 0,
  });
  const [offices, setOffices] = useState();
  const [napas, setNapas] = useState();
  const [gapas, setGapas] = useState();
  const [wards, setWards] = useState();
  const [details, setDetails] = useState();
  const handleSubmit = (e) => {
    e.preventDefault();
    loaddata();
  };
  const handleChange = (e) => {
    if (e.target.name == "office_id") {
      setData({
        ...data,
        [e.target.name]: e.target.value,
        type: "getnapabyoffices",
      });
    } else if (e.target.name == "napa_id") {
      setData({
        ...data,
        [e.target.name]: e.target.value,
        type: "getgapabyoffices",
      });
    } else if (e.target.name == "gabisa_id") {
      setData({
        ...data,
        [e.target.name]: e.target.value,
        type: "getwardbyoffices",
      });
    } else if (e.target.name == "ward_no") {
      setData({
        ...data,
        [e.target.name]: e.target.value,
        type: "getkittabyoffices",
      });
    } else if (e.target.name == "kitta_no") {
      if (data.office_id == 0) {
        toast.warning("कृपया कार्यालय छान्नुहोस्");
        return;
      } else if (data.napa_id == 0) {
        toast.warning("कृपया नगरपालिका छान्नुहोस्");
        return;
      } else if (data.gabisa_id == 0) {
        toast.warning("कृपया गाविस छान्नुहोस्");
        return;
      } else if (data.ward_no == 0) {
        toast.warning("कृपया वडा छान्नुहोस्");
        return;
      } else if (data.kitta == "") {
        return;
      } else {
        setData({
          ...data,
          [e.target.name]: e.target.value,
          type: "getdetails",
        });
      }
    }
  };
  useEffect(() => {
    loaddata();
  }, [data]);

  const loaddata = async () => {
    const response = await axios({
      method: "post",
      url: Url + "getlist.php",
      data: data,
    });
    console.log("sentData", data);
    console.log("receivedData", response.data);
    if (data.type == "getalloffices") {
      setOffices(response.data.data);
    } else if (data.type == "getnapabyoffices") {
      setNapas(response.data.data);
    } else if (data.type == "getgapabyoffices") {
      setGapas(response.data.data);
    } else if (data.type == "getwardbyoffices") {
      setWards(response.data.data);
    } else if (data.type == "getdetails") {
      setDetails(response.data.data);
    }
  };
  useEffect(() => {
    document.title = "वर्गिकरण खोजी";
  }, []);

  return (
    <section id="bargikaran" className="bargikaran">
      <div className="bargikaran__heading">
        <h5 className="bargikaran__heading__text">
          पालिकाले गरेको वर्गिकरण हेर्नुहोस् ।
        </h5>
      </div>
      <div className="bargikaran__form">
        <div className="bargikaran__form__form-item">
          <select
            name="office_id"
            className="bargikaran__form__form-item__input"
            onChange={handleChange}
          >
            <option>जिल्ला छान्नुहोस्</option>
            {offices
              ? offices.map((data) => {
                  return (
                    <option key={data.office_id} value={data.office_id}>
                      {data.office_name}
                    </option>
                  );
                })
              : null}
          </select>
        </div>
        <div className="bargikaran__form__form-item">
          <select
            name="napa_id"
            className="bargikaran__form__form-item__input"
            onChange={handleChange}
          >
            <option>नगरपालिका छान्नुहोस्</option>
            {napas
              ? napas.map((data) => {
                  return (
                    <option key={data.napa_id} value={data.napa_id}>
                      {data.napa_name}
                    </option>
                  );
                })
              : null}
          </select>
        </div>
        <div className="bargikaran__form__form-item">
          <select
            name="gabisa_id"
            className="bargikaran__form__form-item__input"
            onChange={handleChange}
          >
            <option>गा.वि.स छान्नुहोस्</option>
            {gapas
              ? gapas.map((data) => {
                  return (
                    <option key={data.gabisa_id} value={data.gabisa_id}>
                      {data.gabisa_name}
                    </option>
                  );
                })
              : null}
          </select>
        </div>
        <div className="bargikaran__form__form-item">
          <select
            name="ward_no"
            className="bargikaran__form__form-item__input"
            onChange={handleChange}
          >
            <option>वडा नं छान्नुहोस्</option>
            {wards
              ? wards.map((data) => {
                  return (
                    <option key={data.ward_no} value={data.ward_no}>
                      {data.ward_no}
                    </option>
                  );
                })
              : null}
          </select>
        </div>
        <div className="bargikaran__form__form-item">
          <input
            className="bargikaran__form__form-item__input"
            type="text"
            name="kitta_no"
            placeholder="कित्ता नं प्रविष्ट गर्नुहोस्"
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {details ? (
        details.length > 0 ? (
          details.map((data) => {
            return (
              <div className="bargikaran__result">
                <div className="bargikaran__result__item">
                  साविक गा.वि.सः -{data.gabisa_name} ।
                </div>
                <div className="bargikaran__result__item">
                  वडा नंः - {data.ward_no} ।
                </div>
                <div className="bargikaran__result__item">
                  सिट नंः - {data.sheet_no} ।
                </div>
                <div className="bargikaran__result__item">
                  कित्ता नंः - {data.kitta_no} ।
                </div>
                <div className="bargikaran__result__item">
                  वर्गिकरणः - {data.bargikaran} ।
                </div>
                <div className="bargikaran__result__item">
                  कैफियत - {data.remarks} ।
                </div>
              </div>
            );
          })
        ) : (
          <div className="bargikaran__result">
            <h5 className="bargikaran__result__item">
              कुनै पनि रेकर्ड फेला परेन ।
            </h5>
          </div>
        )
      ) : (
        <div className="bargikaran__result">
          <h5 className="bargikaran__result__item">
            कुनै पनि रेकर्ड फेला परेन ।
          </h5>
        </div>
      )}
    </section>
  );
};

export default Bargikaran;
