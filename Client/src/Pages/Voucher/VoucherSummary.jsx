import axios from "axios";
import { useState, useEffect } from "react";
import "./VoucherSummary.scss";
const VoucherSummary = () => {
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const [reportData, setreportData] = useState();
  const [reportData1, setreportData1] = useState();
  const Url = import.meta.env.VITE_API_URL + "voucher/";

  const loadreport = async () => {
    const data = {
      type: "Summary",
      office_id: loggedUser.officeid,
      aaba_id: loggedUser.aabaid,
    };
    console.log("url came summary page", Url);
    console.log("Request sent to server", data);
    const response = await axios({
      method: "post",
      url: Url + "report.php",
      data: data,
    });
    console.log("Response from server", response);
    setreportData(response.data.data);
    setreportData1(response.data.data1);
  };
  useEffect(() => {
    loadreport();
  }, []);
  return (
    <div className="show">
      <h5 className="heading center">
        यस आर्थिक वर्षमा शिर्षक अनुसारको जम्मा भएको रकम ।
      </h5>
      <table className="table">
        <thead>
          <tr>
            <th>शिर्षक</th>
            <th>जम्मा</th>
            <th>संघ</th>
            <th>प्रदेश</th>
            <th>स्थानिय</th>
            <th>संचितकोष</th>
          </tr>
        </thead>
        <tbody>
          {reportData ? (
            reportData.map((item) => {
              return (
                <tr key={item.sirshak_id}>
                  <td>{item.sirshak_name}</td>
                  <td>{item.amount}</td>
                  <td>{item.sangh}</td>
                  <td>{item.pardesh}</td>
                  <td>{item.isthaniye}</td>
                  <td>{item.sanchitkosh}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>No data loaded</td>
            </tr>
          )}
        </tbody>
      </table>
      <h5 className="heading center">
        यस आर्थिक वर्षमा पालिका अनुसारको बाँडफाँड हुने रकम ।
      </h5>
      <table className="table">
        <thead>
          <tr>
            <th>न.पा.</th>
            <th>जम्मा</th>
            <th>संघ</th>
            <th>प्रदेश</th>
            <th>स्थानिय</th>
            <th>संचितकोष</th>
          </tr>
        </thead>
        <tbody>
          {reportData1 ? (
            reportData1.map((item) => {
              return (
                <tr key={item.napa_id}>
                  <td>{item.napa_name}</td>
                  <td>{item.amount}</td>
                  <td>{item.sangh}</td>
                  <td>{item.pardesh}</td>
                  <td>{item.isthaniye}</td>
                  <td>{item.sanchitkosh}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>No data loaded</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VoucherSummary;
