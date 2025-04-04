import React from 'react'
import PageHeaderComponent from '../Components/PageHeaderComponent'
import { BsInfoCircleFill } from "react-icons/bs"
import "./ResetPassword.scss";
import { Link } from 'react-router-dom';
const ResetPassword = () => {
    const handleSubmit=async(e)=>{
e.preventDefault();
    }


    return (<section id='resetpassword' className='resetpassword'>
        <PageHeaderComponent
            headerText="पासवर्ड रिसेट फाराम"
            icon={<BsInfoCircleFill size={40} />}
        />
        <div className='resetpassword__div'>
        <form onSubmit={handleSubmit}>
           <input type="text" className='resetpassword__div__input' name='idoremail'  placeholder='आईडी अथवा ईमेल' required/>           
           <input type="submit" value="पासवर्ड रिसेट" className='resetpassword__div__button'/>
           </form>
        </div>
        <h5 className="login__form-outer__footer-text">
          <Link to="/login">Go Back</Link>
        </h5>


    </section>
    )
}
export default ResetPassword;