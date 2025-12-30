import { useState,useEffect } from "react"
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";
const Datasync = () => {
  const {axiosInstance}=useAuth();
  const [date,setDate]=useState()
  const [ip,setIp]=useState('127.0.0.1');
  const [data,setData]=useState();
  const [ndata,setNdata]=useState();  
  const [summary, setSummary] = useState([]);
  const downloadData=async()=>{
    if(!date){
      toast.warning('कृपया मिति छान्नुहोस्')
      return;
    }
    const data={
      date:date,
      tables:[
  "voucher_aabas",
  "voucher_acc_sirshak",
  "voucher_badhfadh",
  "voucher_deleted",
  "voucher_details",
  "voucher_fant",
  "voucher_message",
  "voucher_modules",
  "voucher_month", 
  "voucher_offices",
  "voucher_parameter",
  "voucher_sirshak",
  "voucher_state",
  "voucher_users",
  "voucher_user_modules",
  "voucher_user_roles"
]
    }    
    const response=await axiosInstance.post("downloadRecords",data)
    setData(response.data.data)
    setNdata(response.data)
    console.log(response);
  }
  const updateToServer=async()=>{
    if(!ndata){
      toast.warning('कुनै पनि डाटा छैन')
      return;
    }
    if(!ip){
      toast.warning('कृपया IP प्रविष्ट गर्नु होस्')
      return;
    }
    const response=await axiosInstance.post(`http://${ip}/api/sync/voucher.php`,ndata)
    console.log(response);
    if (response.data.status===true){
      toast.success(response.data.message);
    }
  }
useEffect(() => {
    if (!data || typeof data !== "object") return;

    const tableSummary = Object.entries(data).map(
      ([tableName, records]) => ({
        table: tableName,
        count: Array.isArray(records) ? records.length : 0,
      })
    );

    setSummary(tableSummary);
  }, [data]);

  const totalRecords = summary.reduce(
    (sum, row) => sum + row.count,
    0
  );

  return (
    <div className='container'>
      <div className="row">
        <div className="col">
          <input type="date" className='form-control' onChange={(e)=>{
            setDate(e.target.value)
          }} />
        </div>
        <div className="col">
          <button className='btn btn-primary' onClick={downloadData}>डाटा डाउनलोड गर्नुहोस्</button>
        </div>
        <div className="col">
          <input type="text" placeholder='Ip Address' className='form-control' onChange={(e)=>{
            setIp(e.target.value)
          }} />
        </div>
        <div className="col">
          <button className='btn btn-info' onClick={updateToServer}>डाटा सेभ गर्नुहोस्</button>
        </div>
      </div>
<table className="table table-bordered table-striped table-hover fs-4">
        <thead className="table-dark">
          <tr>
            <th style={{ width: "60px" }}>#</th>
            <th>Table Name</th>
            <th className="text-end">Record Count</th>
          </tr>
        </thead>

        <tbody>
          {summary.map((row, index) => (
            <tr key={row.table}>
              <td>{index + 1}</td>
              <td>
                <span className="badge bg-primary">
                  {row.table}
                </span>
              </td>
              <td className="text-end fw-bold">
                {row.count}
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot className="table-secondary">
          <tr>
            <th colSpan="2" className="text-end">
              Total Records
            </th>
            <th className="text-end">
              {totalRecords}
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default Datasync
