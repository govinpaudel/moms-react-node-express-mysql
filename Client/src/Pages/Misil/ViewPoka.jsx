import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ViewPoka.scss';
import { toast } from 'react-toastify';

const ViewPoka = () => {
    const location = useLocation();
    const [header, setheader] = useState([]);
    const [details, setdetails] = useState([]);
    const [show, setshow] = useState(false);
    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
    const initialdata={
        id:0,
        poka_id: location.state.id,
        miti:'',
        minum:'',
        nibedakname:'',
        nibedakaddress:'',
        jaggadhaniname:'',
        jaggadhaniaddress:'',
        created_by_user_id:loggedUser.id
    }    
    const [misil,setmisil]=useState(initialdata);
    const Url = import.meta.env.VITE_API_URL + "Misil/";
    const loadHeaderData = async () => {
        const data = {
            id: location.state.id
        }
        const response = await axios({
            method: 'post',
            url: Url + 'getPokaById',
            data: data
        })
        console.log(response);
        setheader(response.data.data[0]);

    }

    const loadPokaDetails = async () => {
        const data = {
            id: location.state.id
        }
        const response = await axios({
            method: 'post',
            url: Url + 'getPokaDetailsById',
            data: data
        })
        console.log(response);
        setdetails(response.data.data);
    }

    const toggleform = () => {
        setshow(!show);
    }

    const handleSumbit = async (e) => {
        e.preventDefault();
        console.log(misil);
        const response= await axios({
            method:'post',
            url:Url+'AddOrUpdateMisil',
            data:misil
        })
        console.log(response);
        if(response.data.status==true){
            toast.success(response.data.message);
            setmisil(initialdata);
            loadPokaDetails();
            loadHeaderData();
            setshow(false);
        }
    }
    const handleChange= (e)=>{
        setmisil({...misil,[e.target.name]:e.target.value})
        console.log(misil);
    }
    const changeFormat =(e)=>{
        console.log(e.target.value);
    }
 const handleEdit = async(e)=>{
    setshow(true);
    console.log(e)
    const data={
        id:e
    }
    const response= await axios({
        method:'POST',
        url:Url+'getMisilById',
        data:data
    })
    console.log(response);
    setmisil(response.data.data[0])
 }
 const handleDelete =async(e)=>{
    const yes=confirm("के तपाई यो मिसिल हटाउन चहानुहुन्छ ?")
    if(yes){
const data={
    id:e,
    poka_id: location.state.id
}
const response= await axios({
    method:'POST',
    url:Url+'deleteMisilById',
    data:data
})
console.log(response);
if(response.data.status==true){
    toast.success(response.data.message);
    loadHeaderData();
    loadPokaDetails();
}
}

 }
    useEffect(() => {
        loadHeaderData();
        loadPokaDetails();
    }, [])
    return (
        <section className='maindiv'>
            <div className='row'>
                <div className="rowitem">
                    <h3 className='headertext'>आ.व:</h3>
                    <h3 className='headertext'>{header.aaba_name}</h3>
                </div>
                <div className="rowitem">
                    <h3 className='headertext'>मिसिल प्रकार:</h3>
                    <h3 className='headertext'>{header.misil_type_name}</h3>
                </div>
                <div className="rowitem">
                    <h3 className='headertext'>पोका नं: </h3>
                    <h3 className='headertext'>{header.misil_poka_name}</h3>
                </div>
                <div className="rowitem">
                    <h3 className='headertext'>फाँट:</h3>
                    <h3 className='headertext'>{header.fant}</h3>
                </div>
                <div className="rowitem">
                    <h3 className='headertext'>मिसिल संख्या:</h3>
                    <h3 className='headertext'>{header.misilcount}</h3>
                </div>
                <div className="rowitem">
                    <h3 className='headertext'>प्रयोगकर्ता:</h3>
                    <h3 className='headertext'>{header.nepname}</h3>
                </div>
                <div className="rowitem">
                    <h3 className='headertext'>कैफियत:</h3>
                    <h3 className='headertext'>{header.remarks}</h3>
                </div>
            </div>
            {show ?
                <form onSubmit={handleSumbit} className='maindiv no-print'>
<div className="row">
    <div className="rowitem">
    <label className='label'>मिति</label>
    <input type="text" name='miti' className='input miti' onKeyUp={changeFormat} onChange={handleChange} value={misil.miti} required autoComplete='off'/>
    </div>
    <div className="rowitem">
    <label className='label'>मिसिल नं</label>
    <input type="text" name='minum' className='input miti' onChange={handleChange} value={misil.minum} required autoComplete='off'/>
    </div>
    <div className="rowitem">
    <label className='label'>निवेदकको नाम</label>
    <input type="text" name='nibedakname' className='input' onChange={handleChange} value={misil.nibedakname} required autoComplete='off'/>
    </div>
    <div className="rowitem">
    <label className='label'>निवेदकको ठेगाना</label>
    <input type="text" name='nibedakaddress' className='input' onChange={handleChange} value={misil.nibedakaddress} required autoComplete='off'/>
    </div>
    
</div>
<div className="row">
    <div className="rowitem">
    <label className='label'>जग्गाधनीको नाम</label>
    <input type="text" name='jaggadhaniname' className='input' onChange={handleChange} value={misil.jaggadhaniname} required autoComplete='off'/>
    </div>
    <div className="rowitem">
    <label className='label'>जग्गाधनीको ठेगाना</label>
    <input type="text" name='jaggadhaniaddress' className='input' onChange={handleChange} value={misil.jaggadhaniaddress} required autoComplete='off'/>
    </div>
    <div className="rowitem no-print">
        <input type="submit" value="(+) मिसिल थप गर्नुहोस्" className='addbtn'/>    
    </div>
    <div className="rowitem">
    <button className='addbtn' onClick={toggleform}> रद्द गर्नुहोस्</button>
    
    </div>    
</div>                  
</form>
:
<div className='maindiv-row add no-print'>
<button className='addbtn' onClick={toggleform}>(+) मिसिल थप गर्नुहोस्</button>
</div>
}
<div className='maindiv-row'>
                <table className='listvoucher__list__table'>
                    <thead><tr>
                        <th>मिति</th>
                        <th>मिसिल नं</th>
                        <th>निवेदकको नाम</th>
                        <th>निवेदकको ठेगाना</th>
                        <th>जग्गाधनीको नाम</th>
                        <th>जग्गाधनीको ठेगाना</th>
                        <th className='no-print'>कृयाकलाप</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            details ? details.map(
                                (item, i) => {
                                    return <tr key={i}>
                                        <td>{item.miti}</td>
                                        <td>{item.minum}</td>
                                        <td>{item.nibedakname}</td>
                                        <td>{item.nibedakaddress}</td>
                                        <td>{item.jaggadhaniname}</td>
                                        <td>{item.jaggadhaniaddress}</td>
                                        <td className='no-print'><button className='btnedit' onClick={
                                            ()=>{
                                                handleEdit(item.misil_id)}
                                            }>संशोधन</button>
                                        <button className='btndelete' onClick={
                                            ()=>{handleDelete(item.misil_id)}}>हटाउनुहोस्</button></td>
                                    </tr>
                                }
                            ) : null
                        }
                    </tbody>
                </table>
            </div>

        </section>

    )
}

export default ViewPoka