import React, { useState } from "react";
import { useEffect } from "react";
import axiosInstance from "../../axiosInstance"
import { toast } from "react-toastify";
import "./bargikaran.scss";

const Bargikaran = () => {
  const Url = import.meta.env.VITE_API_URL + "bargikaran/";
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const [data, setData] = useState({
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

  const loadoffices = async () => {
    const url = "bargikaran/" + "getAllOffices/" + loggedUser.office_id
    const response = await axiosInstance.get(url)
    console.log("officelist", response.data);
    setOffices(response.data.data);
  }

  const loadnapas = async () => {
    if (data.office_id > 0) {
      const url = "bargikaran/" + "getNapasByOfficeId/" + data.office_id
      const response = await axiosInstance.get(url);
      console.log("napalist", response.data);
      setNapas(response.data.data);
    }
  }

  const loadgapas = async () => {
    if (data.office_id > 0 && data.napa_id > 0) {
      const url = "bargikaran/" + "getGabisasByOfficeId/" + data.office_id + "/" + data.napa_id
      const response = await axiosInstance.get(url)
      console.log("gapalist", response.data);
      setGapas(response.data.data);
    }
  }

  const loadwards = async (e) => {
    console.log(data);
    if (data.office_id > 0 && data.napa_id > 0 && data.gabisa_id > 0) {
      const url = "bargikaran/" + "getWardsByGabisaId/" + data.office_id + "/" + data.napa_id + "/" + data.gabisa_id
      const response = await axiosInstance.get(url)
      console.log("wardlist", response.data);
      setWards(response.data.data);
    }
  }

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };
  useEffect(() => {
    document.title = "MOMS | वर्गिकरण खोजि";
    loadoffices();
  }, []);
  useEffect(() => {
    if (data.office_id > 0) {
      loadnapas();
    }
  }, [data.office_id])

  useEffect(() => {
    if (data.napa_id > 0) {
      loadgapas();
    }
  }, [data.napa_id])

  useEffect(() => {
    if (data.gabisa_id > 0) {
      loadwards();
    }
  }, [data.gabisa_id])

  useEffect(() => {
    let timer = setTimeout(() => {
      if (data.office_id > 0 && data.napa_id > 0 && data.gabisa_id > 0 && data.kitta_no > 0) {
        loaddata();
      }


    }, 1000);
    return () => clearTimeout(timer)
  }, [data.kitta_no])

  const loaddata = async () => {
    setDetails([]);
    if (data.office_id == 0) {
      toast.warning("कृपया कार्यालय छान्नुहोस् ।");
      return;
    }
    if (data.napa_id == 0) {
      toast.warning("कृपया नगरपालिका छान्नुहोस् ।");
      return;
    }
    if (data.gabisa_id == 0) {
      toast.warning("कृपया गा.वि.स. छान्नुहोस् ।");
      return;
    }
    if (data.ward_no == 0) {
      toast.warning("कृपया वडा छान्नुहोस् ।");
      return;
    }
    if (data.kitta_no.trim().length == 0) {
      return;
    }
    const response = await axiosInstance.post("bargikaran/getKittaDetails", data)
    console.log("sentData", data);
    console.log("receivedData", response.data);
    setDetails(response.data.data);
  };
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
            onChange={handleChange}>
            <option>कार्यालय छान्नुहोस्</option>
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
          details.map((data, i) => {
            return (
              <div key={i} className="bargikaran__result">
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
