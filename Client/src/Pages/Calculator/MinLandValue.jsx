import React, { useEffect, useState } from 'react'
import {daamToRopani} from '../../Utils/daamToRopani';
import {ropaniToDaam} from '../../Utils/ropaniToDaam';
import './MinLandValue.scss';
const MinLandValue = () => {
    const initialdata = {
        kittano: 0,
        ropanirate: 0,
        area: '',
        areaunits: 0,
        totamount: 0
    }
    const [data, setData] = useState(initialdata);    
    const [strdata, setStrdata] = useState([]);    
    const [totareaunits,settotareaunits]=useState();
    const [totamount,settotamount]=useState(0);
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })        
    }
    useEffect(() => {
        const x = data.ropanirate / 256 * data.areaunits;
        setData({ ...data, totamount: Math.round(x) })
    }, [data.areaunits, data.ropanirate]);

    const changedata = (e) => {
        const x = e.target.value;
        console.log('x', x);
        const y = x.replaceAll(".", "-");
        setData({ ...data, area: y });        
    }

    useEffect(() => {
        const tot =ropaniToDaam(data.area) ;
        setData({ ...data, areaunits: tot });
    },
        [data.area])

    const showtot = () => {
        var x=0;
        var y=0;
        if(strdata){        
        strdata.forEach((a) => {
            x=x+a.totamount;
            y=y+a.areaunits;
        })
        settotamount(x);
        settotareaunits(daamToRopani(y));
        
    }
    }
    const save = (e) => {
        e.preventDefault();
        var x =[];
        if(localStorage.getItem('mindata')){
        x =JSON.parse(localStorage.getItem('mindata'));
        }
        console.log(x);
        x.push(data);
        console.log(x);       
        localStorage.setItem('mindata', JSON.stringify(x));
        loadStorageData();
        setData(initialdata);        
        }      
    const cleardata=()=>{
        const confirm=window.confirm('के तपाई सबै डाटा हटाउन चाहानु हुन्छ ?')
        if(confirm){
            localStorage.removeItem('mindata');
            loadStorageData();
            settotamount(0);
            settotareaunits(daamToRopani(0));
            
        }
    }     

    const loadStorageData = () => {
        setStrdata(JSON.parse(localStorage.getItem('mindata')))
    }
    useEffect(() => {
        loadStorageData();  
       
    }, [])

    useEffect(()=>{
 showtot();
    },[strdata])



    return (
        <section>
            <div className='maindiv width900'>
                <form  className='maindiv width900' onSubmit={save}>
                <div className="items">
                    <label className="label">कित्ता नं</label>
                    <input type="number" name="kittano"  className="form-input" onChange={handleChange} value={data.kittano} min={1} required />
                </div>
                <div className="items">
                    <label className="label">प्रतिरोपनी मुल्य:</label>
                    <input type="number" name="ropanirate" className="form-input" onChange={handleChange} min={1} value={data.ropanirate} required />
                </div>
                <div className="items">
                    <label className="label">रो.आ.पै.दा</label>
                    <input type="text" name="area" onKeyUp={changedata} className="form-input" onChange={handleChange} value={data.area} required />
                </div>                
                <div className="items">
                    <label className="label">जम्मा मुल्य</label>
                    <input type="text" name="totamount" className="form-input" readOnly value={data.totamount} />
                </div>
                <div className="items">
                    <label className="label">सेभ</label>
                    <input type="submit" value="सेभ" className='button small' />                    
                </div>
<div className="items">
                    <label className="label">हटाउनुहोस्</label>
                    <button onClick={cleardata} className='button small'>हटाउनुहोस्</button>
                </div>
                </form>
                
            </div>
            <div className="seconddiv">
                <table className='listvoucher__list__table width900'>
                    <thead>
                    <tr>
                        <th>कित्ता नं</th>
                        <th>प्रतिरोपनी मुल्य</th>
                        <th>क्षेत्रफल</th>
                        <th>जम्मा मुल्य</th>
                        </tr></thead>
                        <tbody>
                            {strdata?strdata.map((item,i)=>{
                                return <tr key={i}>
                                    <td>{item.kittano}</td>
                                <td>{item.ropanirate}</td>
                                <td>{item.area}</td>
                                <td>{item.totamount}</td>
                                </tr>
                            }):null}
                            <tr><td colSpan={2}>जम्मा</td>
                            <td>{totareaunits}</td>
                            <td>{totamount}</td></tr>
                            
                                </tbody></table>
            </div>
        </section>
    )
}

export default MinLandValue