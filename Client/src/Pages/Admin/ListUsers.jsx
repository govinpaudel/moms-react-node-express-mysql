import React, { useState, useEffect } from 'react'
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
const ListUsers = () => {
  const [data, setdata] = useState();
  const {loggedUser,axiosInstance}=useAuth();
  
  const resetPassword = async (id) => {
    const data = {
      updated_by_user_id: loggedUser.id,
      office_id: loggedUser.office_id,
      user_id: id
    }
    console.log("data sent", data);
    const url = "resetPassword";
    const response = await axiosInstance.post(url, data)
    console.log(response);
    if (response.data.status) {
      toast.success(response.data.message);
    }
    else {
      toast.warning(response.data.message);
    }
  }



  const changeStatus = async (id, status) => {
    const data = {
      office_id: loggedUser.office_id,      
      id: id,
      status: status,
      table:'voucher_users'
    }
    console.log("data sent", data);
    const url = "toggleStatus";
    const response =await axiosInstance.post(url, data)
    console.log(response);
    if (response.data.status) {
      toast.success(response.data.message);
      loadData();
    }
    else {
      toast.warning(response.data.message);
    }
  }

  const loadData = async () => {
    const data = {      
      office_id: loggedUser.office_id,
      table:'voucher_users'
    }
    console.log("data sent", data);
    const url = "getAll";
    const response = await axiosInstance.post(url, data)
    console.log(response);
    setdata(response.data.data);

  }

  useEffect(() => {
    loadData();
    document.title = "MOMS | प्रयोगकर्ताहरु";
  }, [])



  return (
    <section id="listusers" className='listusers'>
      <table className='listvoucher__list__table'>
        <thead>
          <tr>
            <th>कार्यालय कोड</th>            
            <th>प्रयोगकर्ताको नाम</th>
            <th>नाम नेपालीमा</th>
            <th>नाम अंग्रेजीमा</th>
            <th>ईमेल</th>
            <th>सम्पर्क नं</th>
            <th>अवस्था</th>
            <th colSpan={2}>कृयाकलाप</th>
          </tr>
        </thead>
        <tbody>
          {data ? data.map((item, i) => {
            return <tr key={i}>
              <td>{item.office_id}</td>              
              <td>{item.username}</td>
              <td>{item.nepname}</td>
              <td>{item.engname}</td>
              <td>{item.email}</td>
              <td>{item.contactno}</td>
              <td> {item.isactive ? "सक्रिय" : "निष्कृय"}</td>
              <td>
                <button className={item.isactive ? 'listvoucher__list__delbtn' : 'listvoucher__list__editbtn'} onClick={() => {
                  changeStatus(item.id, item.isactive);
                }}>{item.isactive ? "निष्कृय पार्नुहोस्" : "सकृय पार्नुहोस्"}
                </button>
              </td>
              <td>
                <button className='listvoucher__list__editbtn' onClick={() => {
                  resetPassword(item.id);
                }}>रिसेट गर्नुहोस्
                </button>
              </td>
            </tr>
          }) : null
          }

        </tbody>
      </table>
    </section>
  )
}

export default ListUsers