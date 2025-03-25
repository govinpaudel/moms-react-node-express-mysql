import axios from "axios";
import { useEffect, useState } from "react";
import "./listvoucher.scss";
import { NavLink } from "react-router-dom";
import PageHeaderComponent from "../../Components/PageHeaderComponent";
import { BsInfoCircleFill } from "react-icons/bs";
const Listvoucher = () => {
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
  const SearchVoucher = (e) => {
    if (e.key == 'Enter') {
      loadSingleVoucher();
    }

  }
  const loadSingleVoucher = async () => {
    if (svoucherno.length > 0) {
      const data = {
        office_id: loggedUser.office_id,
        aaba_id: loggedUser.aabaid,
        voucherno: svoucherno,
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
    console.log("data sent", data);
    const response = await axios({
      method: "post",
      url: Url + "getTodaysVoucher",
      data: data
    });
    console.log(response);
    setvoucherlist(response.data.data);
  };

  const loadVouchers = () => {
    console.log("svoucherno", svoucherno);
    if (svoucherno > 0) {
      loadSingleVoucher();
      console.log("single voucher called");
    } else {
      loadTodayVouchers();
      console.log("all voucher called");
    }
  };
  function handleOpen(e) {
    console.log("i am opening edit form");
    props.Open(e);
  }
  useEffect(() => {
    loadVouchers();
  }, []);
  return (
    <section id="listvoucher" className="listvoucher">
      <PageHeaderComponent
        headerText="आज दर्ता भएका भौचरहरु"
        icon={<BsInfoCircleFill size={40} />}
      />
      <div className="listvoucher__adddiv">
        <div className="listvoucher__adddiv__search">
          <input
            type="text"
            className="listvoucher__adddiv__search__input"
            placeholder="खोजीको लागि भौचर नं प्रविष्ट गर्नुहोस् ।"
            onKeyUp={SearchVoucher}
            onChange={(e) => {
              setsvoucherno(e.target.value)
            }}
          />
        </div>
        <NavLink to={"/home/addvoucher"}>
          <div className="listvoucher__adddiv__addbtn">
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
              <th>मिति</th>
              <th>शिर्षक</th>
              <th>गा.पा । न.पा</th>
              <th>फाँट</th>
              <th>कर्मचारी</th>
              <th>भौचर नं</th>
              <th>जम्मा गर्ने</th>
              <th>रकम</th>
              <th colSpan={2}>कृयाकलाप</th>
            </tr>
          </thead>
          <tbody>
            {voucherlist.length > 0 ? (
              voucherlist.map((data, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{data.ndate}</td>
                    <td>{data.sirshak_name}</td>
                    <td>{data.napa_name}</td>
                    <td>{data.fant_name}</td>
                    <td>{data.staff_name}</td>
                    <td>{data.voucherno}</td>
                    <td>{data.remarks}</td>
                    <td>{data.amount}</td>
                    <td>
                      <button
                        className="btn edit"
                        onClick={() => handleOpen(data.id)}
                      >
                        Edit
                      </button>
                      <button className="btn del">Del</button>
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
