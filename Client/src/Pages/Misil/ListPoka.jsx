import React, { useState, useEffect } from 'react'
import axios from 'axios';
const ListPoka = () => {
  const [data, setdata] = useState([]);
  const Url = import.meta.env.VITE_API_URL + "misil/";
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

  const loadPokas = async () => {
    const response = await axios({
      method: "post",
      url: Url + "getPokasByOffice",
      data: {
        office_id: loggedUser.office_id
      }
    }
    )
    console.log(response.data);
    setdata(response.data.data);
  }
  useEffect(() => {
    loadPokas()
  }, [])

  return (
    <section className='pokalist'>
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
            </tr>
          }) : null}

        </tbody>
      </table>
    </section>
  )
}

export default ListPoka