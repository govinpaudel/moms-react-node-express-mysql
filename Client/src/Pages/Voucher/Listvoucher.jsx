import axiosInstance from "../../axiosInstance";
import { useEffect, useState } from "react";
import "./listvoucher.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { Circles } from "react-loader-spinner";
import PageHeaderComponent from "../../Components/PageHeaderComponent";
import { BsInfoCircleFill } from "react-icons/bs";
import { toast } from "react-toastify";
const Listvoucher = () => {
  const navigate = useNavigate();
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const [voucherlist, setvoucherlist] = useState([]);
  const [svoucherno, setsvoucherno] = useState(0);
  const summary = [{ sirshak_id: 99, sirshak_name: "आजको जम्माः", amount: 0 }];
  const [loading, setLoading] = useState(true); 
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
      let indexToUpdate1 = summary.findIndex((item) => item.sirshak_id === 99);
      if (indexToUpdate1 > -1) {
        summary[indexToUpdate1].amount =
          parseInt(summary[indexToUpdate1].amount) + parseInt(a.amount);
      }    
  });
  const deleteVoucher = async (e) => {
    console.log(loggedUser.role);
    if (loggedUser.role == 2) {
      toast.warning("यो सुविधा व्यवस्थापक लाई मात्र उपलब्ध छ")
      return;
    }
    const yes = confirm("के तपाई यो भौचर हटाउन चहानुहुन्छ ?")
    if (yes) {
      const data = {
        id: e,
        user_id: loggedUser.id
      };
      const response = await axios({
        method: "post",
        url: Url + "deleteVoucherById",
        data: data,
      });
      if (response.data.status == true) {
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
    else {
      loadTodayVouchers();
    }
  }, [svoucherno])

  const loadSingleVoucher = async () => {
    try {
      const data = {
        office_id: loggedUser.office_id,
        aaba_id: loggedUser.aabaid,
        voucherno: svoucherno.trim(),
      };
      const url = "voucher/loadSingleVoucher";
      const response = await axiosInstance.post(url, data);
      setvoucherlist(response.data.data);
    } catch (error) {
      console.log(error)
    }
  };

  const loadTodayVouchers = async () => {
    setLoading(true);
    try {
      const url = "voucher/getTodaysVoucher";
      const data = { created_by_user_id: loggedUser.id }
      const response = await axiosInstance.post(url, data)
      setvoucherlist(response.data.data);
    } catch (error) {
      console.log(error)
    }
    setLoading(false);
  };

  const loadVouchers = () => {
    if (svoucherno > 0) {
      loadSingleVoucher();
    } else {
      loadTodayVouchers();
    }
  };

  useEffect(() => {
    document.title = "MOMS | आज दर्ता भौचरहरु";
    loadVouchers();
  }, []);
  return (
    <section id="listvoucher" className="listvoucher">
      <PageHeaderComponent
        officeText={`( ${loggedUser.nepname} )`}
        headerText="बाट आज दर्ता भएका भौचरहरु"
        icon={<BsInfoCircleFill size={40} />}
      />
      {loading ?
        (
          <div className="fullscreen-loader">
            <div className="loader">
              <Circles height={150} width={150} color="#ffdd40" ariaLabel="loading" />
              <h2 className="loader-text" >कृपया प्रतिक्षा गर्नुहोस् ।</h2>
            </div>
          </div>
        ) : null
      }
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
                        onClick={() => navigate("/voucher/editvoucher", { state: { id: data.id } })}
                      >
                        संशोधन
                      </button>
                      <button className="listvoucher__list__delbtn"
                        onClick={() => deleteVoucher(data.id)}
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
