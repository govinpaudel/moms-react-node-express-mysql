import axiosInstance  from "../../axiosInstance";
import { useEffect, useState } from "react";
import "./listvoucher.scss";
import { NavLink, useNavigate } from "react-router-dom";

import PageHeaderComponent from "../../Components/PageHeaderComponent";
import { BsInfoCircleFill } from "react-icons/bs";
import { toast } from "react-toastify";
const Listvoucher = () => {
  const navigate = useNavigate();
  const Url = import.meta.env.VITE_API_URL + "voucher/";
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const [voucherlist, setvoucherlist] = useState([]);
  const [svoucherno, setsvoucherno] = useState(0);
  const summary = [{ sirshak_id: 0, sirshak_name: "लिखत तर्फ", amount: 0 }];
  voucherlist.forEach((a) => {
    let indexToUpdate = summary.findIndex(
      (item) => item.sirshak_id === a.sirshak_id
    );
    if (indexToUpdate > -1) {
      summary[indexToUpdate].amount =
        parseInt(summary[indexToUpdate].amount) + parseInt(a.amount);
    } else {
      summary.push({
        sirshak_id: a.sirshak_id,
        sirshak_name: a.sirshak_name,
        amount: a.amount,
      });
    }
    if (a.sirshak_id == 1 || a.sirshak_id == 2) {
      let indexToUpdate1 = summary.findIndex((item) => item.sirshak_id === 0);
      if (indexToUpdate1 > -1) {
        summary[indexToUpdate1].amount =
          parseInt(summary[indexToUpdate1].amount) + parseInt(a.amount);
      }
    }
  });

  const deleteVoucher= async(e)=>{
    console.log(loggedUser.role);
    if(loggedUser.role==2){
      toast.warning("यो सुविधा व्यवस्थापक लाई मात्र उपलब्ध छ")
      return;
    }
    const yes=confirm("के तपाई यो भौचर हटाउन चहानुहुन्छ ?")
    if(yes){
      const data = { id:e,
        user_id:loggedUser.id
       };
      const response = await axios({
        method: "post",
        url: Url + "deleteVoucherById",
        data: data,
      });
      if(response.data.status==true){
        toast.success(`भौचर नं ${e} सफलतापुर्वक हटाईयो`)
        loadTodayVouchers();
      }
    }

  }

  
useEffect(() => {
  if (svoucherno.length > 0) {
  let timer = setTimeout(() => {     
    loadSingleVoucher();      
    }, 1000)
    return () => clearTimeout(timer)
  }
  else{
    loadTodayVouchers();
  }
}, [svoucherno])

  const loadSingleVoucher = async () => {
    if (svoucherno.length > 0) {
      const data = {
        office_id: loggedUser.office_id,
        aaba_id: loggedUser.aabaid,
        voucherno: svoucherno.trim(),
      };
      const response = await axios({
        method: "post",
        url: Url + "loadSingleVoucher",
        data: data,
      });
      setvoucherlist(response.data.data);
    }
    else {
      loadTodayVouchers();
    }
  };

  const loadTodayVouchers = async () => {
    const data = {
      created_by_user_id: loggedUser.id
    }
    console.log("Request Sent", data);  
    const response = await axiosInstance.post("voucher/getTodaysVoucher",data)    
    console.log('Response Came',response);
    setvoucherlist(response.data.data);
  };

  const loadVouchers = () => {
    console.log("svoucherno", svoucherno);
    if (svoucherno > 0) {
      loadSingleVoucher();      
    } else {
      loadTodayVouchers();      
    }
  };
  
  useEffect(() => {
    document.title = "MOMS | आजका भौचरहरु";
    loadVouchers();
  }, []);
  return (
    <section id="listvoucher" className="listvoucher">
      <PageHeaderComponent
      officeText={`( ${loggedUser.nepname} )`}
        headerText="बाट आज दर्ता भएका भौचरहरु"
        icon={<BsInfoCircleFill size={40} />}
      />
      <div className="listvoucher__adddiv">
        <div className="listvoucher__adddiv__search no-print">
          <input
            type="text"
            className="listvoucher__adddiv__search__input"
            placeholder="खोजीको लागि भौचर नं प्रविष्ट गर्नुहोस् ।"            
            onChange={(e) => {
              setsvoucherno(e.target.value)
            }}
          />
        </div>
        <NavLink to={"/voucher/addvoucher"}>
          <div className="listvoucher__adddiv__addbtn no-print">
            <span> ( + )भौचर दर्ता गर्नुहोस्</span>
          </div>
        </NavLink>
      </div>
      <div className="listvoucher__summary">
        {summary
          ? summary.map((data, i) => {
            return (
              <div key={i} className="listvoucher__summary__inner-div">
                <h4 className="listvoucher__summary__inner-div__sirshak">
                  {data.sirshak_name} : {data.amount} ।
                </h4>
              </div>
            );
          })
          : null}
      </div>
      {/* List voucher starts */}
      <div className="listvoucher__list">
        <table className="listvoucher__list__table">
          <thead>
            <tr>
              <th>क्र.सं</th>
              <th>बैंक दाखिला मिति</th>
              <th>कारोबार मिति</th>
              <th>शिर्षक</th>
              <th>गा.पा । न.पा</th>
              <th>फाँट</th>              
              <th>भौचर नं</th>
              <th>जम्मा गर्ने</th>
              <th>रकम</th>
              <th className="no-print" colSpan={2}>कृयाकलाप</th>
            </tr>
          </thead>
          <tbody>
            {voucherlist.length > 0 ? (
              voucherlist.map((data, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{data.ndate_voucher}</td>
                    <td>{data.ndate_transaction}</td>
                    <td>{data.sirshak_name}</td>
                    <td>{data.napa_name}</td>
                    <td>{data.fant_name}</td>                   
                    <td>{data.voucherno}</td>
                    <td>{data.deposited_by}</td>
                    <td>{data.amount}</td>
                    <td className="no-print">
                      <button
                        className="listvoucher__list__editbtn"
                        onClick={() => navigate("/voucher/editvoucher",{state:{id:data.id}})}
                      >
                        संशोधन
                      </button>
                      <button className="listvoucher__list__delbtn"
                      onClick={()=>deleteVoucher(data.id)}
                      >हटाउनुहोस्</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10}>
                  <h1 className="heading center">
                    कुनै पनि भौचर दर्ता भएको छैन ।
                  </h1>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* list voucher ends */}
    </section>
  );
};

export default Listvoucher;
