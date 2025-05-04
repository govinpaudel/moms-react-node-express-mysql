import React, { useState, useEffect } from 'react'
import axios from 'axios';
import "./listPoka.scss";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const ListPoka = () => {
  const navigate =useNavigate();
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const initialdata = {
    id: 0,
    misil_type_id: 0,
    fant: "",
    remarks: "",
    created_by_user_id: loggedUser.id,
    office_id: loggedUser.office_id,
    aaba_id: loggedUser.aabaid,
  }
  const [data, setdata] = useState([]);
  const [aaba, setAaba] = useState([]);
  const [defaaba, setdefaaba] = useState();
  const [misilTypes, setMisilTypes] = useState([]);
  const [formData, setFormData] = useState(initialdata);
  const Url = import.meta.env.VITE_API_URL + "misil/";

  const handlesubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    const response = await axios({
      method: "POST",
      data: formData,
      url: Url + 'addOrUpdatePoka'
    })
    // console.log(response);
    if (response.data.status == true) {
      toast.success(response.data.message);
      loadPokas();
      setFormData(initialdata);
    }

  }
  const loadAabas = async () => {
    console.log("calling aabas");
    const response = await axios({
      method: "get",
      url: Url + 'getAllAabas'
    },)
    // console.log(response.data.data);
    setAaba(response.data.data)
  };
  const loadMisiTypes = async () => {
    const response = await axios({
      method: "get",
      url: Url + 'getMisilTypes'
    },)
    // console.log(response.data.data);
    setMisilTypes(response.data.data);
  };
  const loadPokas = async () => {
    const response = await axios({
      method: "post",
      url: Url + "getPokasByOffice",
      data: {
        office_id: loggedUser.office_id
      }
    }
    )
    // console.log(response.data);
    setdata(response.data.data);
  }
  const handleChange = (e) => {
    // console.log(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value,created_by_user_id:loggedUser.id })
    // console.log(formData);
    if (e.target.name == 'aaba_id') {
      setdefaaba(e.target.value);
    }
  }


  const EditPoka = async (e) => {
    // console.log(e);
    const data = {
      misil_id: e
    }
    const response = await axios({
      method: 'POST',
      url: Url + 'getPokaForEdit',
      data: data
    })
    // console.log(response.data.data);
    setFormData(response.data.data[0]);
    // console.log(formData);
  }

  useEffect(() => {
    loadPokas();
    loadAabas();
    loadMisiTypes();
    document.title = "MOMS | पोकाहरु";
  }, [])
  useEffect(() => {
    aaba.forEach((item) => {
      item.is_current == 1 ? setdefaaba(item.id) : null;
    });
  }, [aaba])

  return (
    <section className='mainsection'>
      <div className="mainsection__formdiv">
        <form className='mainsection__formdiv__form' onSubmit={handlesubmit}>
          <div className='mainsection__formdiv__form__row'>
            <div className="mainsection__formdiv__form__row__item">
              <label className="mainsection__formdiv__form__row__item__label">आ.व.</label>
              <select onChange={handleChange} name="aaba_id" className='mainsection__formdiv__form__row__item__input' value={defaaba}>
                <option value="0">आ.व.</option>
                {aaba ? aaba.map((item, i) => {
                  return <option key={i} value={item.id}>{item.aaba_name}</option>
                }) : null}
              </select>
            </div>
            <div className="mainsection__formdiv__form__row__item">
              <label className="mainsection__formdiv__form__row__item__label">मिसिल प्रकार</label>
              <select onChange={handleChange} name="misil_type_id" className='mainsection__formdiv__form__row__item__input' value={formData.misil_type_id}>
                <option value="0">मिसिल प्रकार छान्नुहोस्</option>
                {misilTypes ? misilTypes.map(
                  (item, i) => {
                    return <option key={i} value={item.id}>{item.misil_type_name}</option>
                  }) : null}
              </select>
            </div>
            <div className="mainsection__formdiv__form__row__item">
              <label className="mainsection__formdiv__form__row__item__label">फाँट</label>
              <input type="text" onChange={handleChange} name="fant" className='mainsection__formdiv__form__row__item__input' required value={formData.fant} />
            </div>
            <div className="mainsection__formdiv__form__row__item">
              <label className="mainsection__formdiv__form__row__item__label">कैफियत</label>
              <input type="text" onChange={handleChange} name="remarks" className='mainsection__formdiv__form__row__item__input' required value={formData.remarks} />
            </div>
            <div className="mainsection__formdiv__form__row__item">
              <label className="mainsection__formdiv__form__row__item__label">कृयाकलाप</label>
              <input type="submit" value="सेभ" className='mainsection__formdiv__form__row__item__button' />
            </div>

          </div>
        </form>
      </div>
      <table className='listvoucher__list__table'>
        <thead>
          <tr>
            <th>आ.व.</th>
            <th>मसिल प्रकार</th>
            <th>पोका नं</th>
            <th>फाँट</th>
            <th>मिसिल संख्या</th>
            <th>कैफियत</th>
            <th>प्रयोगकर्ता</th>
            <th colSpan={2}>कृयाकलाप</th>
          </tr>
        </thead>
        <tbody>
          {data ? data.map((item, i) => {
            return <tr key={i}>
              <td>{item.aaba_name}</td>
              <td>{item.misil_type_name}</td>
              <td>{item.misil_poka_name}</td>
              <td>{item.fant}</td>
              <td>{item.misilcount}</td>
              <td>{item.remarks}</td>
              <td>{item.nepname}</td>
              <td><button className='mainsection__formdiv__form__row__item__buttonview' onClick={() => navigate("/misil/viewpoka",{state:{id:item.id}})}>हेर्नुहोस्</button><button className='mainsection__formdiv__form__row__item__buttonedit' onClick={() => {
                EditPoka(item.id);
              }}>संशोधन</button></td>
              <td></td>
            </tr>
          }) : null}

        </tbody>
      </table>
    </section>
  )
}

export default ListPoka