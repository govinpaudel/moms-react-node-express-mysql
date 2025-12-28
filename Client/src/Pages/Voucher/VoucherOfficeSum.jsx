import React, { useState, useEffect } from "react";
import "./VoucherOfficeSum.scss";
import axiosInstance from "../../axiosInstance";
import { toast } from "react-toastify";
import PageHeaderComponent from "../../Components/PageHeaderComponent";
import { BsInfoCircleFill } from "react-icons/bs";
import { Circles } from "react-loader-spinner";
const VoucherOfficeSum = () => {
  const Url = import.meta.env.VITE_API_URL;
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const [officeSum, setOfficeSum] = useState([]);
  const [sanchitkosh, setsanchitkosh] = useState([{}]);
  const [isthaniye, setisthaniye] = useState();
  const [pardesh, setpardesh] = useState([]);
  const [loading,setLoading]= useState(false);

  useEffect(() => {
    genReport();
    document.title = "MOMS | कार्यालय प्रगति  विवरण";
  }, [])

  const genReport = async () => {
    setLoading(true);
    setOfficeSum([{}]);
    setsanchitkosh([{}]);
    setisthaniye([{}]);
    setpardesh([{}]);
    const data = {
      office_id: loggedUser.office_id,
      aaba_id: loggedUser.aabaid
    };
    console.log("data sent", data);
    const response = await axiosInstance.post("/VoucherOfficeSum", data)
    console.log('sanchitkosh', response.data.sanchitkosh);
    setOfficeSum(response.data.officesum);
    setisthaniye(response.data.isthaniye);
    setpardesh(response.data.pardesh);
    setsanchitkosh(response.data.sanchitkosh);
    setLoading(false);
  };

  return (
    <section id="Vouchermonthly" className="Vouchermonthly">
      <PageHeaderComponent
        officeText={`(${loggedUser.office_name})`}
        headerText="को महिना अनुसारको प्रतिवेदन"
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
      <table className="listvoucher__list__table">
        <thead>
          <tr>
            <th className="mywidth">शिर्षक</th>
            <th>जम्मा</th>
            <th>श्रावण</th>
            <th>भदौ</th>
            <th>असोज</th>
            <th>कार्तिक</th>
            <th>मंसिर</th>
            <th>पौष</th>
            <th>माघ</th>
            <th>फाल्गुन</th>
            <th>चैत्र</th>
            <th>बैशाख</th>
            <th>जेठ</th>
            <th>असार</th>
          </tr>
        </thead>
        <tbody>
          {officeSum ? officeSum.map((item, i) => {
            return <tr key={i}>
              <td>{item.acc_sirshak_name}</td>
              <td>{item.total_amount}</td>
              <td>{item.A}</td>
              <td>{item.B}</td>
              <td>{item.C}</td>
              <td>{item.D}</td>
              <td>{item.E}</td>
              <td>{item.F}</td>
              <td>{item.G}</td>
              <td>{item.H}</td>
              <td>{item.I}</td>
              <td>{item.J}</td>
              <td>{item.K}</td>
              <td>{item.L}</td>
            </tr>
          }) : null}

          <tr><td colSpan={14}><hr className="line" /></td></tr>
          <tr>
            <th>संचितकोषमा जाने</th>
            <th>जम्मा</th>
            <th>श्रावण</th>
            <th>भदौ</th>
            <th>असोज</th>
            <th>कार्तिक</th>
            <th>मंसिर</th>
            <th>पौष</th>
            <th>माघ</th>
            <th>फाल्गुन</th>
            <th>चैत्र</th>
            <th>बैशाख</th>
            <th>जेठ</th>
            <th>असार</th>
          </tr>
          {sanchitkosh ? sanchitkosh.map((item, i) => {
            return <tr key={i}>
              <td>{item.acc_sirshak_name}</td>
              <td>{Math.round(item.total_amount)}</td>
              <td>{Math.round(item.A)}</td>
              <td>{Math.round(item.B)}</td>
              <td>{Math.round(item.C)}</td>
              <td>{Math.round(item.D)}</td>
              <td>{Math.round(item.E)}</td>
              <td>{Math.round(item.F)}</td>
              <td>{Math.round(item.G)}</td>
              <td>{Math.round(item.H)}</td>
              <td>{Math.round(item.I)}</td>
              <td>{Math.round(item.J)}</td>
              <td>{Math.round(item.K)}</td>
              <td>{Math.round(item.L)}</td>
            </tr>
          }) : null}
          <tr><td colSpan={14}><hr className="line" /></td></tr>
          <tr>
            <th>स्थानियमा जाने</th>
            <th>जम्मा</th>
            <th>श्रावण</th>
            <th>भदौ</th>
            <th>असोज</th>
            <th>कार्तिक</th>
            <th>मंसिर</th>
            <th>पौष</th>
            <th>माघ</th>
            <th>फाल्गुन</th>
            <th>चैत्र</th>
            <th>बैशाख</th>
            <th>जेठ</th>
            <th>असार</th>
          </tr>

          {isthaniye ? isthaniye.map((item, i) => {
            return <tr key={i}><td>{item.napa_name}</td>
              <td>{Math.round(item.total_amount)}</td>
              <td>{Math.round(item.A)}</td>
              <td>{Math.round(item.B)}</td>
              <td>{Math.round(item.C)}</td>
              <td>{Math.round(item.D)}</td>
              <td>{Math.round(item.E)}</td>
              <td>{Math.round(item.F)}</td>
              <td>{Math.round(item.G)}</td>
              <td>{Math.round(item.H)}</td>
              <td>{Math.round(item.I)}</td>
              <td>{Math.round(item.J)}</td>
              <td>{Math.round(item.K)}</td>
              <td>{Math.round(item.L)}</td>
            </tr>
          }) : null}
          <tr><td colSpan={14}><hr className="line" /></td></tr>
          <tr>
            <th>प्रदेशमा जाने</th>
            <th>जम्मा</th>
            <th>श्रावण</th>
            <th>भदौ</th>
            <th>असोज</th>
            <th>कार्तिक</th>
            <th>मंसिर</th>
            <th>पौष</th>
            <th>माघ</th>
            <th>फाल्गुन</th>
            <th>चैत्र</th>
            <th>बैशाख</th>
            <th>जेठ</th>
            <th>असार</th>
          </tr>
          {pardesh ?
            pardesh.map((item, i) => {
              return <tr key={i}><td>{item.acc_sirshak_name}</td>
                <td>{Math.round(item.total_amount)}</td>
                <td>{Math.round(item.A)}</td>
                <td>{Math.round(item.B)}</td>
                <td>{Math.round(item.C)}</td>
                <td>{Math.round(item.D)}</td>
                <td>{Math.round(item.E)}</td>
                <td>{Math.round(item.F)}</td>
                <td>{Math.round(item.G)}</td>
                <td>{Math.round(item.H)}</td>
                <td>{Math.round(item.I)}</td>
                <td>{Math.round(item.J)}</td>
                <td>{Math.round(item.K)}</td>
                <td>{Math.round(item.L)}</td>
              </tr>
            }) : null
          }
        </tbody>
      </table>

    </section>
  );
};

export default VoucherOfficeSum;
