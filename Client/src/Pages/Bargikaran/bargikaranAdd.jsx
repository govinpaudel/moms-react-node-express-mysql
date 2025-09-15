import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "./bargikaranAdd.scss";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance"
import { useParams } from "react-router-dom";
const BargikaranAdd = () => {
  const { id } = useParams();
  const navigate = useNavigate();  
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const initialdata = {
    id:id,
    office_id: loggedUser.office_id,
    napa_id: 0,
    gabisa_id: 0,
    ward_no: 0,
    kitta_no: '',
    bargikaran: '',
    remarks: '',
    user_id: loggedUser.id
  }
  const [data, setData] = useState(initialdata);
  const [offices, setOffices] = useState();
  const [napas, setNapas] = useState();
  const [gapas, setGapas] = useState();
  const [wards, setWards] = useState();
  const checkRole = () => {
    console.log("role", loggedUser)
    if (loggedUser.role == 2) {
      toast.warning("एडमिन प्रयोगकर्तालाई मात्र यो अख्तियारी उपलब्ध छ ।")
      navigate('/bargikaran')
    }
  }
  
  const loadEditData= async(id)=>{
    console.log("utabata aayeko",id)
    if(id>0){
      const url="bargikaran/" + "getKittaDetailsForEdit/" + id  
      const response=await axiosInstance.get(url) 
      console.log("response aayeko",response)
      setData(response.data.data[0]);
    }
  }


  const loadoffices = async () => {
    const url="bargikaran/" + "getAllOffices/" + loggedUser.office_id    
    const response=await axiosInstance.get(url)     
    console.log("officelist", response.data);
    setOffices(response.data.data);
  }
  const loadnapas = async () => {
    if (data.office_id > 0) {
      const url="bargikaran/" + "getNapasByOfficeId/" + data.office_id
      const response = await axiosInstance.get(url);
      console.log("napalist", response.data);
      setNapas(response.data.data);
    }
  }
  const loadgapas = async () => {
    if (data.office_id > 0 && data.napa_id > 0) {
      const url="bargikaran/" + "getGabisasByOfficeId/" + data.office_id + "/" + data.napa_id
      const response =await axiosInstance.get(url)      
      console.log("gapalist", response.data);
      setGapas(response.data.data);
    }
  }
  const loadwards = async (e) => {
    if (data.office_id > 0 && data.napa_id > 0 && data.gabisa_id > 0) {
      const url="bargikaran/" + "getWardsByGabisaId/" + data.office_id + "/" + data.napa_id + "/" + data.gabisa_id
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
    document.title = "MOMS | वर्गिकरण थप गर्नुहोस्";
    checkRole();
    loadoffices();
    loadEditData(id);
  }, []);

  useEffect(() => {
    loadnapas();
  }, [data.office_id])

  useEffect(() => {
    loadgapas();
  }, [data.napa_id])
  useEffect(() => {
    loadwards();
  }, [data.gabisa_id])

  async function processRequests(items) {
    console.log(items);
    for (const item of items) {
      data.kitta_no = item;
      data.user_id= loggedUser.id;
      console.log("datasent", data);
      const url="bargikaran/" + "savebargikaran";
      const response = await axiosInstance.post(url,data)
      console.log(response);
      if (response.data.status == true) {
        toast.success(response.data.message);
        navigate('/bargikaran/search')
      }
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
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
    if (data.kitta_no.toString().trim().length == 0) {
      return;
    }
    let text = data.kitta_no.toString();
    const myArray = text.split(",");
    processRequests(myArray);
    setData(initialdata);
  };
  return (
    <section id="bargikaran" className="bargikaranadd">
      <div className="bargikaranadd__heading">
        <h5 className="bargikaranadd__heading__text">
          वर्गिकरण थप गर्नुहोस्
        </h5>
      </div>
      <form className="bargikaranadd__form" onSubmit={handleSubmit}>
        <div className="bargikaranadd__form__form-item">
          <select
            name="office_id"
            className="bargikaranadd__form__form-item__input"
            onChange={handleChange}
            value={data.office_id}
          >
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
        <div className="bargikaranadd__form__form-item">
          <select
            name="napa_id"
            className="bargikaranadd__form__form-item__input"
            onChange={handleChange}
            value={data.napa_id}
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
        <div className="bargikaranadd__form__form-item">
          <select
            name="gabisa_id"
            className="bargikaranadd__form__form-item__input"
            onChange={handleChange}
            value={data.gabisa_id}
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
        <div className="bargikaranadd__form__form-item">
          <select
            name="ward_no"
            className="bargikaranadd__form__form-item__input"
            onChange={handleChange}
            value={data.ward_no}
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
        <div className="bargikaranadd__form__form-item">
          <input
            className="bargikaranadd__form__form-item__input"
            type="text"
            name="kitta_no"
            placeholder="कित्ता नं प्रविष्ट गर्नुहोस्"
            onChange={handleChange}
            required
            value={data.kitta_no}
          />
        </div>
        <div className="bargikaranadd__form__form-item">
          <input
            className="bargikaranadd__form__form-item__input"
            type="text"
            name="bargikaran"
            placeholder="वर्गिकरण प्रविष्ट गर्नुहोस्"
            onChange={handleChange}
            required
            value={data.bargikaran}
          />
        </div>
        <div className="bargikaranadd__form__form-item">
          <input
            className="bargikaranadd__form__form-item__input"
            type="text"
            name="remarks"
            placeholder="कैफियत प्रविष्ट गर्नुहोस्"
            onChange={handleChange}
            required
            value={data.remarks}
          />
        </div>
        <div className="bargikaranadd__form__form-item">
          <input className="bargikaranadd__form__form-item__button" type="submit" value="सेभ गर्नुहोस्" />
        </div>
      </form>      
    </section>
  );
};

export default BargikaranAdd;
