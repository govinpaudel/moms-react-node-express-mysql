import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MisilSearch.scss";
import { toast } from "react-toastify";
import PageHeaderComponent from "../../Components/PageHeaderComponent";
import { BsInfoCircleFill } from "react-icons/bs";

const MisilSearch = () => {
  const initialdata = {
    type: "searchmisil",
    misiltypeid: 0,
    aabaid: 0,
    miti: "",
    minum: "",
  };
  const [aabas, setAabas] = useState([]);
  const [types, setTypes] = useState([]);
  const [sdata, setsdata] = useState(initialdata);
  const [Result, setResult] = useState([]);
  const Url = import.meta.env.VITE_API_URL + "misil/";
  const loadtypes = async () => {
    try {
      const response = await axios({
        method: "post",
        url: Url + "getlist.php",
        data: {
          type: "getalltypes",
        },
      });
      setTypes(response.data.types);
    } catch (error) {
      console.log(error);
    }
  };
  const loadaabas = async (e) => {
    try {
      const response = await axios({
        method: "post",
        url: Url + "getlist.php",
        data: {
          type: "getallaabas",
          misiltypeid: e,
        },
      });
      setAabas(response.data.aabas);
    } catch (error) {
      console.log(error);
    }
  };
  const handletypechange = (e) => {
    loadaabas(e.target.value);
  };
  const handlesubmit = async () => {
    console.log(sdata);
    try {
      if (sdata.misiltypeid == 0) {
        toast.warning("मिसिल प्रकार छान्नुहोस् ।");
        return;
      }
      if (sdata.aabaid == 0) {
        toast.warning("आ.ब. छान्नुहोस् ।");
        return;
      }
      if (sdata.miti.length == 0 && sdata.minum.length == 0) {
        toast.warning("मिति वा मि.नं प्रविष्ठ गर्नुहोस् ।");
        return;
      }
      const response = await axios({
        method: "post",
        url: Url + "getlist.php",
        data: sdata,
      });
      console.log(response);
      setResult(response.data.result);
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
              name="misiltypeid"
              onChange={handlechange}
              onBlur={handletypechange}
            >
              <option value={0}>मिसिल प्रकार छान्नुहोस् ।</option>
              {types
                ? types.map((item, i) => {
                    return (
                      <option key={i} value={item.misiltypeid}>
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
              name="aabaid"
              onChange={handlechange}
            >
              <option value={0}>आ.व. छान्नुहोस् ।</option>
              {aabas
                ? aabas.map((item, i) => {
                    return (
                      <option key={i} value={item.aabaid}>
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
          <div className="misilsearch__outer__form__item">
            <button
              className="misilsearch__outer__form__item__button"
              onClick={handlesubmit}
            >
              खोजि गर्नुहोस्
            </button>
          </div>
        </div>
      </div>
      <div className="main-div">
        <table className="listtable">
          <thead>
            <tr>
              <th>मिसिल प्रकार</th>
              <th>मिति</th>
              <th>मि.नं.</th>
              <th>पोका नं</th>
            </tr>
          </thead>
          <tbody>
            {Result.map((item, i) => {
              return (
                <tr key={i}>
                  <td>{item.misil_type_name}</td>
                  <td>{item.miti}</td>
                  <td>{item.minum}</td>
                  <td>{item.pokaname}</td>
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
