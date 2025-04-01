import React, { useState } from "react";
import "./KittaSearch.scss";
import { useEffect } from "react";
import axios from "axios";

const KittaSearch = () => {
  useEffect(() => {
    document.title = "KittaSearch";
  }, []);
  const Url = import.meta.env.VITE_API_URL + "kitta/";
  const [search, setSearch] = useState(false);
  const [gapas, setGapas] = useState([
    { gabisa_id: "0", gabisa_name: "छान्नुहोस्" },
    { gabisa_id: "1", gabisa_name: "गणेशपुर" },
  ]);
  const [wards, setWards] = useState([
    { ward_no: 1 },
    { ward_no: 2 },
    { ward_no: 3 },
    { ward_no: 4 },
    { ward_no: 5 },
    { ward_no: 6 },
    { ward_no: 7 },
    { ward_no: 8 },
    { ward_no: 9 },
  ]);
  const [data, setData] = useState({    
    gabisa_id: 0,
    ward_no: 0,
    kitta_no: 0,
  });
  const [ownerDetails, setOwnerDetails] = useState([]);
  const [landDetails, setLandDetails] = useState([]);
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value == "" ? 0 : e.target.value,
    });
    console.log(data);
  };
  useEffect(() => {
    loaddata();
  }, [data]);
  const loaddata = async () => {
    if (data.gabisa_id > 0 && data.ward_no > 0 && data.kitta_no > 0) {
      setSearch(true);
      console.log(search);
      const response = await axios({
        method: "post",
        url: Url + "getDetails",
        data: data,
      });
      console.log("sentData", data);
      console.log("receivedData", response.data);
      console.log("ownerdetails", response.data.data);
      console.log("landdetails", response.data.data1);
      setOwnerDetails(response.data.OwnerDetails);
      setLandDetails(response.data.LandDetails);
    }
  };
  useEffect(() => {
    document.title = "Kitta";
  }, []);

  return (
    <section id="kittasearch" className="kittasearch">
      <div className="kittasearch__outer">
        <h5 className="kittasearch__outer__header-text">
          कित्ता विवरण हेर्नुहोस् ।
        </h5>
        <form className="kittasearch__outer__form">
          <div className="kittasearch__outer__form__item">
            <select
              name="gabisa_id"
              className="kittasearch__outer__form__item__input"
              onChange={handleChange}
            >
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
          <div className="kittasearch__outer__form__item">
            <select
              name="ward_no"
              className="kittasearch__outer__form__item__input"
              onChange={handleChange}
            >
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
          <div className="kittasearch__outer__form__item">
            <input
              className="kittasearch__outer__form__item__input"
              type="number"
              name="kitta_no"
              placeholder="कित्ता नं प्रविष्ट गर्नुहोस्"
              onChange={handleChange}
              required
            />
          </div>
        </form>

        {search ? (
          <div className="result-div flex">
            <table>
              <thead>
                <tr>
                  <th>क्र.सं</th>
                  <th>जग्गाधनी</th>
                  <th>बाबु / पति</th>
                  <th>बाजे / ससुरा</th>
                </tr>
              </thead>
              <tbody>
                {ownerDetails ? (
                  ownerDetails.length > 0 ? (
                    ownerDetails.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{item.F3}</td>
                          <td>{item.F4}</td>
                          <td>{item.F5}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5}>
                        <h5 className="heading">कुनै पनि रेकर्ड फेला परेन</h5>
                      </td>
                    </tr>
                  )
                ) : null}
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th>कित्ता नं</th>
                  <th>प्रकार</th>
                  <th>किसिम</th>
                  <th>विरह</th>
                  <th>क्षेत्रफल</th>
                </tr>
              </thead>
              <tbody>
                {landDetails
                  ? landDetails.map((item, i) => {
                      return (
                        <tr>
                          <td>{item.F15}</td>
                          <td>{item.F19}</td>
                          <td>{item.F18}</td>
                          <td>{item.F20}</td>
                          <td>{item.F21}</td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default KittaSearch;
