import React, { useEffect, useState } from 'react';
import { ropaniToDaam } from '../../Utils/ropaniToDaam';
import { daamToRopani } from '../../Utils/daamToRopani';
import './DivideArea.scss';
const DivideArea = () => {
  const [area, setArea] = useState('1-0-0-0')
  const [bhag, setBhag] = useState(1)
  const [data,setData]=useState([]);
  const changeArea = (e) => {
    const x = e.target.value;
    const y = x.replaceAll(".", "-");
    setArea(y);
  }
  const handleArea = (e) => {
    setArea(e.target.value)
  }
  const handleBhag = (e) => {
    setBhag(e.target.value)
  }
  const doDivide=()=>{
    var x =[];
    var totunits=ropaniToDaam(area);
    var perbhag=Math.floor(totunits/bhag);
    var baaki=totunits-(perbhag*bhag);
    console.log('total',totunits);
    console.log('perbhag',perbhag);
    console.log('baaki',baaki)
    for (var i=0; i < bhag; i++) {
    const y={      
      data:daamToRopani(perbhag)
    }       
    x.push(y);
    }
    const z={
      data:'बाँकी ' +daamToRopani(baaki)
    }
    x.push(z)
    console.log(x);
    setData(x);
  }
  useEffect(()=>{
    doDivide();
  },[area,bhag])

  return (
    <section className='addsubarea'>
      <div className="addition">
        <h1 className='heading'>क्षेत्रफल र भाग पृविष्ट गर्नुहोस्</h1>
        <table className='listvoucher__list__table'><thead><tr><th>रो.आ.पै.दा</th><th>भाग</th></tr></thead>
          <tbody>
            <tr>
              <td>
                <input type="text" name="area" onKeyUp={changeArea} className="form-input" onChange={handleArea} value={area} required />
              </td>
              <td>
                <input type="number" name="bhag" min={1} className="form-input" onChange={handleBhag} value={bhag} required />
              </td>
            </tr>
            {data?data.map((item,i)=>{
              return <tr key={i}><td>{i+1}</td><td>{item.data}</td></tr>
            }):null}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default DivideArea