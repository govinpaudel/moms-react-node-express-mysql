import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import "./MisilSearch.scss";
import { toast } from "react-toastify";
import PageHeaderComponent from "../../Components/PageHeaderComponent";
import { BsInfoCircleFill } from "react-icons/bs";
const MisilSearch = () => { 
  const [types, setTypes] = useState([]);
  const [aabas, setAabas] = useState([]);  
  const [Result, setResult] = useState([]);  
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  
  const initialdata = {   
    misil_type_id: 0,
    aaba_id: 0,
    miti: "",
    minum: "",
    office_id:loggedUser.office_id
  };
  const [sdata, setsdata] = useState(initialdata);
  const loadtypes = async () => {
    try {
      const url="misil/getTypesByOfficeId/"+loggedUser.office_id;
      const response=await axiosInstance.get(url)      
      setTypes(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadaabas = async (e) => {
    try {
      const url="misil/"+"getAabaByOffice/"+loggedUser.office_id+"/"+sdata.misil_type_id
      const response=await axiosInstance.get(url)     
      setAabas(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  const loadpoka = async () => {
    console.log(sdata);
    try {
      if (sdata.misil_type_id == 0) {
        toast.warning("मिसिल प्रकार छान्नुहोस् ।");
        return;
      }
      if (sdata.aaba_id == 0) {
        toast.warning("आ.ब. छान्नुहोस् ।");
        return;
      }
      if (sdata.miti.length == 0 && sdata.minum.length == 0) {
        toast.warning("मिति वा मि.नं प्रविष्ठ गर्नुहोस् ।");
        return;
      }
      const url="misil/getpoka";
      const response=await axiosInstance.post(url,sdata);
      
      console.log(response);
      setResult(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };


  const handlechange = (e) => {
    setsdata({ ...sdata, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    loadtypes();
  }, []);

  useEffect(() => {
    loadaabas();
  }, [sdata.misil_type_id]);

  useEffect(() => {
    loadpoka();
  }, [sdata.miti,sdata.minum]);


  return (
    <section id="misilsearch" className="misilsearch">
      <PageHeaderComponent
        headerText="मिसिल खोजी गर्नुहोस्"
        icon={<BsInfoCircleFill size={40} />}
      />
      <div className="misilsearch__outer">
        <div className="misilsearch__outer__form">
          <div className="misilsearch__outer__form__item">
            <select
              className="misilsearch__outer__form__item__input"
              name="misil_type_id"
              onChange={handlechange}              
            >
              <option value={0}>मिसिल प्रकार छान्नुहोस् ।</option>
              {types
                ? types.map((item, i) => {
                    return (
                      <option key={i} value={item.misil_type_id}>
                        {item.misil_type_name}
                      </option>
                    );
                  })
                : null}
            </select>
          </div>
          <div className="misilsearch__outer__form__item">
            <select
              className="misilsearch__outer__form__item__input"
              name="aaba_id"
              onChange={handlechange}
            >
              <option value={0}>आ.व. छान्नुहोस् ।</option>
              {aabas
                ? aabas.map((item, i) => {
                    return (
                      <option key={i} value={item.aaba_id}>
                        {item.aaba_name}
                      </option>
                    );
                  })
                : null}
            </select>
          </div>
          <div className="misilsearch__outer__form__item">
            <input
              type="text"
              className="misilsearch__outer__form__item__input"
              placeholder="मिति"
              maxLength="10"
              size="10"
              name="miti"
              onChange={handlechange}
            />
          </div>
          <div className="misilsearch__outer__form__item">
            <input
              type="text"
              name="minum"
              className="misilsearch__outer__form__item__input"
              placeholder="मिसिल नं"
              onChange={handlechange}
            />
          </div>          
        </div>
      </div>
      <div className="main-div">
        <table className="listvoucher__list__table">
          <thead>
            <tr>
              <th>मिसिल प्रकार</th>
              <th>मिति</th>
              <th>मि.नं.</th>
              <th>पोका नं</th>
              <th>निवेदकको नाम</th>
              <th>जग्गाधनीको नाम</th>
            </tr>
          </thead>
          <tbody>
            {Result.map((item, i) => {
              return (
                <tr key={i}>
                  <td>{item.misil_type_name}</td>
                  <td>{item.miti}</td>
                  <td>{item.minum}</td>
                  <td>{item.misil_poka_name}</td>
                  <td>{item.nibedakname}</td>
                  <td>{item.jaggadhaniname}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MisilSearch;
