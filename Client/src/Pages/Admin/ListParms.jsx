import React, { useState, useEffect } from 'react'
import axios from 'axios';
import "./List.scss";
import { toast } from 'react-toastify';
const ListParms = () => {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const initialdata = {
    id: 0,    
    vstart: "",
    vlength: "",    
  }
  const [listdata, setlistdata] = useState();
  const [data, setdata] = useState(initialdata);
  const Url = import.meta.env.VITE_API_URL;
  const loadEditData = async (data) => {   
    setdata(data);   
  }

  const OnSubmit = async (e) => {
    e.preventDefault();
    setdata({...data,user_id:loggedUser.id,table_name:'voucher_parameter',office_id: loggedUser.office_id})
    console.log("data sent for updation", data);
    const url = "addOrUpdateParms"
    const response = await axios.post(url, data);

    console.log(response);
    if (response.data.status == true) {
      toast.success(response.data.message);
      loadData();
      setdata(initialdata);
    }

  }
  const changeStatus = async (id, status) => {
    const data = {
      table:"voucher_parameter",
      office_id: loggedUser.office_id,
      id: id,
      status: status,
      user_id: loggedUser.id
    }
    console.log("data sent", data);
    const url = "/togglestatus"
    const response = await axios.post(url, data);

    console.log(response);
    if (response.data.status) {
      toast.success(response.data.message);
      loadData();
    }
    else {
      toast.warning(response.data.message);
    }
  }

  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
    console.log("data changed", data);
  };

  const loadData = async () => {
    const data = {
      office_id: loggedUser.office_id,
      table: "voucher_parameter"
    }
    console.log("data sent", data);
    const url = "/getAll"
    const response = await axios.post(url, data);
    console.log(response);
    setlistdata(response.data.data);

  }

  useEffect(() => {
    loadData();
    document.title = "MOMS | भौचर सेटअप";
  }, [])



  return (
    <section id="list" className='list'>
      <div className="list__outerdiv">
        <h5 className="list__outerdiv__header-text">भौचर लम्बाई तथा शुरु अंक दर्ता तथा संशोधन फाराम</h5>
        <form className='list__form' onSubmit={OnSubmit}>
          <div className="list__form__item">
            <input type="text" onChange={handleChange} className='list__form__item__input' value={data.vstart} name='vstart' placeholder='भौचर शरु अंक' required />
          </div>
          <div className="list__form__item">
            <input type="number" onChange={handleChange} className='list__form__item__input' value={data.vlength} name='vlength' placeholder='भौचरको लम्बाई' required />
          </div>
          <div className="list__form__item">
            <input type="submit" value="सेभ गर्नुहोस्" className='list__form__item__button' />
          </div>
        </form>
      </div>
      <table className='listvoucher__list__table table-800'>
        <thead>
          <tr>
            <th>भौचर शरु अंक</th>
            <th>भौचर लम्बाई</th>
            <th>अवस्था</th>
            <th colSpan={2}>कृयाकलाप</th>
          </tr>
        </thead>
        <tbody>
          {listdata ? listdata.map((item, i) => {
            return <tr key={i}>
              <td>{item.vstart}</td>
              <td>{item.vlength}</td>
              <td>
                {item.isactive ? "सक्रिय" : "निष्कृय"}</td>
              <td>
                <button className='editbtn' onClick={() => {
                  loadEditData(item);
                }}>संशोधन गर्नुहोस्</button>
                <button className={item.isactive ? 'listvoucher__list__delbtn' : 'listvoucher__list__editbtn'} onClick={() => {
                  changeStatus(item.id, item.isactive)
                }}>{item.isactive ? "निस्कृय पार्नुहोस्" : "सकृय पार्नुहोस्"}</button></td>
            </tr>
          }) : null
          }

        </tbody>
      </table>
    </section>
  )
}

export default ListParms;