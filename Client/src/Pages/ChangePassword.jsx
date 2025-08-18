import React, { useState } from 'react'
import PageHeaderComponent from '../Components/PageHeaderComponent'
import { BsInfoCircleFill } from "react-icons/bs"
import  "./Changepassword.scss";
import { useNavigate} from 'react-router-dom';
import { useEffect } from 'react';
import axiosInstance from "../axiosInstance"
import { toast } from 'react-toastify';
const ChangePassword = () => {
    const Url = import.meta.env.VITE_API_URL + "auth/";
    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
    const initialdata={
        user_id:loggedUser.id,
        oldpassword:"",
        newpassword:"",
        confirmpassword:""
    }
    const [data,setdata]=useState(initialdata);    
    const navigate = useNavigate();
    const handleSubmit =async(e)=>{
        e.preventDefault();
        console.log(data);
       if (data.oldpassword==data.newpassword) {
            toast.warning("पुरानो र नयाँ पासवर्ड एकै हुन सक्दैन ।");
            return;
        }  
        if (data.newpassword != data.confirmpassword) {
            toast.warning("पासवर्ड र पुन पासवर्ड मिलेन ।");
            return;
        }
        const url=  Url + "changepassword";
        const response = await axiosInstance.post(url,data);        
        console.log(response.data)
        if(response.data.status==true){
            toast.success(response.data.message);
            navigate("/logout");
        }
        else {
            toast.warning(response.data.message);
        }  
    }

    const handleChange =(e)=>{
        setdata({...data,[e.target.name]:e.target.value})
    }
    useEffect(() => {
        document.title = "MOMS | पासवर्ड परिवर्तन";
    }, [])
    

    return (<section id='changepassword' className='changepassword'>
        <PageHeaderComponent
            headerText="पासवर्ड परिवर्तन फाराम"
            icon={<BsInfoCircleFill size={40} />}
        />
        <div className='changepassword__div'>
            <form onSubmit={handleSubmit}>
           <input type="password" onChange={handleChange} className='changepassword__div__input' name='oldpassword'  placeholder='पुरानो पासवर्ड' required/>
           <input type="password" onChange={handleChange} className='changepassword__div__input' name='newpassword'  placeholder='नयाँ पासवर्ड' required/>
           <input type="password" onChange={handleChange} className='changepassword__div__input' name='confirmpassword'  placeholder='फेरी नयाँ पासवर्ड'required />
           <input type="submit" value="पासवर्ड परिवर्तन" className='changepassword__div__button'/>
           </form>
        </div>
    </section>
    )
}
export default ChangePassword;